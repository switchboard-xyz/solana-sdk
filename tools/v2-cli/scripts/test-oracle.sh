#!/bin/bash

queue="F8ce7MsckeZAbAGmxjJNetxYXQa9mKr9nnrC3qKubyYy"

authority=$1
if [[ -z "${authority}" ]]; then
  read -rp "Enter the path to the authority keypair: " authority
fi
echo -e "authority: $(solana-keygen pubkey "$authority")"

# TODO: Transfer required balance to fresh keypair for test

# Create Oracle
oracle=$(sbv2 oracle:create $queue --keypair "$authority" --silent)
echo -e "oracle: $oracle"

# TODO: Airdrop and wrap 1 SOL

# TODO: Deposit into oracle staking wallet

# TODO: Check oracle balance matches deposit

# TODO: Withdraw from oracle staking wallet