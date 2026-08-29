use rust_decimal::Decimal;
use serde::{Deserialize, Serialize};
use std::str::FromStr;

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type")]
pub enum SurgeRequest {
    Subscribe {
        feed_bundles: Vec<FeedBundle>,
        signature_scheme: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        batch_interval_ms: Option<u64>,
    },
    Unsubscribe {
        #[serde(skip_serializing_if = "Option::is_none")]
        feed_bundle_ids: Option<Vec<String>>,

        #[serde(skip_serializing_if = "Option::is_none")]
        feed_bundles: Option<Vec<FeedBundle>>,
    },
}

#[derive(Debug, Clone, Serialize)]
pub struct FeedBundle {
    pub feeds: Vec<Feed>,
}

#[derive(Debug, Clone, Serialize)]
pub struct Feed {
    pub symbol: Symbol,
    pub source: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Symbol {
    pub base: String,
    pub quote: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "type")]
pub enum SurgeResponse {
    #[serde(rename = "Authenticated")]
    Authenticated { message: String },

    #[serde(rename = "Subscribed")]
    Subscribed { feed_bundles: Vec<SubscribedBundle> },

    #[serde(rename = "Unsubscribed")]
    Unsubscribed {
        #[serde(default)]
        feed_bundle_ids: Vec<String>,
    },

    #[serde(rename = "BundledFeedUpdate")]
    BundledFeedUpdate {
        feed_bundle_id: String,
        feed_values: Vec<FeedValue>,
        oracle_response: Box<OracleResponse>,
        source_ts_ms: i64,
        seen_at_ts_ms: i64,
        triggered_on_price_change: bool,
    },

    #[serde(rename = "Error")]
    Error { message: String },
}

#[derive(Debug, Clone, Deserialize)]
pub struct SubscribedBundle {
    pub feed_bundle_id: String,
    pub feeds: Vec<SubscribedFeed>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct SubscribedFeed {
    pub symbol: String,
    pub source: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct FeedValue {
    pub value: String,
    pub feed_hash: String,
    pub symbol: String,
    pub source: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct OracleResponse {
    pub oracle_pubkey: String,
    pub eth_address: String,
    pub signature: String,
    pub checksum: String,
    pub recovery_id: u8,
    pub oracle_idx: u32,
    pub timestamp: i64,
    pub timestamp_ms: i64,
    pub recent_hash: String,
    pub slot: u64,
    pub ed25519_enclave_signer: String,
}

#[derive(Debug, Clone)]
pub enum SurgeMessage {
    Authenticated,
    Subscribed {
        feed_bundle_id: String,
        feeds: Vec<SubscribedFeed>,
    },
    Unsubscribed {
        feed_bundle_ids: Vec<String>,
    },
    PriceUpdate {
        feed_bundle_id: String,
        values: Vec<FeedValue>,
        oracle_response: Box<OracleResponse>,
        timestamp_ms: i64,
    },
    Error(String),
}

impl From<SurgeResponse> for SurgeMessage {
    fn from(response: SurgeResponse) -> Self {
        match response {
            SurgeResponse::Authenticated { .. } => SurgeMessage::Authenticated,
            SurgeResponse::Subscribed { feed_bundles } => {
                if let Some(bundle) = feed_bundles.first() {
                    SurgeMessage::Subscribed {
                        feed_bundle_id: bundle.feed_bundle_id.clone(),
                        feeds: bundle.feeds.clone(),
                    }
                } else {
                    SurgeMessage::Error("Empty subscription response".to_string())
                }
            }
            SurgeResponse::Unsubscribed { feed_bundle_ids } => {
                SurgeMessage::Unsubscribed { feed_bundle_ids }
            }
            SurgeResponse::BundledFeedUpdate {
                feed_bundle_id,
                feed_values,
                oracle_response,
                source_ts_ms,
                ..
            } => SurgeMessage::PriceUpdate {
                feed_bundle_id,
                values: feed_values,
                oracle_response: oracle_response,
                timestamp_ms: source_ts_ms,
            },
            SurgeResponse::Error { message } => SurgeMessage::Error(message),
        }
    }
}

pub fn create_subscribe_request(symbols: Vec<(&str, &str)>, source: &str) -> SurgeRequest {
    let feeds = symbols
        .into_iter()
        .map(|(base, quote)| Feed {
            symbol: Symbol {
                base: base.to_string(),
                quote: quote.to_string(),
            },
            source: source.to_string(),
        })
        .collect();

    SurgeRequest::Subscribe {
        feed_bundles: vec![FeedBundle { feeds }],
        signature_scheme: "Ed25519".to_string(),
        batch_interval_ms: Some(50),
    }
}

impl FeedValue {
    /// Parse price value as Decimal with 18 decimals (standard for USD pairs)
    ///
    /// This is the recommended method for most use cases as Surge uses
    /// 18 decimal places for USD-denominated pairs.
    ///
    /// # Example
    /// ```
    /// # use surge_client::FeedValue;
    /// # use rust_decimal::Decimal;
    /// let feed_value = FeedValue {
    ///     value: "123227181740000000000000".to_string(),
    ///     symbol: "BTC/USD".to_string(),
    ///     feed_hash: "abc123".to_string(),
    ///     source: "WEIGHTED".to_string(),
    /// };
    ///
    /// let price = feed_value.value_as_decimal().unwrap();
    /// assert_eq!(price.to_string(), "123227.18174");
    /// ```
    pub fn value_as_decimal(&self) -> Result<Decimal, rust_decimal::Error> {
        self.value_as_decimal_with_decimals(18)
    }

    /// Parse price value as Decimal with custom decimal places
    ///
    /// # Arguments
    /// * `decimals` - Number of decimal places to divide by (typically 18)
    ///
    /// # Example
    /// ```
    /// # use surge_client::FeedValue;
    /// # use rust_decimal::Decimal;
    /// let feed_value = FeedValue {
    ///     value: "229050980000000000000".to_string(),
    ///     symbol: "SOL/USD".to_string(),
    ///     feed_hash: "def456".to_string(),
    ///     source: "WEIGHTED".to_string(),
    /// };
    ///
    /// let price = feed_value.value_as_decimal_with_decimals(18).unwrap();
    /// assert_eq!(price.to_string(), "229.05098");
    /// ```
    pub fn value_as_decimal_with_decimals(
        &self,
        decimals: u32,
    ) -> Result<Decimal, rust_decimal::Error> {
        let value = Decimal::from_str(&self.value)?;
        let divisor = Decimal::from(10_i128.pow(decimals));
        Ok(value / divisor)
    }

    /// Parse price value as f64 ( may lose precision)
    ///
    /// # Warning
    /// f64 has limited precision. For financial calculations, prefer
    /// `value_as_decimal()` which uses the `Decimal` type.
    pub fn value_as_f64(&self, decimals: u32) -> Result<f64, std::num::ParseFloatError> {
        let decimal = self
            .value_as_decimal_with_decimals(decimals)
            .map_err(|_| "0.0".parse::<f64>().unwrap_err())?;
        Ok(decimal.to_string().parse()?)
    }
}

pub fn create_unsubscribe_by_bundle_ids(bundle_ids: Vec<String>) -> SurgeRequest {
    SurgeRequest::Unsubscribe {
        feed_bundle_ids: Some(bundle_ids),
        feed_bundles: None,
    }
}

pub fn create_unsubscribe_by_feeds(symbols: Vec<(&str, &str)>, source: &str) -> SurgeRequest {
    let feeds = symbols
        .into_iter()
        .map(|(base, quote)| Feed {
            symbol: Symbol {
                base: base.to_string(),
                quote: quote.to_string(),
            },
            source: source.to_string(),
        })
        .collect();

    SurgeRequest::Unsubscribe {
        feed_bundle_ids: None,
        feed_bundles: Some(vec![FeedBundle { feeds }]),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_unsubscribe_oracle_mode_serialization() {
        let request = create_unsubscribe_by_bundle_ids(vec!["6ff4db5569e40316".to_string()]);

        let json = serde_json::to_string(&request).unwrap();

        // Should serialize to:
        // {"type":"Unsubscribe","feed_bundle_ids":["6ff4db5569e40316"]}
        assert!(json.contains(r#""type":"Unsubscribe"#));
        assert!(json.contains(r#""feed_bundle_ids"#));
        assert!(json.contains(r#"6ff4db5569e40316"#));
        assert!(!json.contains(r#"feed_bundles"#));

        println!("Serialized: {}", json);
    }

    #[test]
    fn test_unsubscribe_crossbar_mode_serialization() {
        let request = create_unsubscribe_by_feeds(vec![("BTC", "USD")], "WEIGHTED");

        let json = serde_json::to_string(&request).unwrap();

        assert!(json.contains(r#""type":"Unsubscribe"#));
        assert!(json.contains(r#""feed_bundles"#));
        assert!(!json.contains(r#"feed_bundle_ids"#)); // Should NOT include feed_bundle_ids
    }

    #[test]
    fn test_feed_value_parse_btc() {
        let feed_value = FeedValue {
            value: "123227181740000000000000".to_string(),
            symbol: "BTC/USD".to_string(),
            feed_hash: "4cd1cad9".to_string(),
            source: "WEIGHTED".to_string(),
        };

        let price = feed_value.value_as_decimal().unwrap();
        assert_eq!(price.to_string(), "123227.18174");
    }

    #[test]
    fn test_feed_value_parse_sol() {
        let feed_value = FeedValue {
            value: "229050980000000000000".to_string(),
            symbol: "SOL/USD".to_string(),
            feed_hash: "822512ee".to_string(),
            source: "WEIGHTED".to_string(),
        };

        let price = feed_value.value_as_decimal().unwrap();
        assert_eq!(price.to_string(), "229.05098");
    }

    #[test]
    fn test_feed_value_parse_eth() {
        let feed_value = FeedValue {
            value: "4540000000000000000000".to_string(),
            symbol: "ETH/USD".to_string(),
            feed_hash: "a0950ee5".to_string(),
            source: "WEIGHTED".to_string(),
        };

        let price = feed_value.value_as_decimal().unwrap();
        assert_eq!(price.to_string(), "4540");
    }

    #[test]
    fn test_feed_value_custom_decimals() {
        let feed_value = FeedValue {
            value: "1000000".to_string(),
            symbol: "TEST/USD".to_string(),
            feed_hash: "test".to_string(),
            source: "WEIGHTED".to_string(),
        };

        let price = feed_value.value_as_decimal_with_decimals(6).unwrap();
        assert_eq!(price.to_string(), "1");
    }

    #[test]
    fn test_feed_value_as_f64() {
        let feed_value = FeedValue {
            value: "100000000000000000000".to_string(),
            symbol: "TEST/USD".to_string(),
            feed_hash: "test".to_string(),
            source: "WEIGHTED".to_string(),
        };

        let price = feed_value.value_as_f64(18).unwrap();
        assert_eq!(price, 100.0);
    }
    #[test]
    fn test_deserialize_authenticated() {
        let json = r#"{"type":"Authenticated","message":"Authentication successful"}"#;
        let response: SurgeResponse = serde_json::from_str(json).unwrap();

        match response {
            SurgeResponse::Authenticated { message } => {
                assert_eq!(message, "Authentication successful");
            }
            _ => panic!("Expected Authenticated response"),
        }
    }

    #[test]
    fn test_deserialize_subscribed() {
        let json = r#"{
            "type":"Subscribed",
            "feed_bundles":[{
                "feed_bundle_id":"095c691b7520f591",
                "feeds":[
                {"symbol":"BTC/USD","source":"WEIGHTED"},
                {"symbol":"SOL/USD","source":"WEIGHTED"}
                ]
            }]
        }"#;

        let response: SurgeResponse = serde_json::from_str(json).unwrap();

        match response {
            SurgeResponse::Subscribed { feed_bundles } => {
                assert_eq!(feed_bundles.len(), 1);
                assert_eq!(feed_bundles[0].feed_bundle_id, "095c691b7520f591");
                assert_eq!(feed_bundles[0].feeds.len(), 2);
                assert_eq!(feed_bundles[0].feeds[0].symbol, "BTC/USD");
            }
            _ => panic!("Expected Subscribed response"),
        }
    }

    #[test]
    fn test_deserialize_unsubscribed() {
        let json = r#"{
            "type":"Unsubscribed",
            "feed_bundle_ids":["095c691b7520f591"]
        }"#;

        let response: SurgeResponse = serde_json::from_str(json).unwrap();

        match response {
            SurgeResponse::Unsubscribed { feed_bundle_ids } => {
                assert_eq!(feed_bundle_ids.len(), 1);
                assert_eq!(feed_bundle_ids[0], "095c691b7520f591");
            }
            _ => panic!("Expected Unsubscribed response"),
        }
    }

    #[test]
    fn test_deserialize_bundled_feed_update() {
        let json = r#"{
            "type":"BundledFeedUpdate",
            "feed_bundle_id":"6ff4db5569e40316",
            "feed_values":[
            {
                "value":"122266842415000000000000",
                "feed_hash":"4cd1cad9",
                "symbol":"BTC/USD",
                "source":"WEIGHTED"
            }
            ],
            "oracle_response":{
                "oracle_pubkey":"acb413831a0babf917c781324d0f1b31d42dac362f47a80da94daba626bb13db",
                "eth_address":"14fcff2df9c0d6801ace7d5158ff0dc3bcaa12be",
                "signature":"02pswX1UphKS6hvmYy+gVZfsLbdbXAc7iH/1yTIyPiiFzU6nme+gihA/7fBfDEqW1nsFwCrexs0eH8pX0QTyDw==",
                "checksum":"ulOZ8+lC0hwbfqF+SUv+7L2lwMndOcz5KffkG4aRMDZM0crZYkJWga8HuSVLfYBN48o0Rvv9E3G7JY0sdQWYEgDwnbLygksZ5BkAAAAAAAABgiUS7prdk1GOyhwQWjhCKEGnbFkNsHnuuyg96ywUyqkAADCLb7GFGQwAAAAAAAAAAaCVDuXuEXsuLDDxVKaeF7+0iadhDFCNxfZ+sqFGFtjqAABDuCM/L57sAAAAAAAAAAE=",
                "recovery_id":0,
                "oracle_idx":11,
                "timestamp":0,
                "timestamp_ms":1760019533387,
                "recent_hash":"DYLmcp4AXMF85cgGTWGCoKkjbKFBi2hBgewGXSVXyReM",
                "slot":372242568,
                "ed25519_enclave_signer":"88f1809fc1fb24a21cf9f93c2c3ed36dff813bcb33bab6626a869873fbafc349"
            },
            "source_ts_ms":1760019533387,
            "seen_at_ts_ms":1760019533387,
            "triggered_on_price_change":true
        }"#;

        let response: SurgeResponse = serde_json::from_str(json).unwrap();

        match response {
            SurgeResponse::BundledFeedUpdate {
                feed_bundle_id,
                feed_values,
                oracle_response,
                ..
            } => {
                assert_eq!(feed_bundle_id, "6ff4db5569e40316");
                assert_eq!(feed_values.len(), 1);
                assert_eq!(oracle_response.slot, 372242568);
                assert_eq!(oracle_response.oracle_idx, 11);
                assert!(oracle_response.oracle_pubkey.starts_with("acb41383"));
            }
            _ => panic!("Expected BundledFeedUpdate response"),
        }
    }

    #[test]
    fn test_deserialize_error_response() {
        let json = r#"{"type":"Error","message":"Invalid feed specification"}"#;
        let response: SurgeResponse = serde_json::from_str(json).unwrap();

        match response {
            SurgeResponse::Error { message } => {
                assert_eq!(message, "Invalid feed specification");
            }
            _ => panic!("Expected Error response"),
        }
    }

    #[test]
    fn test_price_parsing_zero() {
        let feed = FeedValue {
            value: "0".to_string(),
            symbol: "TEST/USD".to_string(),
            feed_hash: "test".to_string(),
            source: "WEIGHTED".to_string(),
        };

        let price = feed.value_as_decimal().unwrap();
        assert_eq!(price.to_string(), "0");
    }

    #[test]
    fn test_price_parsing_very_small() {
        let feed = FeedValue {
            value: "1".to_string(),
            symbol: "TEST/USD".to_string(),
            feed_hash: "test".to_string(),
            source: "WEIGHTED".to_string(),
        };

        let price = feed.value_as_decimal().unwrap();
        assert_eq!(price.to_string(), "0.000000000000000001");
    }

    #[test]
    fn test_price_parsing_very_large_overflow() {
        let feed = FeedValue {
            value: "999000000000000000000000000000000".to_string(),
            symbol: "TEST/USD".to_string(),
            feed_hash: "test".to_string(),
            source: "WEIGHTED".to_string(),
        };
        assert!(feed.value_as_decimal().is_err());
    }

    #[test]
    fn test_price_parsing_invalid_string() {
        let feed = FeedValue {
            value: "not_a_number".to_string(),
            symbol: "TEST/USD".to_string(),
            feed_hash: "test".to_string(),
            source: "WEIGHTED".to_string(),
        };

        assert!(feed.value_as_decimal().is_err());
    }

    #[test]
    fn test_price_parsing_empty_string() {
        let feed = FeedValue {
            value: "".to_string(),
            symbol: "TEST/USD".to_string(),
            feed_hash: "test".to_string(),
            source: "WEIGHTED".to_string(),
        };

        assert!(feed.value_as_decimal().is_err());
    }

    #[test]
    fn test_price_parsing_negative() {
        let feed = FeedValue {
            value: "-100000000000000000000".to_string(),
            symbol: "TEST/USD".to_string(),
            feed_hash: "test".to_string(),
            source: "WEIGHTED".to_string(),
        };

        let price = feed.value_as_decimal().unwrap();
        assert_eq!(price.to_string(), "-100");
    }

    #[test]
    fn test_empty_feeds_subscribe_request() {
        let request = create_subscribe_request(vec![], "WEIGHTED");
        let json = serde_json::to_string(&request).unwrap();

        assert!(json.contains(r#""type":"Subscribe"#));
        assert!(json.contains(r#""feeds":[]"#));
    }

    #[test]
    fn test_message_conversion_authenticated() {
        let response = SurgeResponse::Authenticated {
            message: "test".to_string(),
        };
        let msg: SurgeMessage = response.into();

        assert!(matches!(msg, SurgeMessage::Authenticated));
    }

    #[test]
    fn test_message_conversion_error() {
        let response = SurgeResponse::Error {
            message: "test error".to_string(),
        };
        let msg: SurgeMessage = response.into();

        match msg {
            SurgeMessage::Error(e) => assert_eq!(e, "test error"),
            _ => panic!("Expected Error message"),
        }
    }
}
