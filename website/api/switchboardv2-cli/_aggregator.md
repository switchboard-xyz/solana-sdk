
interact with a switchboard aggregator account

* [`sbv2 aggregator:add:job AGGREGATORKEY`](#sbv2-aggregatoraddjob-aggregatorkey)
* [`sbv2 aggregator:create:copy AGGREGATORSOURCE QUEUEKEY`](#sbv2-aggregatorcreatecopy-aggregatorsource-queuekey)
* [`sbv2 aggregator:create:json DEFINITIONFILE`](#sbv2-aggregatorcreatejson-definitionfile)
* [`sbv2 aggregator:lease:extend AGGREGATORKEY AMOUNT`](#sbv2-aggregatorleaseextend-aggregatorkey-amount)
* [`sbv2 aggregator:lock AGGREGATORKEY`](#sbv2-aggregatorlock-aggregatorkey)
* [`sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY`](#sbv2-aggregatorremovejob-aggregatorkey-jobkey)
* [`sbv2 aggregator:set:authority AGGREGATORKEY NEWAUTHORITY`](#sbv2-aggregatorsetauthority-aggregatorkey-newauthority)
* [`sbv2 aggregator:set:batchSize AGGREGATORKEY BATCHSIZE`](#sbv2-aggregatorsetbatchsize-aggregatorkey-batchsize)
* [`sbv2 aggregator:set:history AGGREGATORKEY SIZE`](#sbv2-aggregatorsethistory-aggregatorkey-size)
* [`sbv2 aggregator:set:minJobs AGGREGATORKEY MINJOBRESULTS`](#sbv2-aggregatorsetminjobs-aggregatorkey-minjobresults)
* [`sbv2 aggregator:set:minOracles AGGREGATORKEY MINORACLERESULTS`](#sbv2-aggregatorsetminoracles-aggregatorkey-minoracleresults)
* [`sbv2 aggregator:set:queue AGGREGATORKEY QUEUEKEY`](#sbv2-aggregatorsetqueue-aggregatorkey-queuekey)
* [`sbv2 aggregator:set:variance AGGREGATORKEY VARIANCETHRESHOLD`](#sbv2-aggregatorsetvariance-aggregatorkey-variancethreshold)
* [`sbv2 aggregator:update AGGREGATORKEY`](#sbv2-aggregatorupdate-aggregatorkey)

## `sbv2 aggregator:add:job AGGREGATORKEY`

add a job account to an aggregator

```
USAGE
  $ sbv2 aggregator:add:job AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account

OPTIONS
  -a, --aggregatorAuthority=aggregatorAuthority  alternate keypair that is the authority for the aggregator
  -f, --outputFile=outputFile                    output file to save aggregator definition to
  -h, --help                                     show CLI help

  -k, --keypair=keypair                          keypair that will pay for onchain transactions. defaults to new account
                                                 authority if no alternate authority provided

  -s, --silent                                   suppress cli prompts

  -u, --rpcUrl=rpcUrl                            alternate RPC url

  -v, --verbose                                  log everything

  --force                                        overwrite outputFile if existing

  --jobDefinition=jobDefinition                  filesystem path of job json definition file

  --jobKey=jobKey                                public key of an existing job account to add to an aggregator

  --mainnetBeta                                  WARNING: use mainnet-beta solana cluster

EXAMPLE
  $ sbv2 aggregator:add:job
```

_See code: [src/commands/aggregator/add/job.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/add/job.ts)_

## `sbv2 aggregator:create:copy AGGREGATORSOURCE QUEUEKEY`

copy an aggregator account to a new oracle queue

```
USAGE
  $ sbv2 aggregator:create:copy AGGREGATORSOURCE QUEUEKEY

ARGUMENTS
  AGGREGATORSOURCE  public key of the aggregator account to copy
  QUEUEKEY          public key of the queue to create aggregator for

OPTIONS
  -a, --authority=authority          alternate keypair that will be the aggregator authority
  -f, --outputFile=outputFile        output file to save aggregator definition to
  -h, --help                         show CLI help

  -k, --keypair=keypair              keypair that will pay for onchain transactions. defaults to new account authority
                                     if no alternate authority provided

  -s, --silent                       suppress cli prompts

  -u, --rpcUrl=rpcUrl                alternate RPC url

  -v, --verbose                      log everything

  --existingKeypair=existingKeypair  existing keypair file to store new account. useful for using the same public key on
                                     different clusters

  --force                            skip job confirmation

  --history=history                  optional, initialize a history buffer of given size

  --mainnetBeta                      WARNING: use mainnet-beta solana cluster

EXAMPLE
  $ sbv2 aggregator:create:copy 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee 
  AY3vpUu6v49shWajeFjHjgikYfaBWNJgax8zoEouUDTs --keypair ../payer-keypair.json
```

_See code: [src/commands/aggregator/create/copy.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/create/copy.ts)_

## `sbv2 aggregator:create:json DEFINITIONFILE`

create an aggregator from a json file

```
USAGE
  $ sbv2 aggregator:create:json DEFINITIONFILE

ARGUMENTS
  DEFINITIONFILE  filesystem path of queue definition json file

OPTIONS
  -a, --authority=authority    alternate keypair that will be the authority for the aggregator
  -f, --outputFile=outputFile  output aggregator definition to a json file
  -h, --help                   show CLI help

  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided

  -q, --queueKey=queueKey      public key of the oracle queue to create aggregator for

  -s, --silent                 suppress cli prompts

  -u, --rpcUrl=rpcUrl          alternate RPC url

  -v, --verbose                log everything

  --force                      overwrite output file

  --mainnetBeta                WARNING: use mainnet-beta solana cluster

ALIASES
  $ sbv2 json:create:aggregator

EXAMPLE
  $ sbv2 aggregator:create:json examples/aggregator.json --keypair ../payer-keypair.json --queueKey 
  GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --outputFile aggregator.schema.json
```

_See code: [src/commands/aggregator/create/json.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/create/json.ts)_

## `sbv2 aggregator:lease:extend AGGREGATORKEY AMOUNT`

fund and re-enable an aggregator lease

```
USAGE
  $ sbv2 aggregator:lease:extend AGGREGATORKEY AMOUNT

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to extend a lease for
  AMOUNT         amount to deposit into aggregator lease

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

EXAMPLE
  $ sbv2 aggregator:lease:extend GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 2500 --keypair ../payer-keypair.json
```

_See code: [src/commands/aggregator/lease/extend.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/lease/extend.ts)_

## `sbv2 aggregator:lock AGGREGATORKEY`

lock an aggregator's configuration and prevent further changes

```
USAGE
  $ sbv2 aggregator:lock AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/aggregator/lock.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/lock.ts)_

## `sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY`

remove a switchboard job account from an aggregator

```
USAGE
  $ sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account
  JOBKEY         public key of an existing job account to remove from an aggregator

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --force                    overwrite outputFile if existing

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

EXAMPLE
  $ sbv2 aggregator:remove:job
```

_See code: [src/commands/aggregator/remove/job.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/remove/job.ts)_

## `sbv2 aggregator:set:authority AGGREGATORKEY NEWAUTHORITY`

set an aggregator's authority

```
USAGE
  $ sbv2 aggregator:set:authority AGGREGATORKEY NEWAUTHORITY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account
  NEWAUTHORITY   public key of an existing job account to remove from an aggregator

OPTIONS
  -a, --currentAuthority=currentAuthority  alternate keypair that is the authority for the aggregator
  -h, --help                               show CLI help

  -k, --keypair=keypair                    keypair that will pay for onchain transactions. defaults to new account
                                           authority if no alternate authority provided

  -s, --silent                             suppress cli prompts

  -u, --rpcUrl=rpcUrl                      alternate RPC url

  -v, --verbose                            log everything

  --mainnetBeta                            WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/aggregator/set/authority.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/set/authority.ts)_

## `sbv2 aggregator:set:batchSize AGGREGATORKEY BATCHSIZE`

set an aggregator's batch size

```
USAGE
  $ sbv2 aggregator:set:batchSize AGGREGATORKEY BATCHSIZE

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account
  BATCHSIZE      number of oracles requested for each open round call

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/aggregator/set/batchSize.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/set/batchSize.ts)_

## `sbv2 aggregator:set:history AGGREGATORKEY SIZE`

set an aggregator's history buffer account to record the last N accepted results

```
USAGE
  $ sbv2 aggregator:set:history AGGREGATORKEY SIZE

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to add to a crank
  SIZE           size of history buffer

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

ALIASES
  $ sbv2 aggregator:add:history

EXAMPLE
  $ sbv2 aggregator:add:history --keypair ../payer-keypair.json GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 10000
```

_See code: [src/commands/aggregator/set/history.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/set/history.ts)_

## `sbv2 aggregator:set:minJobs AGGREGATORKEY MINJOBRESULTS`

set an aggregator's minimum number of jobs before an oracle responds

```
USAGE
  $ sbv2 aggregator:set:minJobs AGGREGATORKEY MINJOBRESULTS

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account
  MINJOBRESULTS  number of jobs that must respond before an oracle responds

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/aggregator/set/minJobs.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/set/minJobs.ts)_

## `sbv2 aggregator:set:minOracles AGGREGATORKEY MINORACLERESULTS`

set an aggregator's minimum number of oracles that must respond before a result is accepted on-chain

```
USAGE
  $ sbv2 aggregator:set:minOracles AGGREGATORKEY MINORACLERESULTS

ARGUMENTS
  AGGREGATORKEY     public key of the aggregator account
  MINORACLERESULTS  number of oracles that must respond before a value is accepted on-chain

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/aggregator/set/minOracles.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/set/minOracles.ts)_

## `sbv2 aggregator:set:queue AGGREGATORKEY QUEUEKEY`

set an aggregator's oracle queue

```
USAGE
  $ sbv2 aggregator:set:queue AGGREGATORKEY QUEUEKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator
  QUEUEKEY       public key of the oracle queue

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/aggregator/set/queue.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/set/queue.ts)_

## `sbv2 aggregator:set:variance AGGREGATORKEY VARIANCETHRESHOLD`

set an aggregator's variance threshold

```
USAGE
  $ sbv2 aggregator:set:variance AGGREGATORKEY VARIANCETHRESHOLD

ARGUMENTS
  AGGREGATORKEY      public key of the aggregator
  VARIANCETHRESHOLD  public key of the oracle queue

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster
```

_See code: [src/commands/aggregator/set/variance.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/set/variance.ts)_

## `sbv2 aggregator:update AGGREGATORKEY`

request a new aggregator result from a set of oracles

```
USAGE
  $ sbv2 aggregator:update AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

EXAMPLE
  $ sbv2 aggregator:update J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa --keypair ../payer-keypair.json
```

_See code: [src/commands/aggregator/update.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.6/src/commands/aggregator/update.ts)_
