use crate::surge::config::ConnectionConfig;
use crate::surge::connection::resilient::ResilientSurgeConnection;
use crate::surge::error::{Result, SurgeError};
use crate::surge::protocol::SurgeMessage;
use tokio::sync::mpsc;

const DEFAULT_GATEWAY_URL: &str = "https://141.94.193.169.xip.switchboard-oracles.xyz/mainnet";

pub struct SurgeClient {
    url: String,
    api_key: String,
    config: ConnectionConfig,
}

impl SurgeClient {
    /// Create a new client builder
    ///
    /// # Example
    /// ```no_run
    /// use surge_client::{SurgeClient, SurgeMessage};
    ///
    /// #[tokio::main]
    /// async fn main() -> Result<(), Box<dyn std::error::Error>> {
    ///     let client = SurgeClient::builder("your-api-key").build()?;
    ///     let (handle, mut receiver) = client.start().await;
    ///     
    ///     // Subscribe returns immediately, bundle_id comes via Subscribed message
    ///     handle.subscribe(vec!["BTC/USD".into()]).await?;
    ///     
    ///     while let Some(msg) = receiver.recv().await {
    ///         match msg {
    ///             SurgeMessage::Subscribed { feed_bundle_id, .. } => {
    ///                 println!("Subscribed to bundle: {}", feed_bundle_id);
    ///                 // Store feed_bundle_id for later unsubscribe
    ///             }
    ///             SurgeMessage::PriceUpdate { values, ..} => {
    ///                 for value in values {
    ///                     println!("{}: ${}", value.symbol, value.value);
    ///                 }
    ///             }
    ///             SurgeMessage::Authenticated => {
    ///                 println!("Connected to Surge");
    ///             }
    ///             _ => {}
    ///         }
    ///     }
    ///     
    ///     Ok(())
    /// }
    /// ```
    pub fn builder(api_key: impl Into<String>) -> SurgeClientBuilder {
        SurgeClientBuilder::new(api_key)
    }

    pub async fn start(self) -> (SurgeClientHandle, mpsc::Receiver<SurgeMessage>) {
        let (connection, receiver) =
            ResilientSurgeConnection::new(self.url, self.api_key, self.config).await;

        let handle = SurgeClientHandle { connection };
        (handle, receiver)
    }
}

pub struct SurgeClientBuilder {
    api_key: String,
    gateway_url: Option<String>,
    config: ConnectionConfig,
}

impl SurgeClientBuilder {
    /// Create a new builder with an API key
    pub fn new(api_key: impl Into<String>) -> Self {
        Self {
            api_key: api_key.into(),
            gateway_url: None,
            config: ConnectionConfig::default(),
        }
    }

    /// Set a custom gateway URL
    ///
    /// By default, uses the official Switchboard gateway.
    ///
    /// # Example
    /// ```
    /// use surge_client::SurgeClient;
    ///
    /// let client = SurgeClient::builder("api-key")
    ///     .gateway_url("https://custom-gateway.example.com")
    ///     .build()
    ///     .unwrap();
    /// ```
    pub fn gateway_url(mut self, url: impl Into<String>) -> Self {
        self.gateway_url = Some(url.into());
        self
    }

    /// Set connection configuration
    ///
    /// # Example
    /// ```
    /// use surge_client::{SurgeClient, ConnectionConfig};
    /// use std::time::Duration;
    ///
    /// let config = ConnectionConfig {
    ///     max_reconnect_attempts: Some(10),
    ///     initial_backoff_ms: 200,
    ///     max_backoff_ms: 60_000,
    ///     backoff_multiplier: 2.0,
    ///     stable_connection_duration: Duration::from_secs(30),
    ///     read_timeout_secs: Some(30),  // <-- ADD THIS LINE
    /// };
    ///
    /// let client = SurgeClient::builder("api-key")
    ///     .config(config)
    ///     .build()
    ///     .unwrap();
    /// ```
    pub fn config(mut self, config: ConnectionConfig) -> Self {
        self.config = config;
        self
    }

    pub fn max_reconnect_attempts(mut self, max: Option<u32>) -> Self {
        self.config.max_reconnect_attempts = max;
        self
    }
    pub fn initial_backoff_ms(mut self, ms: u64) -> Self {
        self.config.initial_backoff_ms = ms;
        self
    }

    pub fn max_backoff_ms(mut self, ms: u64) -> Self {
        self.config.max_backoff_ms = ms;
        self
    }

    /// Set read timeout in seconds
    ///
    /// If no message is received for this duration, the connection is considered dead
    /// and will trigger a reconnection.
    ///
    /// # Arguments
    /// * `secs` - Timeout in seconds (minimum 5), or None to disable timeout
    ///
    /// # Example
    /// ```
    /// use surge_client::SurgeClient;
    ///
    /// // 60 second timeout
    /// let client = SurgeClient::builder("api-key")
    ///     .read_timeout_secs(Some(60))
    ///     .build()
    ///     .unwrap();
    ///
    /// // Disable timeout (wait forever)
    /// let client = SurgeClient::builder("api-key")
    ///     .read_timeout_secs(None)
    ///     .build()
    ///     .unwrap();
    /// ```
    pub fn read_timeout_secs(mut self, secs: Option<u64>) -> Self {
        self.config.read_timeout_secs = secs;
        self
    }

    pub fn build(self) -> Result<SurgeClient> {
        if self.api_key.is_empty() {
            return Err(SurgeError::InvalidUrl(
                "API key cannot be empty".to_string(),
            ));
        }

        self.config
            .validate()
            .map_err(|e| SurgeError::InvalidUrl(format!("Invalid configuration: {}", e)))?;

        let url = self
            .gateway_url
            .unwrap_or_else(|| DEFAULT_GATEWAY_URL.to_string());

        Ok(SurgeClient {
            url,
            api_key: self.api_key,
            config: self.config,
        })
    }
}

#[derive(Clone)]
pub struct SurgeClientHandle {
    connection: ResilientSurgeConnection,
}

impl SurgeClientHandle {
    /// Subscribe to price feeds
    ///
    /// This sends a subscribe request. You'll receive a `SurgeMessage::Subscribed`
    /// message with the `feed_bundle_id` that you need to store for unsubscribing.
    ///
    /// # Arguments
    /// * `feeds` - List of feed symbols (e.g., ["BTC/USD", "SOL/USD"])
    ///
    /// # Example
    /// ```no_run
    /// # use surge_client::{SurgeClient, SurgeMessage};
    /// # #[tokio::main]
    /// # async fn main() -> Result<(), Box<dyn std::error::Error>> {
    /// # let client = SurgeClient::builder("api-key").build()?;
    /// # let (handle, mut receiver) = client.start().await;
    /// // Subscribe to feeds
    /// handle.subscribe(vec![
    ///     "BTC/USD".to_string(),
    ///     "ETH/USD".to_string(),
    /// ]).await?;
    ///
    /// // Wait for Subscribed message to get bundle_id
    /// while let Some(msg) = receiver.recv().await {
    ///     if let SurgeMessage::Subscribed { feed_bundle_id, feeds } = msg {
    ///         println!("Got bundle ID: {}", feed_bundle_id);
    ///         // Store this bundle_id to unsubscribe later
    ///         break;
    ///     }
    /// }
    /// # Ok(())
    /// # }
    /// ```
    pub async fn subscribe(&self, feeds: Vec<String>) -> Result<()> {
        self.connection.subscribe(feeds).await
    }

    /// Unsubscribe from a bundle by its ID
    ///
    /// # Arguments
    /// * `bundle_id` - The bundle ID received from `SurgeMessage::Subscribed`
    ///
    /// # Example
    /// ```no_run
    /// # use surge_client::{SurgeClient, SurgeMessage};
    /// # #[tokio::main]
    /// # async fn main() -> Result<(), Box<dyn std::error::Error>> {
    /// # let client = SurgeClient::builder("api-key").build()?;
    /// # let (handle, mut receiver) = client.start().await;
    /// # handle.subscribe(vec!["BTC/USD".to_string()]).await?;
    /// # let bundle_id = "example-bundle-id".to_string();
    /// // Unsubscribe using the bundle_id you stored earlier
    /// handle.unsubscribe_bundle(bundle_id).await?;
    /// # Ok(())
    /// # }
    /// ```
    pub async fn unsubscribe_bundle(&self, bundle_id: String) -> Result<()> {
        self.connection.unsubscribe_bundle(bundle_id).await
    }

    /// Shutdown the connection gracefully
    ///
    /// # Example
    /// ```no_run
    /// # use surge_client::SurgeClient;
    /// # #[tokio::main]
    /// # async fn main() -> Result<(), Box<dyn std::error::Error>> {
    /// # let client = SurgeClient::builder("api-key").build()?;
    /// # let (handle, mut receiver) = client.start().await;
    /// handle.shutdown().await?;
    /// # Ok(())
    /// # }
    /// ```
    pub async fn shutdown(self) -> Result<()> {
        self.connection.shutdown().await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_builder_basic() {
        let client = SurgeClient::builder("test-api-key").build().unwrap();
        assert_eq!(client.api_key, "test-api-key");
        assert_eq!(client.url, DEFAULT_GATEWAY_URL);
    }

    #[test]
    fn test_builder_custom_url() {
        let custom_url = "https://custom.example.com";
        let client = SurgeClient::builder("test-api-key")
            .gateway_url(custom_url)
            .build()
            .unwrap();

        assert_eq!(client.url, custom_url);
    }

    #[test]
    fn test_builder_empty_api_key() {
        let result = SurgeClient::builder("").build();
        assert!(result.is_err());
    }

    #[test]
    fn test_builder_config() {
        let client = SurgeClient::builder("test-api-key")
            .initial_backoff_ms(500)
            .max_backoff_ms(60_000)
            .max_reconnect_attempts(Some(5))
            .build()
            .unwrap();

        assert_eq!(client.config.initial_backoff_ms, 500);
        assert_eq!(client.config.max_backoff_ms, 60_000);
        assert_eq!(client.config.max_reconnect_attempts, Some(5));
    }

    #[test]
    fn test_builder_full_config() {
        let config = ConnectionConfig {
            max_reconnect_attempts: Some(10),
            initial_backoff_ms: 200,
            max_backoff_ms: 30_000,
            backoff_multiplier: 1.5,
            stable_connection_duration: std::time::Duration::from_secs(120),
            read_timeout_secs: Some(60),
        };

        let client = SurgeClient::builder("test-api-key")
            .config(config.clone())
            .build()
            .unwrap();

        assert_eq!(client.config.initial_backoff_ms, config.initial_backoff_ms);
        assert_eq!(client.config.max_backoff_ms, config.max_backoff_ms);
    }

    #[test]
    fn test_builder_custom_read_timeout() {
        let client = SurgeClient::builder("test-api-key")
            .read_timeout_secs(Some(60))
            .build()
            .unwrap();

        assert_eq!(client.config.read_timeout_secs, Some(60));
    }

    #[test]
    fn test_builder_no_read_timeout() {
        let client = SurgeClient::builder("test-api-key")
            .read_timeout_secs(None)
            .build()
            .unwrap();

        assert_eq!(client.config.read_timeout_secs, None);
    }

    #[test]
    fn test_builder_invalid_read_timeout() {
        let result = SurgeClient::builder("test-api-key")
            .read_timeout_secs(Some(3))
            .build();

        assert!(result.is_err());
    }
}
