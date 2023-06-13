macro_rules! cfg_solana {
    ($($item:item)*) => {
        $(
            #[cfg(target_os = "solana")]
            $item
        )*
    }
}

macro_rules! cfg_not_solana {
    ($($item:item)*) => {
        $( #[cfg(not(target_os = "solana"))] $item )*
    }
}

macro_rules! cfg_client {
    ($($item:item)*) => {
        $(
            #[cfg(feature = "client")]
            #[cfg_attr(docsrs, doc(cfg(feature = "client")))]
            $item
        )*
    }
}

macro_rules! cfg_not_client {
    ($($item:item)*) => {
        $( #[cfg(not(feature = "client"))] $item )*
    }
}
