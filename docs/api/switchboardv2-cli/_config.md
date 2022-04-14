
print cli config

* [`sbv2 config:print`](#sbv2-configprint)
* [`sbv2 config:set PARAM [VALUE]`](#sbv2-configset-param-value)

## `sbv2 config:print`

print cli config

```
USAGE
  $ sbv2 config:print

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

EXAMPLE
  $ sbv2 config:print
```

_See code: [src/commands/config/print.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.4/src/commands/config/print.ts)_

## `sbv2 config:set PARAM [VALUE]`

set a configuration option

```
USAGE
  $ sbv2 config:set PARAM [VALUE]

ARGUMENTS
  PARAM  (devnet-rpc|mainnet-rpc) configuration parameter to set
  VALUE  value of the param to set

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -r, --reset            remove value or set to default rpc

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/config/set.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.4/src/commands/config/set.ts)_
