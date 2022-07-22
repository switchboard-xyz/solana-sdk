
interact with a switchboard crank account

* [`sbv2 crank add aggregator [CRANKKEY] [AGGREGATORKEY]`](#sbv2-crank-add-aggregator-crankkey-aggregatorkey)
* [`sbv2 crank create [QUEUEKEY]`](#sbv2-crank-create-queuekey)
* [`sbv2 crank list [CRANKKEY]`](#sbv2-crank-list-crankkey)
* [`sbv2 crank pop [CRANKKEY]`](#sbv2-crank-pop-crankkey)
* [`sbv2 crank print [CRANKKEY]`](#sbv2-crank-print-crankkey)
* [`sbv2 crank push [CRANKKEY] [AGGREGATORKEY]`](#sbv2-crank-push-crankkey-aggregatorkey)
* [`sbv2 crank turn [CRANKKEY]`](#sbv2-crank-turn-crankkey)

## `sbv2 crank add aggregator [CRANKKEY] [AGGREGATORKEY]`

push an aggregator onto a crank

```
USAGE
  $ sbv2 crank add aggregator [CRANKKEY] [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
    <value>]

ARGUMENTS
  CRANKKEY       public key of the crank
  AGGREGATORKEY  public key of the aggregator

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  push an aggregator onto a crank

ALIASES
  $ sbv2 aggregator add crank
  $ sbv2 crank add aggregator
```

## `sbv2 crank create [QUEUEKEY]`

add a crank to an existing oracle queue

```
USAGE
  $ sbv2 crank create [QUEUEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [-n
    <value>] [-r <value>] [--queueAuthority <value>]

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to create a crank on

FLAGS
  -k, --keypair=<value>     keypair that will pay for onchain transactions. defaults to new account authority if no
                            alternate authority provided
  -n, --name=<value>        name of the crank for easier identification
  -r, --maxRows=<value>     [default: 100] maximum number of rows a crank can support
  -s, --silent              suppress cli prompts
  -u, --rpcUrl=<value>      alternate RPC url
  -v, --verbose             log everything
  --mainnetBeta             WARNING: use mainnet-beta solana cluster
  --programId=<value>       alternative Switchboard program ID to interact with
  --queueAuthority=<value>  alternative keypair to use for queue authority

DESCRIPTION
  add a crank to an existing oracle queue

EXAMPLES
  $ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../authority-keypair.json -n crank-1
```

## `sbv2 crank list [CRANKKEY]`

list the pubkeys currently on the crank

```
USAGE
  $ sbv2 crank list [CRANKKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [--force] [-f <value>]

ARGUMENTS
  CRANKKEY  public key of the crank

FLAGS
  -f, --outputFile=<value>  output file to save aggregator pubkeys to
  -k, --keypair=<value>     keypair that will pay for onchain transactions. defaults to new account authority if no
                            alternate authority provided
  -s, --silent              suppress cli prompts
  -u, --rpcUrl=<value>      alternate RPC url
  -v, --verbose             log everything
  --force                   overwrite output file if exists
  --mainnetBeta             WARNING: use mainnet-beta solana cluster
  --programId=<value>       alternative Switchboard program ID to interact with

DESCRIPTION
  list the pubkeys currently on the crank
```

## `sbv2 crank pop [CRANKKEY]`

pop the crank

```
USAGE
  $ sbv2 crank pop [CRANKKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  CRANKKEY  public key of the crank

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  pop the crank
```

## `sbv2 crank print [CRANKKEY]`

print deserialized switchboard crank account

```
USAGE
  $ sbv2 crank print [CRANKKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

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

## `sbv2 crank push [CRANKKEY] [AGGREGATORKEY]`

push an aggregator onto a crank

```
USAGE
  $ sbv2 crank push [CRANKKEY] [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
    <value>]

ARGUMENTS
  CRANKKEY       public key of the crank
  AGGREGATORKEY  public key of the aggregator

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  push an aggregator onto a crank

ALIASES
  $ sbv2 aggregator add crank
  $ sbv2 crank add aggregator
```

## `sbv2 crank turn [CRANKKEY]`

turn the crank and get rewarded if aggregator updates available

```
USAGE
  $ sbv2 crank turn [CRANKKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  CRANKKEY  public key of the crank to turn

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  turn the crank and get rewarded if aggregator updates available

EXAMPLES
  $ sbv2 crank:turn 85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr --keypair ../payer-keypair.json
```
