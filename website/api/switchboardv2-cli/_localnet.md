
create a localnet switchboard environment

* [`sbv2 localnet:env`](#sbv2-localnetenv)

## `sbv2 localnet:env`

create a localnet switchboard environment

```
USAGE
  $ sbv2 localnet:env

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --force                overwrite output file if existing

  --mainnetBeta          WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/localnet/env.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/localnet/env.ts)_
