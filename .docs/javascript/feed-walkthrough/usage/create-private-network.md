You can also create your own private Switchboard network and run your own
oracles. This requires you to run your own oracles for this network.

The following script will

- Create a private queue and crank
- Create a new data feed on this network
- Start a local oracle
- Call OpenRound and await the updated result from your local oracle

```bash
ts-node src/private-queue
```

Optionally, provide these env variables

```bash
RPC_URL=https://my_custom_rpc_url.com \
PAYER_KEYPAIR=~/my_keypair.json \
ts-node src/private-queue
```
