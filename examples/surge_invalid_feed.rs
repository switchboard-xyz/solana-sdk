use std::env;
use switchboard_on_demand::surge::{SurgeClient, SurgeMessage};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let api_key = env::var("SURGE_API_KEY")?;
    let client = SurgeClient::builder(api_key).build()?;
    let (handle, mut receiver) = client.start().await;

    println!("Subscribing to invalid feed (INVALID/FEED)...");
    handle.subscribe(vec!["INVALID/FEED".into()]).await?;

    let mut _bundle_id = None;

    // Wait for subscription confirmation
    while let Some(msg) = receiver.recv().await {
        match msg {
            SurgeMessage::Subscribed {
                feed_bundle_id,
                feeds,
            } => {
                println!("✓ Subscription accepted (Surge doesn't validate symbols)");
                println!("  Bundle: {}", feed_bundle_id);
                println!(
                    "  Feeds: {:?}",
                    feeds.iter().map(|f| &f.symbol).collect::<Vec<_>>()
                );
                _bundle_id = Some(feed_bundle_id);
                break;
            }
            SurgeMessage::Authenticated => {}
            _ => {}
        }
    }

    println!("\nWaiting 10 seconds for price updates...");
    println!("(Invalid feeds should NOT receive updates)");

    let timeout = tokio::time::sleep(tokio::time::Duration::from_secs(10));
    tokio::pin!(timeout);

    let mut got_updates = false;

    loop {
        tokio::select! {
            Some(msg) = receiver.recv() => {
                if let SurgeMessage::PriceUpdate { .. } = msg {
                    println!("✗ Unexpected: Got price update for invalid feed!");
                    got_updates = true;
                }
            }
            _ = &mut timeout => break,
        }
    }

    if !got_updates {
        println!("✓ Correct: No updates for invalid feed");
    }

    Ok(())
}
