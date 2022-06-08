
create a permission account

* [`sbv2 permission create [GRANTER] [GRANTEE]`](#sbv2-permission-create-granter-grantee)
* [`sbv2 permission print [PERMISSIONKEY]`](#sbv2-permission-print-permissionkey)
* [`sbv2 permission set [PERMISSIONKEY]`](#sbv2-permission-set-permissionkey)

## `sbv2 permission create [GRANTER] [GRANTEE]`

create a permission account

```
USAGE
  $ sbv2 permission create [GRANTER] [GRANTEE] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  GRANTER  public key of the account granting permission
  GRANTEE  public key of the account getting permissions

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  create a permission account
```

## `sbv2 permission print [PERMISSIONKEY]`

Print the deserialized Switchboard permission account

```
USAGE
  $ sbv2 permission print [PERMISSIONKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

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

## `sbv2 permission set [PERMISSIONKEY]`

permit a grantee to use a granters resources

```
USAGE
  $ sbv2 permission set [PERMISSIONKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [-a <value>] [--disable]

ARGUMENTS
  PERMISSIONKEY  public key of the permission account

FLAGS
  -a, --authority=<value>  alternate keypair that is the granters authority
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --disable                disable permissions
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  permit a grantee to use a granters resources
```
