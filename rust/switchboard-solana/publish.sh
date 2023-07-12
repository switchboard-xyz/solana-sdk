#!/bin/bash

# exit when any command fails
set -e

mv Cargo.toml Cargo.default.toml
mv Cargo.lock Cargo.default.lock

mv Cargo.anchor27.toml Cargo.toml
if [[ -f "Cargo.anchor27.lock" ]]; then
    mv Cargo.anchor27.lock Cargo.lock
fi

cargo build
cargo update -p solana-zk-token-sdk --precise 1.14.16

cargo publish --allow-dirty

mv Cargo.lock Cargo.anchor27.lock
mv Cargo.toml Cargo.anchor27.toml

mv Cargo.default.toml Cargo.toml
mv Cargo.default.lock Cargo.lock