use crate::surge::error::{Result, SurgeError};
use crate::surge::protocol::{SurgeMessage, SurgeRequest, SurgeResponse};
use futures::{SinkExt, StreamExt};
use tokio::net::TcpStream;
use tokio_tungstenite::{
    connect_async,
    tungstenite::{client::IntoClientRequest, Message},
    MaybeTlsStream, WebSocketStream,
};

/// Low-level WebSocket connection to Surge gateway
pub struct SurgeWsConnection {
    ws_stream: WebSocketStream<MaybeTlsStream<TcpStream>>,
    url: String,
}

impl SurgeWsConnection {
    /// Connect to Surge gateway with session authentication
    ///
    /// # Arguments
    /// * `url` - WebSocket URL from session response
    /// * `api_key` - Surge API key
    /// * `session_token` - Session token from gateway
    pub async fn connect(url: String, api_key: String, session_token: String) -> Result<Self> {
        let auth_token = format!("Bearer {}:{}", api_key, session_token);

        let mut request = url
            .clone()
            .into_client_request()
            .map_err(|e| SurgeError::Connection(format!("Invalid URL: {}", e)))?;

        request.headers_mut().insert(
            "Authorization",
            auth_token
                .parse()
                .map_err(|e| SurgeError::Connection(format!("Invalid auth header: {}", e)))?,
        );

        let (ws_stream, _) = connect_async(request)
            .await
            .map_err(|e| SurgeError::Connection(format!("Failed to connect: {}", e)))?;

        Ok(Self { ws_stream, url })
    }

    /// Subscribe to price feeds and return the bundle ID
    ///
    pub async fn subscribe(&mut self, feeds: Vec<String>) -> Result<()> {
        let symbols: Vec<(&str, &str)> = feeds
            .iter()
            .filter_map(|f| {
                let parts: Vec<&str> = f.split('/').collect();
                if parts.len() == 2 {
                    Some((parts[0], parts[1]))
                } else {
                    None
                }
            })
            .collect();

        let request = crate::surge::protocol::create_subscribe_request(symbols, "WEIGHTED");
        self.send_request(request).await?;

        Ok(())
    }
    pub async fn unsubscribe_bundle(&mut self, bundle_ids: Vec<String>) -> Result<()> {
        let request = SurgeRequest::Unsubscribe {
            feed_bundle_ids: Some(bundle_ids),
            feed_bundles: None,
        };

        self.send_request(request).await
    }

    async fn send_request(&mut self, request: SurgeRequest) -> Result<()> {
        let json = serde_json::to_string(&request)?;
        self.ws_stream
            .send(Message::Text(json))
            .await
            .map_err(|e| SurgeError::Connection(format!("Failed to send message: {}", e)))?;
        Ok(())
    }

    pub async fn next_message(&mut self) -> Result<Option<SurgeMessage>> {
        loop {
            match self.ws_stream.next().await {
                Some(Ok(Message::Text(text))) => {
                    let response: SurgeResponse = serde_json::from_str(&text)?;
                    return Ok(Some(response.into()));
                }
                Some(Ok(Message::Close(_))) => {
                    return Ok(None);
                }
                Some(Ok(Message::Ping(_))) | Some(Ok(Message::Pong(_))) => {
                    continue;
                }
                Some(Ok(Message::Binary(_))) => {
                    return Err(SurgeError::Gateway("Unexpected binary message".to_string()));
                }
                Some(Ok(Message::Frame(_))) => {
                    continue;
                }
                Some(Err(e)) => return Err(SurgeError::WebSocket(e)),
                None => {
                    return Ok(None);
                }
            }
        }
    }

    /// Close the WebSocket connection
    pub async fn close(&mut self) -> Result<()> {
        self.ws_stream
            .close(None)
            .await
            .map_err(|e| SurgeError::Connection(format!("Failed to close connection: {}", e)))?;
        Ok(())
    }

    /// Get the connection URL
    pub fn url(&self) -> &str {
        &self.url
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_serialize_subscribe() {
        use crate::surge::protocol::create_subscribe_request;
        let request = create_subscribe_request(vec![("BTC", "USD"), ("SOL", "USD")], "WEIGHTED");
        let json = serde_json::to_string(&request).unwrap();

        assert!(json.contains(r#""type":"Subscribe"#));
        assert!(json.contains("BTC"));
        assert!(json.contains("SOL"));
        assert!(json.contains("WEIGHTED"));
    }

    #[test]
    fn test_serialize_unsubscribe_bundle_ids() {
        let request = SurgeRequest::Unsubscribe {
            feed_bundle_ids: Some(vec!["abc123".to_string()]),
            feed_bundles: None,
        };
        let json = serde_json::to_string(&request).unwrap();

        assert!(json.contains(r#""type":"Unsubscribe"#));
        assert!(json.contains(r#""feed_bundle_ids"#));
        assert!(json.contains("abc123"));
    }
}
