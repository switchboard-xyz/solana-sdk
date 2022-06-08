
interact with a switchboard oracle account

* [`sbv2 oracle balance [ORACLEKEY]`](#sbv2-oracle-balance-oraclekey)
* [`sbv2 oracle create [QUEUEKEY]`](#sbv2-oracle-create-queuekey)
* [`sbv2 oracle deposit [ORACLEKEY]`](#sbv2-oracle-deposit-oraclekey)
* [`sbv2 oracle nonce [ORACLEKEY]`](#sbv2-oracle-nonce-oraclekey)
* [`sbv2 oracle permission create [ORACLEKEY]`](#sbv2-oracle-permission-create-oraclekey)
* [`sbv2 oracle permission print [ORACLEKEY]`](#sbv2-oracle-permission-print-oraclekey)
* [`sbv2 oracle print [ORACLEKEY]`](#sbv2-oracle-print-oraclekey)
* [`sbv2 oracle print permission [ORACLEKEY]`](#sbv2-oracle-print-permission-oraclekey)
* [`sbv2 oracle withdraw [ORACLEKEY]`](#sbv2-oracle-withdraw-oraclekey)

## `sbv2 oracle balance [ORACLEKEY]`

check an oracles token balance

```
USAGE
  $ sbv2 oracle balance [ORACLEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  ORACLEKEY  public key of the oracle to check token balance

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  check an oracles token balance

EXAMPLES
  $ sbv2 oracle:balance 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

## `sbv2 oracle create [QUEUEKEY]`

create a new oracle account for a given queue

```
USAGE
  $ sbv2 oracle create [QUEUEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [-n
    <value>] [-a <value>] [--enable] [--queueAuthority <value>]

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to join

FLAGS
  -a, --authority=<value>   keypair to delegate authority to for managing the oracle account
  -k, --keypair=<value>     keypair that will pay for onchain transactions. defaults to new account authority if no
                            alternate authority provided
  -n, --name=<value>        name of the oracle for easier identification
  -s, --silent              suppress cli prompts
  -u, --rpcUrl=<value>      alternate RPC url
  -v, --verbose             log everything
  --enable                  enable oracle heartbeat permissions
  --mainnetBeta             WARNING: use mainnet-beta solana cluster
  --programId=<value>       alternative Switchboard program ID to interact with
  --queueAuthority=<value>  alternative keypair to use for queue authority

DESCRIPTION
  create a new oracle account for a given queue

EXAMPLES
  $ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --keypair ../payer-and-authority-keypair.json

  $ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --name=oracle-1  --keypair ../payer-and-authority-keypair.json

  $ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --keypair ../payer-keypair.json --authority ../oracle-keypair.json
```

## `sbv2 oracle deposit [ORACLEKEY]`

deposit tokens into an oracle's token wallet

```
USAGE
  $ sbv2 oracle deposit [ORACLEKEY] --amount <value> [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>]
    [-k <value>]

ARGUMENTS
  ORACLEKEY  public key of the oracle to deposit funds into

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --amount=<value>       (required) token amount to load into the oracle escrow. If decimals provided, amount will be
                         normalized to raw tokenAmount
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  deposit tokens into an oracle's token wallet

EXAMPLES
  $ sbv2 oracle:deposit 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json
```

## `sbv2 oracle nonce [ORACLEKEY]`

view an oracles nonce accounts

```
USAGE
  $ sbv2 oracle nonce [ORACLEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  ORACLEKEY  public key of the oracle to check token balance

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  view an oracles nonce accounts
```

## `sbv2 oracle permission create [ORACLEKEY]`

create a permission account for an oracle

```
USAGE
  $ sbv2 oracle permission create [ORACLEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  ORACLEKEY  public key of the oracle account

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  create a permission account for an oracle
```

## `sbv2 oracle permission print [ORACLEKEY]`

Print the permission account associated with a Switchboard oracle account

```
USAGE
  $ sbv2 oracle permission print [ORACLEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

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

## `sbv2 oracle print [ORACLEKEY]`

Print the deserialized Switchboard oracle account

```
USAGE
  $ sbv2 oracle print [ORACLEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

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

## `sbv2 oracle print permission [ORACLEKEY]`

Print the permission account associated with a Switchboard oracle account

```
USAGE
  $ sbv2 oracle print permission [ORACLEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

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

## `sbv2 oracle withdraw [ORACLEKEY]`

withdraw tokens from an oracle's token wallet

```
USAGE
  $ sbv2 oracle withdraw [ORACLEKEY] --amount <value> [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>]
    [-k <value>] [-f] [-w <value>] [-a <value>]

ARGUMENTS
  ORACLEKEY  public key of the oracle to withdraw from

FLAGS
  -a, --authority=<value>        keypair delegated as the authority for managing the oracle account
  -f, --force                    skip minStake balance check. your oracle may be removed from the queue
  -k, --keypair=<value>          keypair that will pay for onchain transactions. defaults to new account authority if no
                                 alternate authority provided
  -s, --silent                   suppress cli prompts
  -u, --rpcUrl=<value>           alternate RPC url
  -v, --verbose                  log everything
  -w, --withdrawAccount=<value>  optional solana pubkey or keypair filesystem path to withdraw funds to. default
                                 destination is oracle authority's token wallet
  --amount=<value>               (required) token amount to withdraw from oracle escrow. If decimals provided, amount
                                 will be normalized to raw tokenAmount
  --mainnetBeta                  WARNING: use mainnet-beta solana cluster
  --programId=<value>            alternative Switchboard program ID to interact with

DESCRIPTION
  withdraw tokens from an oracle's token wallet

EXAMPLES
  $ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../oracle-keypair.json

  $ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json --authority ../oracle-keypair.json -w ByJs8E29jxvqf2KFLwfyiE2gUh5fivaS7aShcRMAsnzg
```
