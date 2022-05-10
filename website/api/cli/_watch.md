
watch an aggregator for a new value

* [`sbv2 watch:aggregator AGGREGATORKEY`](#sbv2-watchaggregator-aggregatorkey)

## `sbv2 watch:aggregator AGGREGATORKEY`

watch an aggregator for a new value

```
USAGE
  $ sbv2 watch:aggregator AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

ALIASES
  $ sbv2 aggregator:watch

EXAMPLE
  $ sbv2 watch:aggregator J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa
```

_See code: [src/commands/watch/aggregator.ts](https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/watch/aggregator.ts)_
