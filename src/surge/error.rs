use thiserror::Error;

#[derive(Error, Debug)]
pub enum SurgeError {
    #[error("WebSocket error: {0}")]
    WebSocket(#[from] tokio_tungstenite::tungstenite::Error),

    #[error("JSON serialization error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("Connection error: {0}")]
    Connection(String),

    #[error("Subscription error: {0}")]
    Subscription(String),

    #[error("Invalid URL: {0}")]
    InvalidUrl(String),

    #[error("Authentication failed")]
    AuthenticationFailed,

    #[error("Gateway error: {0}")]
    Gateway(String),
}

pub type Result<T> = std::result::Result<T, SurgeError>;
