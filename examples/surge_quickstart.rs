use std::env;
use switchboard_on_demand::surge::{SurgeClient, SurgeMessage};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let api_key = env::var("SURGE_API_KEY").expect("SURGE_API_KEY environment variable not set");

    println!("Connecting to Surge...");

    let client = SurgeClient::builder(api_key).build()?;
    let (handle, mut receiver) = client.start().await;

    println!("Client started");

    let feeds = vec![
        "BTC/USD".to_string(),
        "ETH/USD".to_string(),
        "SOL/USD".to_string(),
    ];

    println!("Subscribing to: {:?}", feeds);
    handle.subscribe(feeds).await?;

    while let Some(msg) = receiver.recv().await {
        match msg {
            SurgeMessage::Authenticated => {
                println!("Authenticated with Surge");
            }
            SurgeMessage::Subscribed {
                feed_bundle_id,
                feeds,
            } => {
                println!("Subscribed to bundle: {}", feed_bundle_id);
                println!(
                    "  Feeds: {:?}",
                    feeds.iter().map(|f| &f.symbol).collect::<Vec<_>>()
                );
            }
            SurgeMessage::Unsubscribed { feed_bundle_ids } => {
                println!("Unsubscribed from bundles : {:?}", feed_bundle_ids);
            }
            SurgeMessage::PriceUpdate {
                feed_bundle_id,
                values,
                oracle_response,
                timestamp_ms,
            } => {
                println!("\nPrice Update [{}] at {}:", feed_bundle_id, timestamp_ms);
                println!(
                    " Oracle: {} (slot: {})",
                    &oracle_response.oracle_pubkey[..8],
                    oracle_response.slot
                );
                for value in values {
                    // Parse to Decimal for precise financial calculations
                    match value.value_as_decimal() {
                        Ok(price) => {
                            println!(
                                "  {} = ${} (hash: {})",
                                value.symbol,
                                price,
                                &value.feed_hash[..8]
                            );
                        }
                        Err(e) => {
                            eprintln!("  Failed to parse {}: {}", value.symbol, e);
                        }
                    }
                }
            }
            SurgeMessage::Error(e) => {
                eprintln!("Error: {}", e);
            }
        }
    }

    Ok(())
}
