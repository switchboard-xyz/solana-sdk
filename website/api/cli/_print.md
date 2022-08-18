
find and print a switchboard account by public key for a given cluster

* [`sbv2 print [PUBLICKEY]`](#sbv2-print-publickey)
* [`sbv2 print aggregator [AGGREGATORKEY]`](#sbv2-print-aggregator-aggregatorkey)
* [`sbv2 print aggregator history [AGGREGATORKEY]`](#sbv2-print-aggregator-history-aggregatorkey)
* [`sbv2 print aggregator lease [AGGREGATORKEY]`](#sbv2-print-aggregator-lease-aggregatorkey)
* [`sbv2 print aggregator permission [AGGREGATORKEY]`](#sbv2-print-aggregator-permission-aggregatorkey)
* [`sbv2 print buffer [BUFFERRELAYERKEY]`](#sbv2-print-buffer-bufferrelayerkey)
* [`sbv2 print crank [CRANKKEY]`](#sbv2-print-crank-crankkey)
* [`sbv2 print job [JOBKEY]`](#sbv2-print-job-jobkey)
* [`sbv2 print oracle [ORACLEKEY]`](#sbv2-print-oracle-oraclekey)
* [`sbv2 print oracle permission [ORACLEKEY]`](#sbv2-print-oracle-permission-oraclekey)
* [`sbv2 print permission [PERMISSIONKEY]`](#sbv2-print-permission-permissionkey)
* [`sbv2 print program`](#sbv2-print-program)
* [`sbv2 print queue [QUEUEKEY]`](#sbv2-print-queue-queuekey)
* [`sbv2 print vrf [VRFKEY]`](#sbv2-print-vrf-vrfkey)

## `sbv2 print [PUBLICKEY]`

find a switchboard account by public key for a given cluster

```
USAGE
  $ sbv2 print [PUBLICKEY] [-h] [-v]

ARGUMENTS
  PUBLICKEY  public key of a switchboard account to lookup

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose  log everything

DESCRIPTION
  find a switchboard account by public key for a given cluster

EXAMPLES
  $ sbv2 print GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U
```

_See code: [dist/commands/print/index.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.2.25/dist/commands/print/index.ts)_

## `sbv2 print aggregator [AGGREGATORKEY]`

Print the deserialized Switchboard aggregator account

```
USAGE
  $ sbv2 print aggregator [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [--json] [--jobs] [-o]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to deserialize

FLAGS
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -o, --oraclePubkeysData  print the assigned oracles for the current round
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --jobs                   output job definitions
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Print the deserialized Switchboard aggregator account

ALIASES
  $ sbv2 aggregator print

EXAMPLES
  $ sbv2 aggregator:print GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR
```

## `sbv2 print aggregator history [AGGREGATORKEY]`

Print the history buffer associated with an aggregator account

```
USAGE
  $ sbv2 print aggregator history [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
  <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to fetch permission account and deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  Print the history buffer associated with an aggregator account

ALIASES
  $ sbv2 aggregator history print
  $ sbv2 aggregator print history

EXAMPLES
  $ sbv2 aggregator:print:history 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

## `sbv2 print aggregator lease [AGGREGATORKEY]`

Print the lease account associated with a Switchboard aggregator account

```
USAGE
  $ sbv2 print aggregator lease [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
  <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to fetch permission account and deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  Print the lease account associated with a Switchboard aggregator account

ALIASES
  $ sbv2 aggregator lease print
  $ sbv2 aggregator print lease

EXAMPLES
  $ sbv2 aggregator:lease:print 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee
```

## `sbv2 print aggregator permission [AGGREGATORKEY]`

Print the permission account associated with a Switchboard aggregator account

```
USAGE
  $ sbv2 print aggregator permission [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
  <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to fetch permission account and deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  Print the permission account associated with a Switchboard aggregator account

ALIASES
  $ sbv2 aggregator permission print
  $ sbv2 aggregator print permission

EXAMPLES
  $ sbv2 aggregator:permission:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

## `sbv2 print buffer [BUFFERRELAYERKEY]`

Print the deserialized Switchboard buffer relayer account

```
USAGE
  $ sbv2 print buffer [BUFFERRELAYERKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [--job]

ARGUMENTS
  BUFFERRELAYERKEY  public key of the buffer relayer account to deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --job                  output job definitions
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  Print the deserialized Switchboard buffer relayer account

ALIASES
  $ sbv2 buffer print

EXAMPLES
  $ sbv2 buffer:print 23GvzENjwgqqaLejsAtAWgTkSzWjSMo2LUYTAETT8URp
```

## `sbv2 print crank [CRANKKEY]`

print deserialized switchboard crank account

```
USAGE
  $ sbv2 print crank [CRANKKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  CRANKKEY  public key of the crank account to deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  print deserialized switchboard crank account

ALIASES
  $ sbv2 crank print

EXAMPLES
  $ sbv2 crank:print 85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr
```

## `sbv2 print job [JOBKEY]`

Print the deserialized Switchboard job account

```
USAGE
  $ sbv2 print job [JOBKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  JOBKEY  public key of the job account to deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  Print the deserialized Switchboard job account

ALIASES
  $ sbv2 job print

EXAMPLES
  $ sbv2 job:print SzTvFZLz3hwjZFMwVWzuEnr1oUF6qyvXwXCvsqf7qeA
```

## `sbv2 print oracle [ORACLEKEY]`

Print the deserialized Switchboard oracle account

```
USAGE
  $ sbv2 print oracle [ORACLEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  ORACLEKEY  public key of the oracle account to deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  Print the deserialized Switchboard oracle account

ALIASES
  $ sbv2 oracle print

EXAMPLES
  $ sbv2 oracle:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

## `sbv2 print oracle permission [ORACLEKEY]`

Print the permission account associated with a Switchboard oracle account

```
USAGE
  $ sbv2 print oracle permission [ORACLEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  ORACLEKEY  public key of the oracle account to fetch permission account and deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  Print the permission account associated with a Switchboard oracle account

ALIASES
  $ sbv2 oracle permission print
  $ sbv2 oracle print permission

EXAMPLES
  $ sbv2 oracle:permission:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

## `sbv2 print permission [PERMISSIONKEY]`

Print the deserialized Switchboard permission account

```
USAGE
  $ sbv2 print permission [PERMISSIONKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  PERMISSIONKEY  public key of the permission account to deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  Print the deserialized Switchboard permission account

ALIASES
  $ sbv2 permission print

EXAMPLES
  $ sbv2 permission:print 94XXM72K2aKu2wcuJaawV8njuGaFZvhy8iKgPxoa1tJk
```

## `sbv2 print program`

print the deserialized switchboard program state account

```
USAGE
  $ sbv2 print program [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  print the deserialized switchboard program state account

ALIASES
  $ sbv2 program print

EXAMPLES
  $ sbv2 program:print
```

## `sbv2 print queue [QUEUEKEY]`

Print the deserialized Switchboard oraclequeue account

```
USAGE
  $ sbv2 print queue [QUEUEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [--oracles]

ARGUMENTS
  QUEUEKEY  public key of the oracle queue account to deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --oracles              output oracles that are heartbeating on the queue
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  Print the deserialized Switchboard oraclequeue account

ALIASES
  $ sbv2 queue print

EXAMPLES
  $ sbv2 queue:print GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U
```

## `sbv2 print vrf [VRFKEY]`

Print the deserialized Switchboard VRF account

```
USAGE
  $ sbv2 print vrf [VRFKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [--json]

ARGUMENTS
  VRFKEY  public key of the vrf account to deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Print the deserialized Switchboard VRF account

ALIASES
  $ sbv2 vrf print

EXAMPLES
  $ sbv2 vrf:print
```
