use crate::surge::error::{Result, SurgeError};
use serde::Deserialize;

/// Response from session request
#[derive(Debug, Deserialize)]
pub struct SessionResponse {
    pub session_token: String,
    pub oracle_ws_url: String,
}

// src/gateway.rs
/// Request a stream session from the gateway
pub async fn request_session(gateway_url: &str, api_key: &str) -> Result<SessionResponse> {
    let session_url = format!("{}/gateway/api/v1/request_stream", gateway_url);

    let client = reqwest::Client::new();
    let response = client
        .post(&session_url)
        .header("X-API-Key", api_key)
        .header("Content-Type", "application/json")
        .json(&serde_json::json!({})) // Empty body
        .send()
        .await
        .map_err(|e| SurgeError::Gateway(format!("Failed to request session: {}", e)))?;

    if !response.status().is_success() {
        let status = response.status();
        let body = response.text().await.unwrap_or_default();
        return Err(SurgeError::Gateway(format!(
            "Session request failed: {} - {}",
            status, body
        )));
    }

    let session: SessionResponse = response
        .json()
        .await
        .map_err(|e| SurgeError::Gateway(format!("Failed to parse session response: {}", e)))?;

    Ok(session)
}
