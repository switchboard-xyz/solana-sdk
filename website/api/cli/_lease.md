
interact with a switchboard lease account

* [`sbv2 lease:create AGGREGATORKEY`](#sbv2-leasecreate-aggregatorkey)
* [`sbv2 lease:extend AGGREGATORKEY`](#sbv2-leaseextend-aggregatorkey)
* [`sbv2 lease:withdraw AGGREGATORKEY`](#sbv2-leasewithdraw-aggregatorkey)

## `sbv2 lease:create AGGREGATORKEY`

fund and re-enable an aggregator lease

```
USAGE
  $ sbv2 lease:create AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to extend a lease for

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --amount=amount        token amount to load into the lease escrow. If decimals provided, amount will be normalized to
                         raw tokenAmount

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:lease:create

EXAMPLE
  $ sbv2 lease:create GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.5 --keypair ../payer-keypair.json
```

_See code: [src/commands/lease/create.ts](https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/lease/create.ts)_

## `sbv2 lease:extend AGGREGATORKEY`

fund and re-enable an aggregator lease

```
USAGE
  $ sbv2 lease:extend AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to extend a lease for

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --amount=amount        (required) token amount to load into the lease escrow. If decimals provided, amount will be
                         normalized to raw tokenAmount

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:lease:extend

EXAMPLE
  $ sbv2 aggregator:lease:extend GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.1 --keypair 
  ../payer-keypair.json
```

_See code: [src/commands/lease/extend.ts](https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/lease/extend.ts)_

## `sbv2 lease:withdraw AGGREGATORKEY`

withdraw funds from an aggregator lease

```
USAGE
  $ sbv2 lease:withdraw AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to extend a lease for

OPTIONS
  -a, --authority=authority          keypair delegated as the authority for managing the oracle account
  -h, --help                         show CLI help

  -k, --keypair=keypair              keypair that will pay for onchain transactions. defaults to new account authority
                                     if no alternate authority provided

  -s, --silent                       suppress cli prompts

  -u, --rpcUrl=rpcUrl                alternate RPC url

  -v, --verbose                      log everything

  --amount=amount                    (required) token amount to withdraw from lease account. If decimals provided,
                                     amount will be normalized to raw tokenAmount

  --mainnetBeta                      WARNING: use mainnet-beta solana cluster

  --programId=programId              alternative Switchboard program ID to interact with

  --withdrawAddress=withdrawAddress  tokenAccount to withdraw to. If not provided, payer associated token account will
                                     be used

ALIASES
  $ sbv2 aggregator:lease:withdraw

EXAMPLE
  $ sbv2 aggregator:lease:withdraw GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.1 --keypair 
  ../payer-keypair.json
```

_See code: [src/commands/lease/withdraw.ts](https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/lease/withdraw.ts)_
