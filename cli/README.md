# switchboardv2-cli

command line tool to interact with switchboard v2

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/switchboardv2-cli.svg)](https://npmjs.org/package/switchboardv2-cli)
[![Downloads/week](https://img.shields.io/npm/dw/switchboardv2-cli.svg)](https://npmjs.org/package/switchboardv2-cli)
[![License](https://img.shields.io/npm/l/switchboardv2-cli.svg)](https://github.com/switchboard-xyz/switchboardv2-cli/blob/master/package.json)

```bash
npm install -g @switchboard-xyz/switchboardv2-cli
```

<!-- commands -->
* [`sbv2 aggregator:add:job AGGREGATORKEY`](#sbv2-aggregatoraddjob-aggregatorkey)
* [`sbv2 aggregator:create:copy AGGREGATORSOURCE`](#sbv2-aggregatorcreatecopy-aggregatorsource)
* [`sbv2 aggregator:create:json DEFINITIONFILE`](#sbv2-aggregatorcreatejson-definitionfile)
* [`sbv2 aggregator:lock AGGREGATORKEY`](#sbv2-aggregatorlock-aggregatorkey)
* [`sbv2 aggregator:permission:create AGGREGATORKEY`](#sbv2-aggregatorpermissioncreate-aggregatorkey)
* [`sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY`](#sbv2-aggregatorremovejob-aggregatorkey-jobkey)
* [`sbv2 aggregator:set AGGREGATORKEY`](#sbv2-aggregatorset-aggregatorkey)
* [`sbv2 aggregator:set:authority AGGREGATORKEY NEWAUTHORITY`](#sbv2-aggregatorsetauthority-aggregatorkey-newauthority)
* [`sbv2 aggregator:set:batchSize AGGREGATORKEY BATCHSIZE`](#sbv2-aggregatorsetbatchsize-aggregatorkey-batchsize)
* [`sbv2 aggregator:set:forceReportPeriod AGGREGATORKEY FORCEREPORTPERIOD`](#sbv2-aggregatorsetforcereportperiod-aggregatorkey-forcereportperiod)
* [`sbv2 aggregator:set:history AGGREGATORKEY SIZE`](#sbv2-aggregatorsethistory-aggregatorkey-size)
* [`sbv2 aggregator:set:minJobs AGGREGATORKEY MINJOBRESULTS`](#sbv2-aggregatorsetminjobs-aggregatorkey-minjobresults)
* [`sbv2 aggregator:set:minOracles AGGREGATORKEY MINORACLERESULTS`](#sbv2-aggregatorsetminoracles-aggregatorkey-minoracleresults)
* [`sbv2 aggregator:set:queue AGGREGATORKEY QUEUEKEY`](#sbv2-aggregatorsetqueue-aggregatorkey-queuekey)
* [`sbv2 aggregator:set:updateInterval AGGREGATORKEY UPDATEINTERVAL`](#sbv2-aggregatorsetupdateinterval-aggregatorkey-updateinterval)
* [`sbv2 aggregator:set:varianceThreshold AGGREGATORKEY VARIANCETHRESHOLD`](#sbv2-aggregatorsetvariancethreshold-aggregatorkey-variancethreshold)
* [`sbv2 aggregator:update AGGREGATORKEY`](#sbv2-aggregatorupdate-aggregatorkey)
* [`sbv2 config:print`](#sbv2-configprint)
* [`sbv2 config:set PARAM [VALUE]`](#sbv2-configset-param-value)
* [`sbv2 crank:list CRANKKEY`](#sbv2-cranklist-crankkey)
* [`sbv2 crank:push CRANKKEY AGGREGATORKEY`](#sbv2-crankpush-crankkey-aggregatorkey)
* [`sbv2 crank:turn CRANKKEY`](#sbv2-crankturn-crankkey)
* [`sbv2 help [COMMAND]`](#sbv2-help-command)
* [`sbv2 job:create:copy JOBSOURCE`](#sbv2-jobcreatecopy-jobsource)
* [`sbv2 job:create:json DEFINITIONFILE`](#sbv2-jobcreatejson-definitionfile)
* [`sbv2 job:create:template TEMPLATE ID`](#sbv2-jobcreatetemplate-template-id)
* [`sbv2 json:add:aggregator`](#sbv2-jsonaddaggregator)
* [`sbv2 json:add:crank SCHEMAFILE`](#sbv2-jsonaddcrank-schemafile)
* [`sbv2 json:add:oracle SCHEMAFILE`](#sbv2-jsonaddoracle-schemafile)
* [`sbv2 json:create:queue INPUTFILE OUTPUTFILE`](#sbv2-jsoncreatequeue-inputfile-outputfile)
* [`sbv2 lease:create AGGREGATORKEY`](#sbv2-leasecreate-aggregatorkey)
* [`sbv2 lease:extend AGGREGATORKEY`](#sbv2-leaseextend-aggregatorkey)
* [`sbv2 lease:withdraw AGGREGATORKEY`](#sbv2-leasewithdraw-aggregatorkey)
* [`sbv2 localnet:env`](#sbv2-localnetenv)
* [`sbv2 oracle:balance ORACLEKEY`](#sbv2-oraclebalance-oraclekey)
* [`sbv2 oracle:create QUEUEKEY`](#sbv2-oraclecreate-queuekey)
* [`sbv2 oracle:deposit ORACLEKEY`](#sbv2-oracledeposit-oraclekey)
* [`sbv2 oracle:nonce ORACLEKEY`](#sbv2-oraclenonce-oraclekey)
* [`sbv2 oracle:permission:create ORACLEKEY`](#sbv2-oraclepermissioncreate-oraclekey)
* [`sbv2 oracle:withdraw ORACLEKEY`](#sbv2-oraclewithdraw-oraclekey)
* [`sbv2 permission:create GRANTER GRANTEE`](#sbv2-permissioncreate-granter-grantee)
* [`sbv2 permission:set PERMISSIONKEY`](#sbv2-permissionset-permissionkey)
* [`sbv2 print PUBLICKEY`](#sbv2-print-publickey)
* [`sbv2 print:aggregator AGGREGATORKEY`](#sbv2-printaggregator-aggregatorkey)
* [`sbv2 print:aggregator:history AGGREGATORKEY`](#sbv2-printaggregatorhistory-aggregatorkey)
* [`sbv2 print:aggregator:lease AGGREGATORKEY`](#sbv2-printaggregatorlease-aggregatorkey)
* [`sbv2 print:aggregator:permission AGGREGATORKEY`](#sbv2-printaggregatorpermission-aggregatorkey)
* [`sbv2 print:crank CRANKKEY`](#sbv2-printcrank-crankkey)
* [`sbv2 print:job JOBKEY`](#sbv2-printjob-jobkey)
* [`sbv2 print:job:templates`](#sbv2-printjobtemplates)
* [`sbv2 print:json:samples OUTPUTDIRECTORY`](#sbv2-printjsonsamples-outputdirectory)
* [`sbv2 print:oracle ORACLEKEY`](#sbv2-printoracle-oraclekey)
* [`sbv2 print:oracle:permission ORACLEKEY`](#sbv2-printoraclepermission-oraclekey)
* [`sbv2 print:program`](#sbv2-printprogram)
* [`sbv2 print:queue QUEUEKEY`](#sbv2-printqueue-queuekey)
* [`sbv2 print:vrf VRFKEY`](#sbv2-printvrf-vrfkey)
* [`sbv2 queue:add:crank QUEUEKEY`](#sbv2-queueaddcrank-queuekey)
* [`sbv2 queue:create`](#sbv2-queuecreate)
* [`sbv2 queue:permit:aggregator AGGREGATORKEY`](#sbv2-queuepermitaggregator-aggregatorkey)
* [`sbv2 queue:permit:oracle ORACLEKEY`](#sbv2-queuepermitoracle-oraclekey)
* [`sbv2 queue:set:rewards QUEUEKEY REWARDS`](#sbv2-queuesetrewards-queuekey-rewards)
* [`sbv2 queue:set:vrf QUEUEKEY`](#sbv2-queuesetvrf-queuekey)
* [`sbv2 sandbox [PLACEHOLDER]`](#sbv2-sandbox-placeholder)
* [`sbv2 test ORACLEKEY`](#sbv2-test-oraclekey)
* [`sbv2 update [CHANNEL]`](#sbv2-update-channel)
* [`sbv2 vrf:create QUEUEKEY`](#sbv2-vrfcreate-queuekey)
* [`sbv2 vrf:create:example QUEUEKEY`](#sbv2-vrfcreateexample-queuekey)
* [`sbv2 vrf:request VRFKEY`](#sbv2-vrfrequest-vrfkey)
* [`sbv2 watch:aggregator AGGREGATORKEY`](#sbv2-watchaggregator-aggregatorkey)
* [`sbv2 watch:vrf VRFKEY`](#sbv2-watchvrf-vrfkey)

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

  --programId=programId                          alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 aggregator:add:job
```

_See code: [src/commands/aggregator/add/job.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/add/job.ts)_

## `sbv2 aggregator:create:copy AGGREGATORSOURCE`

copy an aggregator account to a new oracle queue

```
USAGE
  $ sbv2 aggregator:create:copy AGGREGATORSOURCE

ARGUMENTS
  AGGREGATORSOURCE  public key of the aggregator account to copy

OPTIONS
  -a, --authority=authority              alternate keypair that will be the aggregator authority
  -f, --outputFile=outputFile            output file to save aggregator definition to
  -h, --help                             show CLI help

  -k, --keypair=keypair                  keypair that will pay for onchain transactions. defaults to new account
                                         authority if no alternate authority provided

  -s, --silent                           suppress cli prompts

  -u, --rpcUrl=rpcUrl                    alternate RPC url

  -v, --verbose                          log everything

  --batchSize=batchSize                  override source aggregator's oracleRequestBatchSize

  --crankKey=crankKey                    public key of the crank to push aggregator to

  --force                                skip job confirmation

  --forceReportPeriod=forceReportPeriod  override source aggregator's forceReportPeriod

  --mainnetBeta                          WARNING: use mainnet-beta solana cluster

  --minJobs=minJobs                      override source aggregator's minJobResults

  --minOracles=minOracles                override source aggregator's minOracleResults

  --minUpdateDelay=minUpdateDelay        override source aggregator's minUpdateDelaySeconds

  --programId=programId                  alternative Switchboard program ID to interact with

  --queueKey=queueKey                    (required) public key of the queue to create aggregator for

  --varianceThreshold=varianceThreshold  override source aggregator's varianceThreshold

EXAMPLE
  $ sbv2 aggregator:create:copy 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee 
  AY3vpUu6v49shWajeFjHjgikYfaBWNJgax8zoEouUDTs --keypair ../payer-keypair.json
```

_See code: [src/commands/aggregator/create/copy.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/create/copy.ts)_

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

  --programId=programId        alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 json:create:aggregator

EXAMPLE
  $ sbv2 aggregator:create:json examples/aggregator.json --keypair ../payer-keypair.json --queueKey 
  GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --outputFile aggregator.schema.json
```

_See code: [src/commands/aggregator/create/json.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/create/json.ts)_

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

  --programId=programId      alternative Switchboard program ID to interact with
```

_See code: [src/commands/aggregator/lock.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/lock.ts)_

## `sbv2 aggregator:permission:create AGGREGATORKEY`

create a permission account for an aggregator

```
USAGE
  $ sbv2 aggregator:permission:create AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with
```

_See code: [src/commands/aggregator/permission/create.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/permission/create.ts)_

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

  --programId=programId      alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 aggregator:remove:job
```

_See code: [src/commands/aggregator/remove/job.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/remove/job.ts)_

## `sbv2 aggregator:set AGGREGATORKEY`

set an aggregator's config

```
USAGE
  $ sbv2 aggregator:set AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator

OPTIONS
  -a, --authority=authority              alternate keypair that is the authority for the aggregator
  -h, --help                             show CLI help

  -k, --keypair=keypair                  keypair that will pay for onchain transactions. defaults to new account
                                         authority if no alternate authority provided

  -s, --silent                           suppress cli prompts

  -u, --rpcUrl=rpcUrl                    alternate RPC url

  -v, --verbose                          log everything

  --forceReportPeriod=forceReportPeriod  Number of seconds for which, even if the variance threshold is not passed,
                                         accept new responses from oracles.

  --mainnetBeta                          WARNING: use mainnet-beta solana cluster

  --minJobs=minJobs                      number of jobs that must respond before an oracle responds

  --minOracles=minOracles                number of oracles that must respond before a value is accepted on-chain

  --newQueue=newQueue                    public key of the new oracle queue

  --programId=programId                  alternative Switchboard program ID to interact with

  --updateInterval=updateInterval        set an aggregator's minimum update delay

  --varianceThreshold=varianceThreshold  percentage change between a previous accepted result and the next round before
                                         an oracle reports a value on-chain. Used to conserve lease cost during low
                                         volatility

ALIASES
  $ sbv2 set:aggregator

EXAMPLE
  $ sbv2 aggregator:set GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --updateInterval 300 --minOracles 3 --keypair 
  ../payer-keypair.json
```

_See code: [src/commands/aggregator/set/index.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/set/index.ts)_

## `sbv2 aggregator:set:authority AGGREGATORKEY NEWAUTHORITY`

set an aggregator's authority

```
USAGE
  $ sbv2 aggregator:set:authority AGGREGATORKEY NEWAUTHORITY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account
  NEWAUTHORITY   keypair path of new authority

OPTIONS
  -a, --currentAuthority=currentAuthority  alternate keypair that is the authority for the aggregator
  -h, --help                               show CLI help

  -k, --keypair=keypair                    keypair that will pay for onchain transactions. defaults to new account
                                           authority if no alternate authority provided

  -s, --silent                             suppress cli prompts

  -u, --rpcUrl=rpcUrl                      alternate RPC url

  -v, --verbose                            log everything

  --mainnetBeta                            WARNING: use mainnet-beta solana cluster

  --programId=programId                    alternative Switchboard program ID to interact with
```

_See code: [src/commands/aggregator/set/authority.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/set/authority.ts)_

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

  --programId=programId      alternative Switchboard program ID to interact with
```

_See code: [src/commands/aggregator/set/batchSize.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/set/batchSize.ts)_

## `sbv2 aggregator:set:forceReportPeriod AGGREGATORKEY FORCEREPORTPERIOD`

set an aggregator's force report period

```
USAGE
  $ sbv2 aggregator:set:forceReportPeriod AGGREGATORKEY FORCEREPORTPERIOD

ARGUMENTS
  AGGREGATORKEY      public key of the aggregator

  FORCEREPORTPERIOD  Number of seconds for which, even if the variance threshold is not passed, accept new responses
                     from oracles.

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

  --programId=programId      alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:set:forceReport

EXAMPLE
  $ sbv2 aggregator:set:forceReportPeriod GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 300 --keypair 
  ../payer-keypair.json
```

_See code: [src/commands/aggregator/set/forceReportPeriod.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/set/forceReportPeriod.ts)_

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

  --programId=programId      alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:add:history

EXAMPLE
  $ sbv2 aggregator:set:history GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 10000 --keypair ../payer-keypair.json
```

_See code: [src/commands/aggregator/set/history.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/set/history.ts)_

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

  --programId=programId      alternative Switchboard program ID to interact with
```

_See code: [src/commands/aggregator/set/minJobs.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/set/minJobs.ts)_

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

  --programId=programId      alternative Switchboard program ID to interact with
```

_See code: [src/commands/aggregator/set/minOracles.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/set/minOracles.ts)_

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

  --programId=programId      alternative Switchboard program ID to interact with
```

_See code: [src/commands/aggregator/set/queue.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/set/queue.ts)_

## `sbv2 aggregator:set:updateInterval AGGREGATORKEY UPDATEINTERVAL`

set an aggregator's minimum update delay

```
USAGE
  $ sbv2 aggregator:set:updateInterval AGGREGATORKEY UPDATEINTERVAL

ARGUMENTS
  AGGREGATORKEY   public key of the aggregator account
  UPDATEINTERVAL  set an aggregator's minimum update delay

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

  --programId=programId      alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 aggregator:set:updateInterval GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 60 --keypair ../payer-keypair.json
```

_See code: [src/commands/aggregator/set/updateInterval.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/set/updateInterval.ts)_

## `sbv2 aggregator:set:varianceThreshold AGGREGATORKEY VARIANCETHRESHOLD`

set an aggregator's variance threshold

```
USAGE
  $ sbv2 aggregator:set:varianceThreshold AGGREGATORKEY VARIANCETHRESHOLD

ARGUMENTS
  AGGREGATORKEY      public key of the aggregator

  VARIANCETHRESHOLD  percentage change between a previous accepted result and the next round before an oracle reports a
                     value on-chain. Used to conserve lease cost during low volatility

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the aggregator
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

  --programId=programId      alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:set:variance

EXAMPLE
  $ sbv2 aggregator:set:varianceThreshold GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 0.1 --keypair 
  ../payer-keypair.json
```

_See code: [src/commands/aggregator/set/varianceThreshold.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/set/varianceThreshold.ts)_

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

  --programId=programId  alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 aggregator:update J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa --keypair ../payer-keypair.json
```

_See code: [src/commands/aggregator/update.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/aggregator/update.ts)_

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

  --programId=programId  alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 config:print
```

_See code: [src/commands/config/print.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/config/print.ts)_

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

  --programId=programId  alternative Switchboard program ID to interact with
```

_See code: [src/commands/config/set.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/config/set.ts)_

## `sbv2 crank:list CRANKKEY`

list the pubkeys currently on the crank

```
USAGE
  $ sbv2 crank:list CRANKKEY

ARGUMENTS
  CRANKKEY  public key of the crank

OPTIONS
  -f, --outputFile=outputFile  output file to save aggregator pubkeys to
  -h, --help                   show CLI help

  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided

  -s, --silent                 suppress cli prompts

  -u, --rpcUrl=rpcUrl          alternate RPC url

  -v, --verbose                log everything

  --force                      overwrite output file if exists

  --mainnetBeta                WARNING: use mainnet-beta solana cluster

  --programId=programId        alternative Switchboard program ID to interact with
```

_See code: [src/commands/crank/list.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/crank/list.ts)_

## `sbv2 crank:push CRANKKEY AGGREGATORKEY`

push an aggregator onto a crank

```
USAGE
  $ sbv2 crank:push CRANKKEY AGGREGATORKEY

ARGUMENTS
  CRANKKEY       public key of the crank
  AGGREGATORKEY  public key of the aggregator

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:add:crank
  $ sbv2 crank:add:aggregator
```

_See code: [src/commands/crank/push.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/crank/push.ts)_

## `sbv2 crank:turn CRANKKEY`

turn the crank and get rewarded if aggregator updates available

```
USAGE
  $ sbv2 crank:turn CRANKKEY

ARGUMENTS
  CRANKKEY  public key of the crank to turn

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 crank:turn 85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr --keypair ../payer-keypair.json
```

_See code: [src/commands/crank/turn.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/crank/turn.ts)_

## `sbv2 help [COMMAND]`

Display help for sbv2.

```
USAGE
  $ sbv2 help [COMMAND]

ARGUMENTS
  COMMAND  Command to show help for.

OPTIONS
  -n, --nested-commands  Include all nested commands in the output.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `sbv2 job:create:copy JOBSOURCE`

copy a job account

```
USAGE
  $ sbv2 job:create:copy JOBSOURCE

ARGUMENTS
  JOBSOURCE  public key of the aggregator account to copy

OPTIONS
  -f, --outputFile=outputFile  output file to save job definition to
  -h, --help                   show CLI help

  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided

  -s, --silent                 suppress cli prompts

  -u, --rpcUrl=rpcUrl          alternate RPC url

  -v, --verbose                log everything

  --force                      skip job confirmation

  --mainnetBeta                WARNING: use mainnet-beta solana cluster

  --programId=programId        alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 job:create:copy 7pdb5RVM6cVBU8XDfpGqakb1S4wX2i5QsZxT117tK4HS --keypair ../payer-keypair.json
```

_See code: [src/commands/job/create/copy.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/job/create/copy.ts)_

## `sbv2 job:create:json DEFINITIONFILE`

create a job from a json file

```
USAGE
  $ sbv2 job:create:json DEFINITIONFILE

ARGUMENTS
  DEFINITIONFILE  filesystem path of job definition json file

OPTIONS
  -h, --help                                 show CLI help

  -k, --keypair=keypair                      keypair that will pay for onchain transactions. defaults to new account
                                             authority if no alternate authority provided

  -s, --silent                               suppress cli prompts

  -u, --rpcUrl=rpcUrl                        alternate RPC url

  -v, --verbose                              log everything

  --aggregatorAuthority=aggregatorAuthority  filesystem path of aggregator authority keypair to add job account to

  --aggregatorKey=aggregatorKey              public key of aggregator to add job to

  --force                                    overwrite output file

  --mainnetBeta                              WARNING: use mainnet-beta solana cluster

  --outputFile=outputFile                    output job schema to a json file

  --programId=programId                      alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 json:create:job

EXAMPLE
  $ sbv2 job:create:json examples/job.json --keypair ../payer-keypair.json 
  --aggregatorAuthority=../aggregator-keypair.json --outputFile=job.schema.json
```

_See code: [src/commands/job/create/json.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/job/create/json.ts)_

## `sbv2 job:create:template TEMPLATE ID`

create a new on-chain job account from an existing template

```
USAGE
  $ sbv2 job:create:template TEMPLATE ID

ARGUMENTS
  TEMPLATE  the template type (ftxUs/coinbase/etc) or the filesystem path to the json file containing the task
            definitions

  ID        api endpoint id for a given source

OPTIONS
  -f, --outputFile=outputFile  output file to save job definition to
  -h, --help                   show CLI help

  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided

  -k, --outKeypair=outKeypair  existing keypair file to store new account. useful for using the same public key on
                               different clusters

  -n, --name=name              name of the job account for easier identification

  -s, --silent                 suppress cli prompts

  -u, --rpcUrl=rpcUrl          alternate RPC url

  -v, --verbose                log everything

  --force                      skip job confirmation

  --mainnetBeta                WARNING: use mainnet-beta solana cluster

  --programId=programId        alternative Switchboard program ID to interact with

EXAMPLES
  $ sbv2 job:create:template ftxUs BTC_USD --keypair ../payer-keypair.json
  $ sbv2 job:create:template ftxUs BTC_USD --keypair ../payer-keypair.json --name=ftxUs_Btc
  $ sbv2 job:create:template ftxUs BTC_USD -k ../payer-keypair.json -n ftxUs_Btc -f ftx_us_btc_job.json
```

_See code: [src/commands/job/create/template.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/job/create/template.ts)_

## `sbv2 json:add:aggregator`

add an aggregator to a schema file

```
USAGE
  $ sbv2 json:add:aggregator

OPTIONS
  -a, --authority=authority            alternate keypair that is the authority for the oracle queue
  -a, --schema=schema                  filesystem path for an oracle queue schema
  -h, --help                           show CLI help

  -k, --keypair=keypair                keypair that will pay for onchain transactions. defaults to new account authority
                                       if no alternate authority provided

  -s, --silent                         suppress cli prompts

  -u, --rpcUrl=rpcUrl                  alternate RPC url

  -v, --verbose                        log everything

  --aggregatorFile=aggregatorFile      filesystem path of job json definition file

  --mainnetBeta                        WARNING: use mainnet-beta solana cluster

  --programId=programId                alternative Switchboard program ID to interact with

  --sourceAggregator=sourceAggregator  public key of an existing aggregator account to copy
```

_See code: [src/commands/json/add/aggregator.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/json/add/aggregator.ts)_

## `sbv2 json:add:crank SCHEMAFILE`

add a crank to a schema file

```
USAGE
  $ sbv2 json:add:crank SCHEMAFILE

ARGUMENTS
  SCHEMAFILE  filesystem path for an oracle queue schema

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the oracle queue
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -n, --name=name            name of the crank for easier identification

  -r, --maxRows=maxRows      maximum number of rows a crank can support

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

  --programId=programId      alternative Switchboard program ID to interact with
```

_See code: [src/commands/json/add/crank.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/json/add/crank.ts)_

## `sbv2 json:add:oracle SCHEMAFILE`

add an oracle to a schema file

```
USAGE
  $ sbv2 json:add:oracle SCHEMAFILE

ARGUMENTS
  SCHEMAFILE  filesystem path for an oracle queue schema

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for the oracle queue
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -n, --name=name            name of the crank for easier identification

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

  --programId=programId      alternative Switchboard program ID to interact with
```

_See code: [src/commands/json/add/oracle.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/json/add/oracle.ts)_

## `sbv2 json:create:queue INPUTFILE OUTPUTFILE`

create an oracle queue from a json file

```
USAGE
  $ sbv2 json:create:queue INPUTFILE OUTPUTFILE

ARGUMENTS
  INPUTFILE   filesystem path of queue definition json file
  OUTPUTFILE  filesystem path of output file to quickly load the queue

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --authority=authority  alternate keypair that will be the authority for any created accounts

  --force                overwrite output file

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 queue:create:json

EXAMPLE
  $ sbv2 json:create:queue examples/queue.json queue-1.json -k ../authority-keypair.json
```

_See code: [src/commands/json/create/queue.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/json/create/queue.ts)_

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

_See code: [src/commands/lease/create.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/lease/create.ts)_

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

_See code: [src/commands/lease/extend.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/lease/extend.ts)_

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

_See code: [src/commands/lease/withdraw.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/lease/withdraw.ts)_

## `sbv2 localnet:env`

create a localnet switchboard environment

```
USAGE
  $ sbv2 localnet:env

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --force                overwrite output file if existing

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with
```

_See code: [src/commands/localnet/env.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/localnet/env.ts)_

## `sbv2 oracle:balance ORACLEKEY`

check an oracles token balance

```
USAGE
  $ sbv2 oracle:balance ORACLEKEY

ARGUMENTS
  ORACLEKEY  public key of the oracle to check token balance

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 oracle:balance 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

_See code: [src/commands/oracle/balance.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/oracle/balance.ts)_

## `sbv2 oracle:create QUEUEKEY`

create a new oracle account for a given queue

```
USAGE
  $ sbv2 oracle:create QUEUEKEY

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to join

OPTIONS
  -a, --authority=authority        keypair to delegate authority to for managing the oracle account
  -h, --help                       show CLI help

  -k, --keypair=keypair            keypair that will pay for onchain transactions. defaults to new account authority if
                                   no alternate authority provided

  -n, --name=name                  name of the oracle for easier identification

  -s, --silent                     suppress cli prompts

  -u, --rpcUrl=rpcUrl              alternate RPC url

  -v, --verbose                    log everything

  --enable                         enable oracle heartbeat permissions

  --mainnetBeta                    WARNING: use mainnet-beta solana cluster

  --programId=programId            alternative Switchboard program ID to interact with

  --queueAuthority=queueAuthority  alternative keypair to use for queue authority

EXAMPLES
  $ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --keypair ../payer-and-authority-keypair.json
  $ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --name=oracle-1  --keypair 
  ../payer-and-authority-keypair.json
  $ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --keypair ../payer-keypair.json --authority 
  ../oracle-keypair.json
```

_See code: [src/commands/oracle/create.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/oracle/create.ts)_

## `sbv2 oracle:deposit ORACLEKEY`

deposit tokens into an oracle's token wallet

```
USAGE
  $ sbv2 oracle:deposit ORACLEKEY

ARGUMENTS
  ORACLEKEY  public key of the oracle to deposit funds into

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --amount=amount        (required) token amount to load into the oracle escrow. If decimals provided, amount will be
                         normalized to raw tokenAmount

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 oracle:deposit 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json
```

_See code: [src/commands/oracle/deposit.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/oracle/deposit.ts)_

## `sbv2 oracle:nonce ORACLEKEY`

view an oracles nonce accounts

```
USAGE
  $ sbv2 oracle:nonce ORACLEKEY

ARGUMENTS
  ORACLEKEY  public key of the oracle to check token balance

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with
```

_See code: [src/commands/oracle/nonce/index.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/oracle/nonce/index.ts)_

## `sbv2 oracle:permission:create ORACLEKEY`

create a permission account for an oracle

```
USAGE
  $ sbv2 oracle:permission:create ORACLEKEY

ARGUMENTS
  ORACLEKEY  public key of the oracle account

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with
```

_See code: [src/commands/oracle/permission/create.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/oracle/permission/create.ts)_

## `sbv2 oracle:withdraw ORACLEKEY`

withdraw tokens from an oracle's token wallet

```
USAGE
  $ sbv2 oracle:withdraw ORACLEKEY

ARGUMENTS
  ORACLEKEY  public key of the oracle to withdraw from

OPTIONS
  -a, --authority=authority              keypair delegated as the authority for managing the oracle account
  -f, --force                            skip minStake balance check. your oracle may be removed from the queue
  -h, --help                             show CLI help

  -k, --keypair=keypair                  keypair that will pay for onchain transactions. defaults to new account
                                         authority if no alternate authority provided

  -s, --silent                           suppress cli prompts

  -u, --rpcUrl=rpcUrl                    alternate RPC url

  -v, --verbose                          log everything

  -w, --withdrawAccount=withdrawAccount  optional solana pubkey or keypair filesystem path to withdraw funds to. default
                                         destination is oracle authority's token wallet

  --amount=amount                        (required) token amount to withdraw from oracle escrow. If decimals provided,
                                         amount will be normalized to raw tokenAmount

  --mainnetBeta                          WARNING: use mainnet-beta solana cluster

  --programId=programId                  alternative Switchboard program ID to interact with

EXAMPLES
  $ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../oracle-keypair.json
  $ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json --authority 
  ../oracle-keypair.json -w ByJs8E29jxvqf2KFLwfyiE2gUh5fivaS7aShcRMAsnzg
```

_See code: [src/commands/oracle/withdraw.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/oracle/withdraw.ts)_

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

  --programId=programId  alternative Switchboard program ID to interact with
```

_See code: [src/commands/permission/create.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/permission/create.ts)_

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

  --programId=programId      alternative Switchboard program ID to interact with
```

_See code: [src/commands/permission/set.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/permission/set.ts)_

## `sbv2 print PUBLICKEY`

find a switchboard account by public key for a given cluster

```
USAGE
  $ sbv2 print PUBLICKEY

ARGUMENTS
  PUBLICKEY  public key of a switchboard account to lookup

OPTIONS
  -h, --help     show CLI help
  -v, --verbose  log everything

EXAMPLE
  $ sbv2 print GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U
```

_See code: [src/commands/print/index.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/index.ts)_

## `sbv2 print:aggregator AGGREGATORKEY`

Print the deserialized Switchboard aggregator account

```
USAGE
  $ sbv2 print:aggregator AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --jobs                 output job definitions

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:print

EXAMPLE
  $ sbv2 aggregator:print GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR
```

_See code: [src/commands/print/aggregator.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/aggregator.ts)_

## `sbv2 print:aggregator:history AGGREGATORKEY`

Print the history buffer associated with an aggregator account

```
USAGE
  $ sbv2 print:aggregator:history AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to fetch permission account and deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:history:print
  $ sbv2 aggregator:print:history

EXAMPLE
  $ sbv2 aggregator:print:history 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

_See code: [src/commands/print/aggregator/history.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/aggregator/history.ts)_

## `sbv2 print:aggregator:lease AGGREGATORKEY`

Print the lease account associated with a Switchboard aggregator account

```
USAGE
  $ sbv2 print:aggregator:lease AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to fetch permission account and deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:lease:print
  $ sbv2 aggregator:print:lease

EXAMPLE
  $ sbv2 aggregator:lease:print 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee
```

_See code: [src/commands/print/aggregator/lease.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/aggregator/lease.ts)_

## `sbv2 print:aggregator:permission AGGREGATORKEY`

Print the permission account associated with a Switchboard aggregator account

```
USAGE
  $ sbv2 print:aggregator:permission AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to fetch permission account and deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:permission:print
  $ sbv2 aggregator:print:permission

EXAMPLE
  $ sbv2 aggregator:permission:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

_See code: [src/commands/print/aggregator/permission.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/aggregator/permission.ts)_

## `sbv2 print:crank CRANKKEY`

print deserialized switchboard crank account

```
USAGE
  $ sbv2 print:crank CRANKKEY

ARGUMENTS
  CRANKKEY  public key of the crank account to deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 crank:print

EXAMPLE
  $ sbv2 crank:print 85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr
```

_See code: [src/commands/print/crank.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/crank.ts)_

## `sbv2 print:job JOBKEY`

Print the deserialized Switchboard job account

```
USAGE
  $ sbv2 print:job JOBKEY

ARGUMENTS
  JOBKEY  public key of the job account to deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 job:print

EXAMPLE
  $ sbv2 job:print SzTvFZLz3hwjZFMwVWzuEnr1oUF6qyvXwXCvsqf7qeA
```

_See code: [src/commands/print/job.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/job.ts)_

## `sbv2 print:job:templates`

list available templates to build a job from

```
USAGE
  $ sbv2 print:job:templates

ALIASES
  $ sbv2 job:print:templates
```

_See code: [src/commands/print/job/templates.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/job/templates.ts)_

## `sbv2 print:json:samples OUTPUTDIRECTORY`

write sample definition files to a directory

```
USAGE
  $ sbv2 print:json:samples OUTPUTDIRECTORY

ARGUMENTS
  OUTPUTDIRECTORY  filesystem path to output sample definition files

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 json:samples
  $ sbv2 write:json:samples

EXAMPLES
  $ sbv2 print:json:samples ~/switchboard_json_samples
  $ sbv2 json:samples ~/switchboard_json_samples
  $ sbv2 write:json:samples ~/switchboard_json_samples
```

_See code: [src/commands/print/json/samples.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/json/samples.ts)_

## `sbv2 print:oracle ORACLEKEY`

Print the deserialized Switchboard oracle account

```
USAGE
  $ sbv2 print:oracle ORACLEKEY

ARGUMENTS
  ORACLEKEY  public key of the oracle account to deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 oracle:print

EXAMPLE
  $ sbv2 oracle:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

_See code: [src/commands/print/oracle.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/oracle.ts)_

## `sbv2 print:oracle:permission ORACLEKEY`

Print the permission account associated with a Switchboard oracle account

```
USAGE
  $ sbv2 print:oracle:permission ORACLEKEY

ARGUMENTS
  ORACLEKEY  public key of the oracle account to fetch permission account and deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 oracle:permission:print
  $ sbv2 oracle:print:permission

EXAMPLE
  $ sbv2 oracle:permission:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

_See code: [src/commands/print/oracle/permission.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/oracle/permission.ts)_

## `sbv2 print:program`

print the deserialized switchboard program state account

```
USAGE
  $ sbv2 print:program

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 program:print

EXAMPLE
  $ sbv2 program:print
```

_See code: [src/commands/print/program.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/program.ts)_

## `sbv2 print:queue QUEUEKEY`

Print the deserialized Switchboard oraclequeue account

```
USAGE
  $ sbv2 print:queue QUEUEKEY

ARGUMENTS
  QUEUEKEY  public key of the oracle queue account to deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --oracles              output oracles that are heartbeating on the queue

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 queue:print

EXAMPLE
  $ sbv2 queue:print GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U
```

_See code: [src/commands/print/queue.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/queue.ts)_

## `sbv2 print:vrf VRFKEY`

Print the deserialized Switchboard VRF account

```
USAGE
  $ sbv2 print:vrf VRFKEY

ARGUMENTS
  VRFKEY  public key of the vrf account to deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 vrf:print

EXAMPLE
  $ sbv2 vrf:print SzTvFZLz3hwjZFMwVWzuEnr1oUF6qyvXwXCvsqf7qeA
```

_See code: [src/commands/print/vrf.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/print/vrf.ts)_

## `sbv2 queue:add:crank QUEUEKEY`

add a crank to an existing oracle queue

```
USAGE
  $ sbv2 queue:add:crank QUEUEKEY

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to create a crank on

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -n, --name=name        name of the crank for easier identification

  -r, --maxRows=maxRows  maximum number of rows a crank can support

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../authority-keypair.json -n crank-1
```

_See code: [src/commands/queue/add/crank.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/queue/add/crank.ts)_

## `sbv2 queue:create`

create a custom queue

```
USAGE
  $ sbv2 queue:create

OPTIONS
  -a, --authority=authority          keypair to delegate authority to for creating permissions targeted at the queue
  -c, --crankSize=crankSize          [default: 100] size of the crank
  -f, --outputFile=outputFile        output queue schema to a json file
  -h, --help                         show CLI help

  -k, --keypair=keypair              keypair that will pay for onchain transactions. defaults to new account authority
                                     if no alternate authority provided

  -n, --name=name                    [default: Custom Queue] name of the queue for easier identification

  -o, --numOracles=numOracles        number of oracles to add to the queue

  -o, --oracleTimeout=oracleTimeout  [default: 180] number of oracles to add to the queue

  -r, --reward=reward                [default: 0] oracle rewards for successfully responding to an update request

  -s, --silent                       suppress cli prompts

  -u, --rpcUrl=rpcUrl                alternate RPC url

  -v, --verbose                      log everything

  --force                            overwrite output file if existing

  --mainnetBeta                      WARNING: use mainnet-beta solana cluster

  --minStake=minStake                [default: 0] minimum stake required by an oracle to join the queue

  --programId=programId              alternative Switchboard program ID to interact with

  --queueSize=queueSize              [default: 100] maximum number of oracles the queue can support

  --unpermissionedFeeds              permit unpermissioned feeds

ALIASES
  $ sbv2 custom:queue
```

_See code: [src/commands/queue/create.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/queue/create.ts)_

## `sbv2 queue:permit:aggregator AGGREGATORKEY`

permit an aggregator to use an oracle queue's resources

```
USAGE
  $ sbv2 queue:permit:aggregator AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to authorize oracle queue usage

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for oracle queue
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

  --programId=programId      alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 queue:permit:aggregator 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4 --keypair ../queue-authority.json
```

_See code: [src/commands/queue/permit/aggregator.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/queue/permit/aggregator.ts)_

## `sbv2 queue:permit:oracle ORACLEKEY`

permit an oracle to heartbeat on a queue

```
USAGE
  $ sbv2 queue:permit:oracle ORACLEKEY

ARGUMENTS
  ORACLEKEY  public key of the oracle account to authorize oracle queue usage

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for oracle queue
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

  --programId=programId      alternative Switchboard program ID to interact with

EXAMPLE
  $ sbv2 queue:permit:oracle 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4 --keypair ../queue-authority.json
```

_See code: [src/commands/queue/permit/oracle.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/queue/permit/oracle.ts)_

## `sbv2 queue:set:rewards QUEUEKEY REWARDS`

set an oracle queue's rewards

```
USAGE
  $ sbv2 queue:set:rewards QUEUEKEY REWARDS

ARGUMENTS
  QUEUEKEY  public key of the oracle queue
  REWARDS   token rewards for each assigned oracle per open round call

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for oracle queue
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

  --programId=programId      alternative Switchboard program ID to interact with
```

_See code: [src/commands/queue/set/rewards.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/queue/set/rewards.ts)_

## `sbv2 queue:set:vrf QUEUEKEY`

add a crank to an existing oracle queue

```
USAGE
  $ sbv2 queue:set:vrf QUEUEKEY

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to create a crank on

OPTIONS
  -a, --authority=authority  alternate keypair that is the authority for oracle queue
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --disable                  disable unpermissionedVrfEnabled

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

  --programId=programId      alternative Switchboard program ID to interact with
```

_See code: [src/commands/queue/set/vrf.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/queue/set/vrf.ts)_

## `sbv2 sandbox [PLACEHOLDER]`

sandbox

```
USAGE
  $ sbv2 sandbox [PLACEHOLDER]

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -n, --name=name        name of the job account for easier identification

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with
```

_See code: [src/commands/sandbox.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/sandbox.ts)_

## `sbv2 test ORACLEKEY`

sandbox

```
USAGE
  $ sbv2 test ORACLEKEY

ARGUMENTS
  ORACLEKEY  public key of the oracle to deposit funds into

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with
```

_See code: [src/commands/test.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/test.ts)_

## `sbv2 update [CHANNEL]`

update the sbv2 CLI

```
USAGE
  $ sbv2 update [CHANNEL]

OPTIONS
  --from-local  interactively choose an already installed version
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.5.0/src/commands/update.ts)_

## `sbv2 vrf:create QUEUEKEY`

create a Switchboard VRF Account

```
USAGE
  $ sbv2 vrf:create QUEUEKEY

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to create VRF account for

OPTIONS
  -a, --accountMeta=accountMeta    (required) account metas for VRF callback
  -h, --help                       show CLI help

  -k, --keypair=keypair            keypair that will pay for onchain transactions. defaults to new account authority if
                                   no alternate authority provided

  -s, --silent                     suppress cli prompts

  -u, --rpcUrl=rpcUrl              alternate RPC url

  -v, --verbose                    log everything

  --authority=authority            alternative keypair to use for VRF authority

  --callbackPid=callbackPid        (required) callback program ID

  --enable                         enable vrf permissions

  --ixData=ixData                  (required) instruction data

  --mainnetBeta                    WARNING: use mainnet-beta solana cluster

  --programId=programId            alternative Switchboard program ID to interact with

  --queueAuthority=queueAuthority  alternative keypair to use for queue authority

  --vrfKeypair=vrfKeypair          filesystem path of existing keypair to use for VRF Account

EXAMPLES
  sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable 
  --queueAuthority queue-authority-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData 
  "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HpQoFL5kxPp2JCFvjsVTvBd7navx4THLefUU68SXAyd6","isSigner": 
  false,"isWritable": true}" -a "{"pubkey": "8VdBtS8ufkXMCa6Yr9E4KVCfX2inVZVwU4KGg2CL1q7P","isSigner": 
  false,"isWritable": false}"
  sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable 
  --queueAuthority oracle-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData 
  "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HYKi1grticLXPe5vqapUHhm976brwqRob8vqRnWMKWL5","isSigner": 
  false,"isWritable": true}" -a "{"pubkey": "6vG9QLMgSvsfjvSpDxWfZ2MGPYGzEYoBxviLG7cr4go","isSigner": 
  false,"isWritable": false}"
```

_See code: [src/commands/vrf/create/index.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/vrf/create/index.ts)_

## `sbv2 vrf:create:example QUEUEKEY`

create a VRF account for the client example program

```
USAGE
  $ sbv2 vrf:create:example QUEUEKEY

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to create VRF account for

OPTIONS
  -h, --help                       show CLI help

  -k, --keypair=keypair            keypair that will pay for onchain transactions. defaults to new account authority if
                                   no alternate authority provided

  -s, --silent                     suppress cli prompts

  -u, --rpcUrl=rpcUrl              alternate RPC url

  -v, --verbose                    log everything

  --enable                         enable vrf permissions

  --mainnetBeta                    WARNING: use mainnet-beta solana cluster

  --maxResult=maxResult            [default: 256000] the maximum VRF result

  --programId=programId            alternative Switchboard program ID to interact with

  --queueAuthority=queueAuthority  alternative keypair to use for queue authority

  --vrfKeypair=vrfKeypair          filesystem path of existing keypair to use for VRF Account

  --vrfPid=vrfPid                  (required) program ID for the VRF example program

EXAMPLE
  sbv2 vrf:create:example 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --vrfPid 
  6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --keypair ../payer-keypair.json -v --enable --queueAuthority 
  queue-authority-keypair.json
```

_See code: [src/commands/vrf/create/example.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/vrf/create/example.ts)_

## `sbv2 vrf:request VRFKEY`

request a new value for a VRF

```
USAGE
  $ sbv2 vrf:request VRFKEY

ARGUMENTS
  VRFKEY  public key of the VRF account to request randomness for

OPTIONS
  -h, --help                         show CLI help

  -k, --keypair=keypair              keypair that will pay for onchain transactions. defaults to new account authority
                                     if no alternate authority provided

  -s, --silent                       suppress cli prompts

  -u, --rpcUrl=rpcUrl                alternate RPC url

  -v, --verbose                      log everything

  --authority=authority              alternative keypair that is the VRF authority

  --funderAuthority=funderAuthority  alternative keypair to pay for VRF request

  --mainnetBeta                      WARNING: use mainnet-beta solana cluster

  --programId=programId              alternative Switchboard program ID to interact with

EXAMPLE
  sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable 
  --queueAuthority queue-authority-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData 
  "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HpQoFL5kxPp2JCFvjsVTvBd7navx4THLefUU68SXAyd6","isSigner": 
  false,"isWritable": true}" -a "{"pubkey": "8VdBtS8ufkXMCa6Yr9E4KVCfX2inVZVwU4KGg2CL1q7P","isSigner": 
  false,"isWritable": false}"
```

_See code: [src/commands/vrf/request.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/vrf/request.ts)_

## `sbv2 watch:aggregator AGGREGATORKEY`

watch an aggregator for a new value

```
USAGE
  $ sbv2 watch:aggregator AGGREGATORKEY

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

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 aggregator:watch

EXAMPLE
  $ sbv2 watch:aggregator J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa
```

_See code: [src/commands/watch/aggregator.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/watch/aggregator.ts)_

## `sbv2 watch:vrf VRFKEY`

watch a vrf for a new value

```
USAGE
  $ sbv2 watch:vrf VRFKEY

ARGUMENTS
  VRFKEY  public key of the vrf account to deserialize

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

  --programId=programId  alternative Switchboard program ID to interact with

ALIASES
  $ sbv2 vrf:watch

EXAMPLE
  $ sbv2 vrf:aggregator J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa
```

_See code: [src/commands/watch/vrf.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.18/src/commands/watch/vrf.ts)_
<!-- commandsstop -->
