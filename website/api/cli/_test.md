
sandbox

* [`sbv2 test [ORACLEKEY]`](#sbv2-test-oraclekey)

## `sbv2 test [ORACLEKEY]`

sandbox

```
USAGE
  $ sbv2 test [ORACLEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  ORACLEKEY  public key of the oracle to deposit funds into

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  sandbox
```

_See code: [dist/commands/test.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.2.25/dist/commands/test.ts)_
