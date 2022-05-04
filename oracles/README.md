# Switchboard Oracle

Packages to assist in deploying, running, and managing a Switchboard oracle.

## Contents

- **Helm Manifest** - helm manifest and scripts to deploy a Switchboard Oracle to a kubernetes cluster

## Start Docker Oracle

```
CLUSTER=devnet \
ORACLE_KEY=XXXXXXXXX \
RPC_URL=https://api.devnet.solana.com \
PAYER_SECRET_PATH=../payer-keypair.json \
docker-compose up
```
