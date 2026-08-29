use std::time::Duration;

#[derive(Debug, Clone)]
pub struct ConnectionConfig {
    pub max_reconnect_attempts: Option<u32>,

    pub initial_backoff_ms: u64,

    pub max_backoff_ms: u64,

    pub backoff_multiplier: f64,

    pub stable_connection_duration: Duration,

    pub read_timeout_secs: Option<u64>,
}

impl Default for ConnectionConfig {
    fn default() -> Self {
        Self {
            max_reconnect_attempts: None,
            initial_backoff_ms: 100,
            max_backoff_ms: 30_000,
            backoff_multiplier: 2.0,
            stable_connection_duration: Duration::from_secs(60),
            read_timeout_secs: Some(30),
        }
    }
}

impl ConnectionConfig {
    pub fn validate(&self) -> Result<(), String> {
        if let Some(timeout) = self.read_timeout_secs {
            if timeout < 5 {
                return Err(format!(
                    "read_timeout_secs must be at least 5 seconds, got {}",
                    timeout
                ));
            }
        }

        if self.initial_backoff_ms == 0 {
            return Err("initial_backoff_ms must be greater than 0".to_string());
        }

        if self.max_backoff_ms < self.initial_backoff_ms {
            return Err("max_backoff_ms must be >= initial_backoff_ms".to_string());
        }

        if self.backoff_multiplier < 1.0 {
            return Err("backoff_multiplier must be >= 1.0".to_string());
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = ConnectionConfig::default();
        assert_eq!(config.read_timeout_secs, Some(30));
        assert!(config.validate().is_ok());
    }

    #[test]
    fn test_read_timeout_validation_too_small() {
        let config = ConnectionConfig {
            read_timeout_secs: Some(3),
            ..Default::default()
        };
        assert!(config.validate().is_err());
    }

    #[test]
    fn test_read_timeout_validation_minimum() {
        let config = ConnectionConfig {
            read_timeout_secs: Some(5),
            ..Default::default()
        };
        assert!(config.validate().is_ok());
    }

    #[test]
    fn test_read_timeout_none() {
        let config = ConnectionConfig {
            read_timeout_secs: None,
            ..Default::default()
        };
        assert!(config.validate().is_ok());
    }

    #[test]
    fn test_backoff_validation_zero_initial() {
        let config = ConnectionConfig {
            initial_backoff_ms: 0,
            ..Default::default()
        };
        assert!(config.validate().is_err());
    }

    #[test]
    fn test_backoff_validation_max_less_than_initial() {
        let config = ConnectionConfig {
            initial_backoff_ms: 1000,
            max_backoff_ms: 500,
            ..Default::default()
        };
        assert!(config.validate().is_err());
    }

    #[test]
    fn test_backoff_multiplier_validation() {
        let config = ConnectionConfig {
            backoff_multiplier: 0.5,
            ..Default::default()
        };
        assert!(config.validate().is_err());
    }
}
