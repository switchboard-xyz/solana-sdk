/// Macro to generate Anchor bindings for Switchboard quote accounts
#[macro_export]
macro_rules! switchboard_anchor_bindings {
    () => {
        #[derive(Debug, PartialEq)]
        #[account(zero_copy, discriminator = SwitchboardQuote::DISCRIMINATOR)]
        pub struct SwitchboardQuote {
            pub data: [u8; 1024],
        }

        impl SwitchboardQuote {
            pub const LEN: usize = 1024 + 8;
            pub const DISCRIMINATOR: &[u8; 8] = b"SBOracle";
        }
    };
}
