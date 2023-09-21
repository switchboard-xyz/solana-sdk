/// Macro used to include code if the target_os is not 'solana'.
/// This is intended to be used for code that is primarily for off-chain Switchboard Functions.
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

/// Macro used to include code only if the target_os is 'solana'.
/// This is intended to be used for code that is primarily for on-chain programs.
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

/// Macro used to include code if the feature 'secrets' is enabled.
/// This is intended to be used for code that is primarily for off-chain Switchboard Secrets.
#[macro_export]
macro_rules! cfg_secrets {
    ($($item:item)*) => {
        $(
            #[cfg(not(target_os = "solana"))]
            #[cfg(feature = "secrets")]
            #[cfg_attr(doc_cfg, doc(cfg(not(target_os = "solana"))))]
            #[cfg_attr(doc_cfg, doc(cfg(feature = "secrets")))]
            $item
        )*
    }
}
