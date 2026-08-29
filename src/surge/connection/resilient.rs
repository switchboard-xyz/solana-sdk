use crate::surge::backoff::ExponentialBackoff;
use crate::surge::config::ConnectionConfig;
use crate::surge::connection::ws::SurgeWsConnection;
use crate::surge::error::{Result, SurgeError};
use crate::surge::gateway;
use crate::surge::protocol::SurgeMessage;
use std::collections::HashMap;
use tokio::sync::mpsc;
use tokio::time::{timeout, Duration, Instant};

#[derive(Debug)]
enum ConnectionCommand {
    Subscribe(Vec<String>),
    UnsubscribeBundle(String),
    Shutdown,
}

#[derive(Clone)]
pub struct ResilientSurgeConnection {
    command_tx: mpsc::Sender<ConnectionCommand>,
}

impl ResilientSurgeConnection {
    pub async fn new(
        gateway_url: String,
        api_key: String,
        config: ConnectionConfig,
    ) -> (Self, mpsc::Receiver<SurgeMessage>) {
        let (command_tx, command_rx) = mpsc::channel(32);
        let (message_tx, message_rx) = mpsc::channel(100);

        tokio::spawn(connection_task(
            gateway_url,
            api_key,
            config,
            command_rx,
            message_tx,
        ));

        let handle = Self { command_tx };
        (handle, message_rx)
    }

    /// Subscribe to feeds
    ///
    /// User will receive `SurgeMessage::Subscribed` with the bundle_id assigned by the server.
    /// User must store this bundle_id to unsubscribe later.
    pub async fn subscribe(&self, feeds: Vec<String>) -> Result<()> {
        self.command_tx
            .send(ConnectionCommand::Subscribe(feeds))
            .await
            .map_err(|_| SurgeError::Connection("Connection task closed".to_string()))
    }

    /// Unsubscribe a bundle by its ID
    ///
    /// # Arguments
    /// * `bundle_id` - The bundle ID received from `SurgeMessage::Subscribed`
    pub async fn unsubscribe_bundle(&self, bundle_id: String) -> Result<()> {
        self.command_tx
            .send(ConnectionCommand::UnsubscribeBundle(bundle_id))
            .await
            .map_err(|_| SurgeError::Connection("Connection task closed".to_string()))
    }

    /// Shutdown the connection
    pub async fn shutdown(self) -> Result<()> {
        self.command_tx
            .send(ConnectionCommand::Shutdown)
            .await
            .map_err(|_| SurgeError::Connection("Connection task closed".to_string()))
    }
}

/// State maintained across reconnections
struct ConnectionState {
    // Track bundle_id -> feeds for reconnection
    // Note: bundle IDs change on reconnect, so we track by feeds and get new IDs
    active_bundles: HashMap<String, Vec<String>>,
    backoff: ExponentialBackoff,
    attempt_count: u32,
}

impl ConnectionState {
    fn new(config: &ConnectionConfig) -> Self {
        let backoff = ExponentialBackoff::new(
            Duration::from_millis(config.initial_backoff_ms),
            Duration::from_millis(config.max_backoff_ms),
            config.backoff_multiplier,
        );

        Self {
            active_bundles: HashMap::new(),
            backoff,
            attempt_count: 0,
        }
    }

    fn reset_backoff(&mut self) {
        self.backoff.reset();
        self.attempt_count = 0;
    }

    /// Add a bundle to active tracking
    fn add_bundle(&mut self, bundle_id: String, feeds: Vec<String>) {
        self.active_bundles.insert(bundle_id, feeds);
    }

    /// Remove a bundle from active tracking
    fn remove_bundle(&mut self, bundle_id: &str) {
        self.active_bundles.remove(bundle_id);
    }

    /// Get all active feeds for reconnection (ignoring old bundle IDs)
    fn get_all_feeds_for_reconnection(&self) -> Vec<Vec<String>> {
        self.active_bundles.values().cloned().collect()
    }
}

/// Background task that manages the connection
async fn connection_task(
    gateway_url: String,
    api_key: String,
    config: ConnectionConfig,
    mut command_rx: mpsc::Receiver<ConnectionCommand>,
    message_tx: mpsc::Sender<SurgeMessage>,
) {
    let mut state = ConnectionState::new(&config);

    loop {
        if let Some(max_attempts) = config.max_reconnect_attempts {
            if state.attempt_count >= max_attempts {
                let _ = message_tx
                    .send(SurgeMessage::Error(format!(
                        "Max reconnection attempts ({}) exceeded",
                        max_attempts
                    )))
                    .await;
                return;
            }
        }

        state.attempt_count += 1;

        let session = match gateway::request_session(&gateway_url, &api_key).await {
            Ok(s) => s,
            Err(e) => {
                let _ = message_tx
                    .send(SurgeMessage::Error(format!(
                        "Session request failed: {}",
                        e
                    )))
                    .await;

                let delay = state.backoff.next_delay();
                tokio::time::sleep(delay).await;
                continue;
            }
        };

        match SurgeWsConnection::connect(
            session.oracle_ws_url.clone(),
            api_key.clone(),
            session.session_token,
        )
        .await
        {
            Ok(mut conn) => {
                let _ = message_tx.send(SurgeMessage::Authenticated).await;

                let feeds_to_resubscribe = state.get_all_feeds_for_reconnection();

                state.active_bundles.clear();

                for feeds in feeds_to_resubscribe {
                    if let Err(e) = conn.subscribe(feeds.clone()).await {
                        let _ = message_tx
                            .send(SurgeMessage::Error(format!(
                                "Re-subscription failed: {}",
                                e
                            )))
                            .await;
                    }
                }

                state.reset_backoff();

                if run_connection(&mut conn, &mut command_rx, &message_tx, &mut state, &config)
                    .await
                {
                    let _ = conn.close().await;
                    drop(message_tx);
                    return;
                }
            }
            Err(e) => {
                let _ = message_tx
                    .send(SurgeMessage::Error(format!("Connection failed: {}", e)))
                    .await;
            }
        }

        let delay = state.backoff.next_delay();
        tokio::time::sleep(delay).await;
    }
}

/// Run an active connection, handling messages and commands
///
/// Returns true if shutdown was requested
async fn run_connection(
    conn: &mut SurgeWsConnection,
    command_rx: &mut mpsc::Receiver<ConnectionCommand>,
    message_tx: &mpsc::Sender<SurgeMessage>,
    state: &mut ConnectionState,
    config: &ConnectionConfig,
) -> bool {
    let connection_start = Instant::now();

    loop {
        tokio::select! {
            result = async {
                if let Some(timeout_secs) = config.read_timeout_secs {
                    timeout(
                        Duration::from_secs(timeout_secs),
                        conn.next_message()
                    ).await
                } else {
                    Ok(conn.next_message().await)
                }
            } => {
                match result {
                    Ok(Ok(Some(msg))) => {

                        if connection_start.elapsed() >= config.stable_connection_duration {
                            state.reset_backoff();
                        }

                        if let SurgeMessage::Subscribed { ref feed_bundle_id, ref feeds } = msg {
                            let feed_symbols: Vec<String> = feeds.iter()
                                .map(|f| f.symbol.clone())
                                .collect();
                            state.add_bundle(feed_bundle_id.clone(), feed_symbols);
                        }

                        if message_tx.send(msg).await.is_err() {
                            return true;
                        }
                    }
                    Ok(Ok(None)) => {
                        let _ = message_tx.send(SurgeMessage::Error("Connection closed".to_string())).await;
                        return false;
                    }
                    Ok(Err(e)) => {
                        let _ = message_tx.send(SurgeMessage::Error(format!("Read error: {}", e))).await;
                        return false;
                    }
                    Err(_) => {
                        let timeout_secs = config.read_timeout_secs.unwrap();
                        let _ = message_tx.send(SurgeMessage::Error(
                                format!("Connection timeout - no data received for {} seconds", timeout_secs)
                        )).await;
                        return false;
                    }
                }
            }

            Some(cmd) = command_rx.recv() => {
                match cmd {
                    ConnectionCommand::Subscribe(feeds) => {
                        match conn.subscribe(feeds.clone()).await {
                            Ok(_) => {
                            }
                            Err(e) => {
                                let _ = message_tx.send(SurgeMessage::Error(format!("Subscribe failed: {}", e))).await;
                                return false;
                            }
                        }
                    }
                    ConnectionCommand::UnsubscribeBundle(bundle_id) => {
                        state.remove_bundle(&bundle_id);

                        if let Err(e) = conn.unsubscribe_bundle(vec![bundle_id]).await {
                            let _ = message_tx.send(SurgeMessage::Error(format!("Unsubscribe failed: {}", e))).await;
                            return false;
                        }
                    }
                    ConnectionCommand::Shutdown => {
                        return true;
                    }
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_connection_state_initialization() {
        let config = ConnectionConfig::default();
        let state = ConnectionState::new(&config);

        assert_eq!(state.active_bundles.len(), 0);
        assert_eq!(state.attempt_count, 0);
    }

    #[test]
    fn test_connection_state_add_remove_bundle() {
        let config = ConnectionConfig::default();
        let mut state = ConnectionState::new(&config);

        state.add_bundle("bundle1".to_string(), vec!["BTC/USD".to_string()]);
        assert_eq!(state.active_bundles.len(), 1);

        state.remove_bundle("bundle1");
        assert_eq!(state.active_bundles.len(), 0);
    }

    #[test]
    fn test_connection_state_reset() {
        let config = ConnectionConfig::default();
        let mut state = ConnectionState::new(&config);

        state.attempt_count = 5;
        state.backoff.next_delay(); // Advance backoff

        state.reset_backoff();

        assert_eq!(state.attempt_count, 0);
        assert_eq!(
            state.backoff.current_delay(),
            Duration::from_millis(config.initial_backoff_ms)
        );
    }
}
