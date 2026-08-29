use std::env;
use switchboard_on_demand::surge::{SurgeClient, SurgeMessage};
use tokio::time::Duration;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let api_key = env::var("SURGE_API_KEY").expect("SURGE_API_KEY environment variable not set");

    let client = SurgeClient::builder(api_key).build()?;
    let (handle, mut receiver) = client.start().await;

    println!("1. Subscribing to BTC and SOL...");
    handle
        .subscribe(vec!["BTC/USD".into(), "SOL/USD".into()])
        .await?;

    // Wait for Subscribed message to get bundle_id
    let mut bundle_id = None;
    while let Some(msg) = receiver.recv().await {
        match msg {
            SurgeMessage::Subscribed {
                feed_bundle_id,
                feeds,
            } => {
                println!("   Subscribed to bundle: {}", feed_bundle_id);
                println!(
                    "   Feeds: {:?}",
                    feeds.iter().map(|f| &f.symbol).collect::<Vec<_>>()
                );
                bundle_id = Some(feed_bundle_id);
                break;
            }
            SurgeMessage::Authenticated => {
                println!("   Authenticated");
            }
            _ => {}
        }
    }

    let bundle_id = bundle_id.expect("Should have received bundle_id");

    println!("\n2. Receiving updates for 5 seconds...");
    let mut count = 0;
    let timeout = tokio::time::sleep(Duration::from_secs(5));
    tokio::pin!(timeout);

    loop {
        tokio::select! {
            Some(msg) = receiver.recv() => {
                if let SurgeMessage::PriceUpdate { values, .. } = msg {
                    println!("   Got: {:?}", values.iter().map(|v| &v.symbol).collect::<Vec<_>>());
                    count += 1;
                }
            }
            _ = &mut timeout => break,
        }
    }
    println!("   Received {} updates", count);

    println!("\n3. Unsubscribing bundle: {}...", bundle_id);
    handle.unsubscribe_bundle(bundle_id).await?;

    println!("   Waiting for unsubscribe confirmation...");
    let mut _confirmed = false;
    let timeout = tokio::time::sleep(Duration::from_secs(2));
    tokio::pin!(timeout);

    loop {
        tokio::select! {
            Some(msg) = receiver.recv() => {
                match msg {
                    SurgeMessage::Unsubscribed { feed_bundle_ids } => {
                        println!("   ✓ Confirmed unsubscribed from bundles: {:?}", feed_bundle_ids);
                        _confirmed = true;
                        break;
                    }
                    SurgeMessage::PriceUpdate { .. } => {
                        // Ignore price updates while waiting
                    }
                    _ => {}
                }
            }
            _ = &mut timeout => {
                println!("   ⚠ No confirmation received (timeout)");
                break;
            }
        }
    }

    println!("\n4. Waiting 5 seconds to verify no more updates...");
    let timeout = tokio::time::sleep(Duration::from_secs(5));
    tokio::pin!(timeout);

    let mut updates_after_unsub = 0;
    loop {
        tokio::select! {
            Some(msg) = receiver.recv() => {
                if let SurgeMessage::PriceUpdate { values, .. } = msg {
                    println!("   ERROR: Still receiving updates: {:?}",
                        values.iter().map(|v| &v.symbol).collect::<Vec<_>>());
                    updates_after_unsub += 1;
                }
            }
            _ = &mut timeout => break,
        }
    }

    if updates_after_unsub == 0 {
        println!("    SUCCESS: No updates received after unsubscribe!");
    } else {
        println!(
            "    FAIL: Received {} updates after unsubscribe",
            updates_after_unsub
        );
    }

    println!("\nTest complete!");
    Ok(())
}
