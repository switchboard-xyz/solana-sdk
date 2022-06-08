
print cli config

* [`sbv2 config print`](#sbv2-config-print)
* [`sbv2 config set [PARAM] [VALUE]`](#sbv2-config-set-param-value)

## `sbv2 config print`

print cli config

```
USAGE
  $ sbv2 config print [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  print cli config

EXAMPLES
  $ sbv2 config:print
```

## `sbv2 config set [PARAM] [VALUE]`

set a configuration option

```
USAGE
  $ sbv2 config set [PARAM] [VALUE] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [-r]

ARGUMENTS
  PARAM  (devnet-rpc|mainnet-rpc) configuration parameter to set
  VALUE  value of the param to set

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -r, --reset            remove value or set to default rpc
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  set a configuration option
```
