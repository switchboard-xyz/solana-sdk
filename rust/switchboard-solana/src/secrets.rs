use crate::*;
use rand::rngs::OsRng;
use serde_json::{json};
use std::collections::HashMap;
use serde_json;
use serde::Deserialize;
use std::result::Result;
use rsa::{RsaPrivateKey, RsaPublicKey, PaddingScheme, pkcs8::ToPublicKey};

#[allow(dead_code)]
#[allow(non_snake_case)]
#[derive(Debug, Deserialize)]
pub struct Secrets {
    pub keys: HashMap<String, String>,
}

/// `fetch_secrets`: to be used in conjunction with the Switchboard Secrets
/// Server stack.
/// When hosting your own secrets server, you may list the MR_ENCLAVE of the
/// functions you wish to reveal your secrets to.  This will only ever expose
/// your secrets to your code. Unless exported in your code, no chain or oracle
/// will be able to view these secrets:
///
/// # Relevant Materials:
/// - [Secret Server Github Repository](https://github.com/switchboard-xyz/secrets-server)
///
/// # Parameters:
/// - `url`: the url or ip address of the secrets server in use
///
/// # Returns
/// - `Map<String, String>`: The key-value store of your secrets.
pub async fn fetch_secrets(url: &str) -> Result<Secrets, SwitchboardClientError> {
    let mut os_rng = OsRng::default();
    let priv_key = RsaPrivateKey::new(&mut os_rng, 2048)
        .map_err(|_| SwitchboardClientError::KeyParseError)?;
    let pub_key = RsaPublicKey::from(&priv_key).to_public_key_der()
        .map_err(|_| SwitchboardClientError::KeyParseError)?;
    let pub_key: &[u8] = pub_key.as_ref();
    let secrets_quote = Gramine::generate_quote(pub_key)
        .map_err(|_| SwitchboardClientError::SgxError)?;
    let client = reqwest::Client::new();
    let res = client.post(url)
        .json(&json!({
            "quote": &secrets_quote,
            "pubkey": pub_key,
        }))
        .send()
        .await
        .map_err(|_| SwitchboardClientError::NetworkError)?;
    let ciphertext = res.bytes().await.map_err(|_| SwitchboardClientError::NetworkError)?;
    let secrets: Secrets;
    let padding = PaddingScheme::new_pkcs1v15_encrypt();
    secrets = serde_json::from_slice(
        &priv_key.decrypt(padding, &ciphertext).map_err(|_| SwitchboardClientError::DecryptError)?
    ).map_err(|_| SwitchboardClientError::ParseError)?;
    Ok(secrets)
}

