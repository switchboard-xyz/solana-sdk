
create a permission account

* [`sbv2 permission:create GRANTER GRANTEE`](#sbv2-permissioncreate-granter-grantee)
* [`sbv2 permission:set PERMISSIONKEY`](#sbv2-permissionset-permissionkey)

## `sbv2 permission:create GRANTER GRANTEE`

create a permission account

```
USAGE
  $ sbv2 permission:create GRANTER GRANTEE

ARGUMENTS
  GRANTER  public key of the account granting permission
  GRANTEE  public key of the account getting permissions

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/permission/create.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.15/src/commands/permission/create.ts)_

## `sbv2 permission:set PERMISSIONKEY`

permit a grantee to use a granters resources

```
USAGE
  $ sbv2 permission:set PERMISSIONKEY

ARGUMENTS
  PERMISSIONKEY  public key of the permission account

OPTIONS
  -a, --authority=authority  alternate keypair that is the granters authority
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --disable                  disable permissions

  --mainnetBeta              WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/permission/set.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.15/src/commands/permission/set.ts)_
