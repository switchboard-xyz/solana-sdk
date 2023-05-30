First install the sbv2 cli

```bash
npm install -g @switchboard-xyz
```

Then run the following command to create your own feed using the devnet
permissionless queue and crank

```bash
export QUEUE_KEY=uPeRMdfPmrPqgRWSrjAnAkH78RqAhe5kXoW6vBYRqFX
export CRANK_KEY=GN9jjCy2THzZxhYqZETmPM3my8vg4R5JyNkgULddUMa5
sbv2 solana aggregator create "$QUEUE_KEY" \
    --keypair ~/.config/solana/id.json \
    --crankKey "$CRANK_KEY" \
    --name "My_Test_Feed" \
    --updateInterval 10 \
    --minOracles 1 \
    --batchSize 1 \
    --leaseAmount 0.1 \
    --job ./src/oracle-job.json \
    --verbose
```

Then request an update for your new feed

```bash
sbv2 solana aggregator update $AGGREGATOR_KEY \
    --keypair ~/.config/solana/id.json
```

**_NOTE:_** You can provide multiple `--job` flags to add additional oracle jobs
to your data feed
