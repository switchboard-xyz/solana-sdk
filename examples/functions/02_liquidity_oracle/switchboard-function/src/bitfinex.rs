// Note: Binance API requires a non-US IP address

use crate::*;

pub use switchboard_utils::reqwest;


use serde::Deserialize;

#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct BitfinexOrdersRow {
    price: String,
    amount: String,
    timestamp: String,
}
#[allow(non_snake_case)]
#[derive(Deserialize, Default, Clone, Debug)]
pub struct BitfinexBook {
    pub bids: Vec<BitfinexOrdersRow>,
    pub asks: Vec<BitfinexOrdersRow>,
}
impl Into<NormalizedBook> for BitfinexBook {
    fn into(self) -> NormalizedBook {
        let book = self;
        let mut res = NormalizedBook::default();
        for bid in book.bids.iter() {
            res.bids.push(NormalizedOrdersRow {
                price: Decimal::try_from(bid.price.as_str()).unwrap(),
                amount: Decimal::try_from(bid.amount.as_str()).unwrap(),
            });
        }
        for ask in book.asks.iter() {
            res.asks.push(NormalizedOrdersRow {
                price: Decimal::try_from(ask.price.as_str()).unwrap(),
                amount: Decimal::try_from(ask.amount.as_str()).unwrap(),
            });
        }
        res.price = res.bids[0]
            .price
            .checked_add(res.asks[0].price)
            .unwrap()
            .checked_div(2.into())
            .unwrap();
        res
    }
}
