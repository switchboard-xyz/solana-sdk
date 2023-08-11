#!/bin/bash

# exit when any command fails
set -e

function set_anchor_27 {
  was_changed="false"
  if [[ -f "Cargo.anchor27.lock" ]]; then
    mv Cargo.lock Cargo.anchor28.lock
    mv Cargo.anchor27.lock Cargo.lock
    was_changed="true"
  fi
  if [[ -f "Cargo.anchor27.toml" ]]; then
    mv Cargo.toml Cargo.anchor28.toml
    mv Cargo.anchor27.toml Cargo.toml
    was_changed="true"
  fi
  if [[ -f "src/attestation_program/accounts/request.anchor27.rs" ]]; then
    mv src/attestation_program/accounts/request.rs src/attestation_program/accounts/request.anchor28.rs
    mv src/attestation_program/accounts/request.anchor27.rs src/attestation_program/accounts/request.rs
    was_changed="true"
  fi
  if [[ "${was_changed}" == "true" ]]; then
    cargo clean
    cargo build
    cargo update -p solana-zk-token-sdk --precise 1.14.16
  fi
}

function set_anchor_28 {
  was_changed="false"
  if [[ -f "Cargo.anchor28.lock" ]]; then
    mv Cargo.lock Cargo.anchor27.lock
    mv Cargo.anchor28.lock Cargo.lock
    was_changed="true"
  fi
  if [[ -f "Cargo.anchor28.toml" ]]; then
    mv Cargo.toml Cargo.anchor27.toml
    mv Cargo.anchor28.toml Cargo.toml
    was_changed="true"
  fi
  if [[ -f "src/attestation_program/accounts/request.anchor28.rs" ]]; then
    mv src/attestation_program/accounts/request.rs src/attestation_program/accounts/request.anchor27.rs
    mv src/attestation_program/accounts/request.anchor28.rs src/attestation_program/accounts/request.rs
    was_changed="true"
  fi
  if [[ "${was_changed}" == "true" ]]; then
    cargo clean
    cargo build
  fi
}

if [[ "$1" == "27"  ]]; then
  set_anchor_27
elif [[ "$1" == "28"  ]]; then
  set_anchor_28
else
  echo ""
fi
