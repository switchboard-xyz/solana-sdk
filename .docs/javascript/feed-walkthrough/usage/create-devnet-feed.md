You can create your own feeds using the devnet permissionless network. This
network does _NOT_ require the queue authority to grant you permissions so you
are free to use it as a testing environment.

You do **_NOT_** need to run your own oracles for this network.

Edit the OracleJob file `src/oracle-job.json`, then run

```bash
ts-node src/devnet
```

Optionally, provide these env variables

```bash
RPC_URL=https://my_custom_rpc_url.com \
PAYER_KEYPAIR=~/my_keypair.json \
ts-node src/devnet
```