
sandbox

* [`sbv2 sandbox [PLACEHOLDER]`](#sbv2-sandbox-placeholder)

## `sbv2 sandbox [PLACEHOLDER]`

sandbox

```
USAGE
  $ sbv2 sandbox [PLACEHOLDER] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [-n
    <value>]

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -n, --name=<value>     name of the job account for easier identification
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  sandbox
```

_See code: [dist/commands/sandbox.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.2.25/dist/commands/sandbox.ts)_
