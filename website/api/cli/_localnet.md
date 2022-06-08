
create a localnet switchboard environment

* [`sbv2 localnet env`](#sbv2-localnet-env)

## `sbv2 localnet env`

create a localnet switchboard environment

```
USAGE
  $ sbv2 localnet env [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [--force] [-o
    <value>]

FLAGS
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -o, --outputDir=<value>  output directory for scripts
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --force                  overwrite output file if existing
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  create a localnet switchboard environment
```
