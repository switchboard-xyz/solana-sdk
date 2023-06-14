#[macro_export]
macro_rules! cfg_client {
    ($($item:item)*) => {
        $(
            #[cfg(not(target_os = "solana"))]
            #[cfg_attr(doc_cfg, doc(cfg(not(target_os = "solana"))))]
            $item
        )*
    }
}

#[macro_export]
macro_rules! cfg_program {
    ($($item:item)*) => {
        $(
            #[cfg(target_os = "solana")]
            #[cfg_attr(doc_cfg, doc(cfg(target_os = "solana")))]
            $item
        )*
    }
}
