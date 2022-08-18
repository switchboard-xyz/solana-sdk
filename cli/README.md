# switchboardv2-cli

command line tool to interact with switchboard v2

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/switchboardv2-cli.svg)](https://npmjs.org/package/switchboardv2-cli)
[![Downloads/week](https://img.shields.io/npm/dw/switchboardv2-cli.svg)](https://npmjs.org/package/switchboardv2-cli)
[![License](https://img.shields.io/npm/l/switchboardv2-cli.svg)](https://github.com/switchboard-xyz/switchboardv2-cli/blob/master/package.json)

```bash
npm install -g @switchboard-xyz/switchboardv2-cli
```

To test commands:

```
node bin/dev print GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR
# node bin/dev [COMMAND ARGS --flags]
```

**Commands**

<!-- commands -->
* [`sbv2 aggregator add crank [CRANKKEY] [AGGREGATORKEY]`](#sbv2-aggregator-add-crank-crankkey-aggregatorkey)
* [`sbv2 aggregator add history [AGGREGATORKEY] [SIZE]`](#sbv2-aggregator-add-history-aggregatorkey-size)
* [`sbv2 aggregator add job [AGGREGATORKEY]`](#sbv2-aggregator-add-job-aggregatorkey)
* [`sbv2 aggregator create [QUEUEKEY]`](#sbv2-aggregator-create-queuekey)
* [`sbv2 aggregator create copy [AGGREGATORSOURCE]`](#sbv2-aggregator-create-copy-aggregatorsource)
* [`sbv2 aggregator create json [DEFINITIONFILE]`](#sbv2-aggregator-create-json-definitionfile)
* [`sbv2 aggregator history print [AGGREGATORKEY]`](#sbv2-aggregator-history-print-aggregatorkey)
* [`sbv2 aggregator lease create [AGGREGATORKEY]`](#sbv2-aggregator-lease-create-aggregatorkey)
* [`sbv2 aggregator lease extend [AGGREGATORKEY]`](#sbv2-aggregator-lease-extend-aggregatorkey)
* [`sbv2 aggregator lease print [AGGREGATORKEY]`](#sbv2-aggregator-lease-print-aggregatorkey)
* [`sbv2 aggregator lease withdraw [AGGREGATORKEY]`](#sbv2-aggregator-lease-withdraw-aggregatorkey)
* [`sbv2 aggregator lock [AGGREGATORKEY]`](#sbv2-aggregator-lock-aggregatorkey)
* [`sbv2 aggregator permission create [AGGREGATORKEY]`](#sbv2-aggregator-permission-create-aggregatorkey)
* [`sbv2 aggregator permission print [AGGREGATORKEY]`](#sbv2-aggregator-permission-print-aggregatorkey)
* [`sbv2 aggregator print [AGGREGATORKEY]`](#sbv2-aggregator-print-aggregatorkey)
* [`sbv2 aggregator print history [AGGREGATORKEY]`](#sbv2-aggregator-print-history-aggregatorkey)
* [`sbv2 aggregator print lease [AGGREGATORKEY]`](#sbv2-aggregator-print-lease-aggregatorkey)
* [`sbv2 aggregator print permission [AGGREGATORKEY]`](#sbv2-aggregator-print-permission-aggregatorkey)
* [`sbv2 aggregator remove job [AGGREGATORKEY] [JOBKEY]`](#sbv2-aggregator-remove-job-aggregatorkey-jobkey)
* [`sbv2 aggregator save history [AGGREGATORKEY]`](#sbv2-aggregator-save-history-aggregatorkey)
* [`sbv2 aggregator set [AGGREGATORKEY]`](#sbv2-aggregator-set-aggregatorkey)
* [`sbv2 aggregator set authority [AGGREGATORKEY] [NEWAUTHORITY]`](#sbv2-aggregator-set-authority-aggregatorkey-newauthority)
* [`sbv2 aggregator set batchSize [AGGREGATORKEY] BATCHSIZE`](#sbv2-aggregator-set-batchsize-aggregatorkey-batchsize)
* [`sbv2 aggregator set forceReport [AGGREGATORKEY] [FORCEREPORTPERIOD]`](#sbv2-aggregator-set-forcereport-aggregatorkey-forcereportperiod)
* [`sbv2 aggregator set forceReportPeriod [AGGREGATORKEY] [FORCEREPORTPERIOD]`](#sbv2-aggregator-set-forcereportperiod-aggregatorkey-forcereportperiod)
* [`sbv2 aggregator set history [AGGREGATORKEY] [SIZE]`](#sbv2-aggregator-set-history-aggregatorkey-size)
* [`sbv2 aggregator set minJobs [AGGREGATORKEY] [MINJOBRESULTS]`](#sbv2-aggregator-set-minjobs-aggregatorkey-minjobresults)
* [`sbv2 aggregator set minOracles [AGGREGATORKEY] [MINORACLERESULTS]`](#sbv2-aggregator-set-minoracles-aggregatorkey-minoracleresults)
* [`sbv2 aggregator set queue [AGGREGATORKEY] [QUEUEKEY]`](#sbv2-aggregator-set-queue-aggregatorkey-queuekey)
* [`sbv2 aggregator set updateInterval [AGGREGATORKEY] [UPDATEINTERVAL]`](#sbv2-aggregator-set-updateinterval-aggregatorkey-updateinterval)
* [`sbv2 aggregator set variance [AGGREGATORKEY] [VARIANCETHRESHOLD]`](#sbv2-aggregator-set-variance-aggregatorkey-variancethreshold)
* [`sbv2 aggregator set varianceThreshold [AGGREGATORKEY] [VARIANCETHRESHOLD]`](#sbv2-aggregator-set-variancethreshold-aggregatorkey-variancethreshold)
* [`sbv2 aggregator update [AGGREGATORKEY]`](#sbv2-aggregator-update-aggregatorkey)
* [`sbv2 aggregator watch [AGGREGATORKEY]`](#sbv2-aggregator-watch-aggregatorkey)
* [`sbv2 anchor test`](#sbv2-anchor-test)
* [`sbv2 buffer create [QUEUEKEY]`](#sbv2-buffer-create-queuekey)
* [`sbv2 buffer print [BUFFERRELAYERKEY]`](#sbv2-buffer-print-bufferrelayerkey)
* [`sbv2 config print`](#sbv2-config-print)
* [`sbv2 config set [PARAM] [VALUE]`](#sbv2-config-set-param-value)
* [`sbv2 crank add aggregator [CRANKKEY] [AGGREGATORKEY]`](#sbv2-crank-add-aggregator-crankkey-aggregatorkey)
* [`sbv2 crank create [QUEUEKEY]`](#sbv2-crank-create-queuekey)
* [`sbv2 crank list [CRANKKEY]`](#sbv2-crank-list-crankkey)
* [`sbv2 crank pop [CRANKKEY]`](#sbv2-crank-pop-crankkey)
* [`sbv2 crank print [CRANKKEY]`](#sbv2-crank-print-crankkey)
* [`sbv2 crank push [CRANKKEY] [AGGREGATORKEY]`](#sbv2-crank-push-crankkey-aggregatorkey)
* [`sbv2 crank turn [CRANKKEY]`](#sbv2-crank-turn-crankkey)
* [`sbv2 custom queue`](#sbv2-custom-queue)
* [`sbv2 help [COMMAND]`](#sbv2-help-command)
* [`sbv2 job create JOBDEFINITION`](#sbv2-job-create-jobdefinition)
* [`sbv2 job print [JOBKEY]`](#sbv2-job-print-jobkey)
* [`sbv2 json create aggregator [DEFINITIONFILE]`](#sbv2-json-create-aggregator-definitionfile)
* [`sbv2 lease create [AGGREGATORKEY]`](#sbv2-lease-create-aggregatorkey)
* [`sbv2 lease extend [AGGREGATORKEY]`](#sbv2-lease-extend-aggregatorkey)
* [`sbv2 lease withdraw [AGGREGATORKEY]`](#sbv2-lease-withdraw-aggregatorkey)
* [`sbv2 localnet env`](#sbv2-localnet-env)
* [`sbv2 oracle balance [ORACLEKEY]`](#sbv2-oracle-balance-oraclekey)
* [`sbv2 oracle create [QUEUEKEY]`](#sbv2-oracle-create-queuekey)
* [`sbv2 oracle deposit [ORACLEKEY]`](#sbv2-oracle-deposit-oraclekey)
* [`sbv2 oracle nonce [ORACLEKEY]`](#sbv2-oracle-nonce-oraclekey)
* [`sbv2 oracle permission create [ORACLEKEY]`](#sbv2-oracle-permission-create-oraclekey)
* [`sbv2 oracle permission print [ORACLEKEY]`](#sbv2-oracle-permission-print-oraclekey)
* [`sbv2 oracle print [ORACLEKEY]`](#sbv2-oracle-print-oraclekey)
* [`sbv2 oracle print permission [ORACLEKEY]`](#sbv2-oracle-print-permission-oraclekey)
* [`sbv2 oracle withdraw [ORACLEKEY]`](#sbv2-oracle-withdraw-oraclekey)
* [`sbv2 permission create [GRANTER] [GRANTEE]`](#sbv2-permission-create-granter-grantee)
* [`sbv2 permission print [PERMISSIONKEY]`](#sbv2-permission-print-permissionkey)
* [`sbv2 permission set [PERMISSIONKEY]`](#sbv2-permission-set-permissionkey)
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
* [`sbv2 program print`](#sbv2-program-print)
* [`sbv2 queue create`](#sbv2-queue-create)
* [`sbv2 queue print [QUEUEKEY]`](#sbv2-queue-print-queuekey)
* [`sbv2 queue set rewards [QUEUEKEY] [REWARDS]`](#sbv2-queue-set-rewards-queuekey-rewards)
* [`sbv2 queue set vrf [QUEUEKEY]`](#sbv2-queue-set-vrf-queuekey)
* [`sbv2 sandbox [PLACEHOLDER]`](#sbv2-sandbox-placeholder)
* [`sbv2 set aggregator [AGGREGATORKEY]`](#sbv2-set-aggregator-aggregatorkey)
* [`sbv2 test [ORACLEKEY]`](#sbv2-test-oraclekey)
* [`sbv2 update [CHANNEL]`](#sbv2-update-channel)
* [`sbv2 version`](#sbv2-version)
* [`sbv2 vrf create [QUEUEKEY]`](#sbv2-vrf-create-queuekey)
* [`sbv2 vrf create example [QUEUEKEY]`](#sbv2-vrf-create-example-queuekey)
* [`sbv2 vrf print [VRFKEY]`](#sbv2-vrf-print-vrfkey)
* [`sbv2 vrf request [VRFKEY]`](#sbv2-vrf-request-vrfkey)
* [`sbv2 vrf verify [VRFKEY]`](#sbv2-vrf-verify-vrfkey)
* [`sbv2 vrf watch [VRFKEY]`](#sbv2-vrf-watch-vrfkey)
* [`sbv2 watch aggregator [AGGREGATORKEY]`](#sbv2-watch-aggregator-aggregatorkey)
* [`sbv2 watch vrf [VRFKEY]`](#sbv2-watch-vrf-vrfkey)

## `sbv2 aggregator add crank [CRANKKEY] [AGGREGATORKEY]`

push an aggregator onto a crank

```
USAGE
  $ sbv2 aggregator add crank [CRANKKEY] [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
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

## `sbv2 aggregator add history [AGGREGATORKEY] [SIZE]`

set an aggregator's history buffer account to record the last N accepted results

```
USAGE
  $ sbv2 aggregator add history [AGGREGATORKEY] [SIZE] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
    <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to add to a crank
  SIZE           size of history buffer

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's history buffer account to record the last N accepted results

ALIASES
  $ sbv2 aggregator add history

EXAMPLES
  $ sbv2 aggregator:set:history GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 10000 --keypair ../payer-keypair.json
```

## `sbv2 aggregator add job [AGGREGATORKEY]`

add a job to an aggregator

```
USAGE
  $ sbv2 aggregator add job [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [--jobDefinition <value> | --jobKey <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --jobDefinition=<value>  filesystem path of job json definition file
  --jobKey=<value>         public key of an existing job account to add to an aggregator
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  add a job to an aggregator

EXAMPLES
  $ sbv2 aggregator:add:job
```

## `sbv2 aggregator create [QUEUEKEY]`

create an aggregator account

```
USAGE
  $ sbv2 aggregator create [QUEUEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [-a
    <value>] [--crankKey <value>] [--enable] [--queueAuthority <value>] [-n <value>] [--forceReportPeriod <value>]
    [--batchSize <value>] [--minJobs <value>] [--minOracles <value>] [--updateInterval <value>] [--varianceThreshold
    <value>] [-j <value>]

ARGUMENTS
  QUEUEKEY  public key of the oracle queue account to create aggregator for

FLAGS
  -a, --authority=<value>      alternate keypair that is the authority for the aggregator
  -j, --job=<value>...         filesystem path to job definition file
  -k, --keypair=<value>        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided
  -n, --name=<value>           name of the aggregator
  -s, --silent                 suppress cli prompts
  -u, --rpcUrl=<value>         alternate RPC url
  -v, --verbose                log everything
  --batchSize=<value>          number of oracles requested for each open round call
  --crankKey=<value>           public key of the crank to join
  --enable                     set permissions to PERMIT_ORACLE_QUEUE_USAGE
  --forceReportPeriod=<value>  Number of seconds for which, even if the variance threshold is not passed, accept new
                               responses from oracles.
  --mainnetBeta                WARNING: use mainnet-beta solana cluster
  --minJobs=<value>            number of jobs that must respond before an oracle responds
  --minOracles=<value>         number of oracles that must respond before a value is accepted on-chain
  --programId=<value>          alternative Switchboard program ID to interact with
  --queueAuthority=<value>     alternative keypair to use for queue authority
  --updateInterval=<value>     set an aggregator's minimum update delay
  --varianceThreshold=<value>  percentage change between a previous accepted result and the next round before an oracle
                               reports a value on-chain. Used to conserve lease cost during low volatility

DESCRIPTION
  create an aggregator account
```

## `sbv2 aggregator create copy [AGGREGATORSOURCE]`

copy an aggregator account to a new oracle queue

```
USAGE
  $ sbv2 aggregator create copy [AGGREGATORSOURCE] --queueKey <value> [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>] [-a <value>] [--minOracles <value>] [--batchSize <value>] [--minJobs <value>]
    [--minUpdateDelay <value>] [--forceReportPeriod <value>] [--varianceThreshold <value>] [--crankKey <value>]
    [--enable] [--queueAuthority <value>] [--copyJobs]

ARGUMENTS
  AGGREGATORSOURCE  public key of the aggregator account to copy

FLAGS
  -a, --authority=<value>      alternate keypair that will be the aggregator authority
  -k, --keypair=<value>        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided
  -s, --silent                 suppress cli prompts
  -u, --rpcUrl=<value>         alternate RPC url
  -v, --verbose                log everything
  --batchSize=<value>          override source aggregator's oracleRequestBatchSize
  --copyJobs                   create copy of job accounts instead of referincing existing job account
  --crankKey=<value>           public key of the crank to push aggregator to
  --enable                     set permissions to PERMIT_ORACLE_QUEUE_USAGE
  --forceReportPeriod=<value>  override source aggregator's forceReportPeriod
  --mainnetBeta                WARNING: use mainnet-beta solana cluster
  --minJobs=<value>            override source aggregator's minJobResults
  --minOracles=<value>         override source aggregator's minOracleResults
  --minUpdateDelay=<value>     override source aggregator's minUpdateDelaySeconds
  --programId=<value>          alternative Switchboard program ID to interact with
  --queueAuthority=<value>     alternative keypair to use for queue authority
  --queueKey=<value>           (required) public key of the queue to create aggregator for
  --varianceThreshold=<value>  override source aggregator's varianceThreshold

DESCRIPTION
  copy an aggregator account to a new oracle queue

EXAMPLES
  $ sbv2 aggregator:create:copy GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --queueKey 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json

  $ sbv2 aggregator:create:copy GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --queueKey 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json --sourceCluster mainnet-beta

  $ sbv2 aggregator:create:copy FcSmdsdWks75YdyCGegRqXdt5BiNGQKxZywyzb8ckD7D --queueKey 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json --sourceCluster mainnet-beta
```

## `sbv2 aggregator create json [DEFINITIONFILE]`

create an aggregator from a json file

```
USAGE
  $ sbv2 aggregator create json [DEFINITIONFILE] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [-q <value>] [-a <value>]

ARGUMENTS
  DEFINITIONFILE  filesystem path of queue definition json file

FLAGS
  -a, --authority=<value>  alternate keypair that will be the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -q, --queueKey=<value>   public key of the oracle queue to create aggregator for
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  create an aggregator from a json file

ALIASES
  $ sbv2 json create aggregator

EXAMPLES
  $ sbv2 aggregator:create:json examples/aggregator.json --keypair ../payer-keypair.json --queueKey GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --outputFile aggregator.schema.json
```

## `sbv2 aggregator history print [AGGREGATORKEY]`

Print the history buffer associated with an aggregator account

```
USAGE
  $ sbv2 aggregator history print [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
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

## `sbv2 aggregator lease create [AGGREGATORKEY]`

fund and re-enable an aggregator lease

```
USAGE
  $ sbv2 aggregator lease create [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [--amount <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to extend a lease for

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --amount=<value>       token amount to load into the lease escrow. If decimals provided, amount will be normalized to
                         raw tokenAmount
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  fund and re-enable an aggregator lease

ALIASES
  $ sbv2 aggregator lease create

EXAMPLES
  $ sbv2 lease:create GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.5 --keypair ../payer-keypair.json
```

## `sbv2 aggregator lease extend [AGGREGATORKEY]`

fund and re-enable an aggregator lease

```
USAGE
  $ sbv2 aggregator lease extend [AGGREGATORKEY] --amount <value> [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to extend a lease for

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --amount=<value>       (required) token amount to load into the lease escrow. If decimals provided, amount will be
                         normalized to raw tokenAmount
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  fund and re-enable an aggregator lease

ALIASES
  $ sbv2 aggregator lease extend

EXAMPLES
  $ sbv2 aggregator:lease:extend GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.1 --keypair ../payer-keypair.json
```

## `sbv2 aggregator lease print [AGGREGATORKEY]`

Print the lease account associated with a Switchboard aggregator account

```
USAGE
  $ sbv2 aggregator lease print [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
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

## `sbv2 aggregator lease withdraw [AGGREGATORKEY]`

withdraw funds from an aggregator lease

```
USAGE
  $ sbv2 aggregator lease withdraw [AGGREGATORKEY] --amount <value> [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>] [--withdrawAddress <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to extend a lease for

FLAGS
  -a, --authority=<value>    keypair delegated as the authority for managing the oracle account
  -k, --keypair=<value>      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided
  -s, --silent               suppress cli prompts
  -u, --rpcUrl=<value>       alternate RPC url
  -v, --verbose              log everything
  --amount=<value>           (required) token amount to withdraw from lease account. If decimals provided, amount will
                             be normalized to raw tokenAmount
  --mainnetBeta              WARNING: use mainnet-beta solana cluster
  --programId=<value>        alternative Switchboard program ID to interact with
  --withdrawAddress=<value>  tokenAccount to withdraw to. If not provided, payer associated token account will be used

DESCRIPTION
  withdraw funds from an aggregator lease

ALIASES
  $ sbv2 aggregator lease withdraw

EXAMPLES
  $ sbv2 aggregator:lease:withdraw GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.1 --keypair ../payer-keypair.json
```

## `sbv2 aggregator lock [AGGREGATORKEY]`

lock an aggregator's configuration and prevent further changes

```
USAGE
  $ sbv2 aggregator lock [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  lock an aggregator's configuration and prevent further changes
```

## `sbv2 aggregator permission create [AGGREGATORKEY]`

create a permission account for an aggregator

```
USAGE
  $ sbv2 aggregator permission create [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
  <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  create a permission account for an aggregator
```

## `sbv2 aggregator permission print [AGGREGATORKEY]`

Print the permission account associated with a Switchboard aggregator account

```
USAGE
  $ sbv2 aggregator permission print [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
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

## `sbv2 aggregator print [AGGREGATORKEY]`

Print the deserialized Switchboard aggregator account

```
USAGE
  $ sbv2 aggregator print [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
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

## `sbv2 aggregator print history [AGGREGATORKEY]`

Print the history buffer associated with an aggregator account

```
USAGE
  $ sbv2 aggregator print history [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
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

## `sbv2 aggregator print lease [AGGREGATORKEY]`

Print the lease account associated with a Switchboard aggregator account

```
USAGE
  $ sbv2 aggregator print lease [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
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

## `sbv2 aggregator print permission [AGGREGATORKEY]`

Print the permission account associated with a Switchboard aggregator account

```
USAGE
  $ sbv2 aggregator print permission [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
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

## `sbv2 aggregator remove job [AGGREGATORKEY] [JOBKEY]`

remove a switchboard job account from an aggregator

```
USAGE
  $ sbv2 aggregator remove job [AGGREGATORKEY] [JOBKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
    <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account
  JOBKEY         public key of an existing job account to remove from an aggregator

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  remove a switchboard job account from an aggregator

EXAMPLES
  $ sbv2 aggregator:remove:job
```

## `sbv2 aggregator save history [AGGREGATORKEY]`

request a new aggregator result from a set of oracles

```
USAGE
  $ sbv2 aggregator save history [AGGREGATORKEY] -f <value> [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
    <value>] [--force] [--json] [--csv]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to deserialize

FLAGS
  -f, --outputFile=<value>  (required) output file to save aggregator pubkeys to
  -k, --keypair=<value>     keypair that will pay for onchain transactions. defaults to new account authority if no
                            alternate authority provided
  -s, --silent              suppress cli prompts
  -u, --rpcUrl=<value>      alternate RPC url
  -v, --verbose             log everything
  --csv                     output aggregator accounts in csv format
  --force                   overwrite output file if exists
  --json                    output aggregator accounts in json format
  --mainnetBeta             WARNING: use mainnet-beta solana cluster
  --programId=<value>       alternative Switchboard program ID to interact with

DESCRIPTION
  request a new aggregator result from a set of oracles

EXAMPLES
  $ sbv2 aggregator:save:history --outputFile ../aggregator-history.json --csv
```

## `sbv2 aggregator set [AGGREGATORKEY]`

set an aggregator's config

```
USAGE
  $ sbv2 aggregator set [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [-a <value>] [--forceReportPeriod <value>] [--minJobs <value>] [--minOracles <value>] [--newQueue <value>]
    [--updateInterval <value>] [--varianceThreshold <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator

FLAGS
  -a, --authority=<value>      alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided
  -s, --silent                 suppress cli prompts
  -u, --rpcUrl=<value>         alternate RPC url
  -v, --verbose                log everything
  --forceReportPeriod=<value>  Number of seconds for which, even if the variance threshold is not passed, accept new
                               responses from oracles.
  --mainnetBeta                WARNING: use mainnet-beta solana cluster
  --minJobs=<value>            number of jobs that must respond before an oracle responds
  --minOracles=<value>         number of oracles that must respond before a value is accepted on-chain
  --newQueue=<value>           public key of the new oracle queue
  --programId=<value>          alternative Switchboard program ID to interact with
  --updateInterval=<value>     set an aggregator's minimum update delay
  --varianceThreshold=<value>  percentage change between a previous accepted result and the next round before an oracle
                               reports a value on-chain. Used to conserve lease cost during low volatility

DESCRIPTION
  set an aggregator's config

ALIASES
  $ sbv2 set aggregator

EXAMPLES
  $ sbv2 aggregator:set GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --updateInterval 300 --minOracles 3 --keypair ../payer-keypair.json
```

## `sbv2 aggregator set authority [AGGREGATORKEY] [NEWAUTHORITY]`

set an aggregator's authority

```
USAGE
  $ sbv2 aggregator set authority [AGGREGATORKEY] [NEWAUTHORITY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>]
    [-k <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account
  NEWAUTHORITY   keypair path of new authority

FLAGS
  -a, --currentAuthority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>           keypair that will pay for onchain transactions. defaults to new account authority if
                                  no alternate authority provided
  -s, --silent                    suppress cli prompts
  -u, --rpcUrl=<value>            alternate RPC url
  -v, --verbose                   log everything
  --mainnetBeta                   WARNING: use mainnet-beta solana cluster
  --programId=<value>             alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's authority
```

## `sbv2 aggregator set batchSize [AGGREGATORKEY] BATCHSIZE`

set an aggregator's batch size

```
USAGE
  $ sbv2 aggregator set batchSize [AGGREGATORKEY] [BATCHSIZE] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
    <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account
  BATCHSIZE      number of oracles requested for each open round call

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's batch size
```

## `sbv2 aggregator set forceReport [AGGREGATORKEY] [FORCEREPORTPERIOD]`

set an aggregator's force report period

```
USAGE
  $ sbv2 aggregator set forceReport [AGGREGATORKEY] [FORCEREPORTPERIOD] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY      public key of the aggregator
  FORCEREPORTPERIOD  Number of seconds for which, even if the variance threshold is not passed, accept new responses
                     from oracles.

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's force report period

ALIASES
  $ sbv2 aggregator set forceReport

EXAMPLES
  $ sbv2 aggregator:set:forceReportPeriod GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 300 --keypair ../payer-keypair.json
```

## `sbv2 aggregator set forceReportPeriod [AGGREGATORKEY] [FORCEREPORTPERIOD]`

set an aggregator's force report period

```
USAGE
  $ sbv2 aggregator set forceReportPeriod [AGGREGATORKEY] [FORCEREPORTPERIOD] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY      public key of the aggregator
  FORCEREPORTPERIOD  Number of seconds for which, even if the variance threshold is not passed, accept new responses
                     from oracles.

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's force report period

ALIASES
  $ sbv2 aggregator set forceReport

EXAMPLES
  $ sbv2 aggregator:set:forceReportPeriod GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 300 --keypair ../payer-keypair.json
```

## `sbv2 aggregator set history [AGGREGATORKEY] [SIZE]`

set an aggregator's history buffer account to record the last N accepted results

```
USAGE
  $ sbv2 aggregator set history [AGGREGATORKEY] [SIZE] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
    <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to add to a crank
  SIZE           size of history buffer

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's history buffer account to record the last N accepted results

ALIASES
  $ sbv2 aggregator add history

EXAMPLES
  $ sbv2 aggregator:set:history GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 10000 --keypair ../payer-keypair.json
```

## `sbv2 aggregator set minJobs [AGGREGATORKEY] [MINJOBRESULTS]`

set an aggregator's minimum number of jobs before an oracle responds

```
USAGE
  $ sbv2 aggregator set minJobs [AGGREGATORKEY] [MINJOBRESULTS] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>]
    [-k <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account
  MINJOBRESULTS  number of jobs that must respond before an oracle responds

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's minimum number of jobs before an oracle responds
```

## `sbv2 aggregator set minOracles [AGGREGATORKEY] [MINORACLERESULTS]`

set an aggregator's minimum number of oracles that must respond before a result is accepted on-chain

```
USAGE
  $ sbv2 aggregator set minOracles [AGGREGATORKEY] [MINORACLERESULTS] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY     public key of the aggregator account
  MINORACLERESULTS  number of oracles that must respond before a value is accepted on-chain

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's minimum number of oracles that must respond before a result is accepted on-chain
```

## `sbv2 aggregator set queue [AGGREGATORKEY] [QUEUEKEY]`

set an aggregator's oracle queue

```
USAGE
  $ sbv2 aggregator set queue [AGGREGATORKEY] [QUEUEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
    <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator
  QUEUEKEY       public key of the oracle queue

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's oracle queue
```

## `sbv2 aggregator set updateInterval [AGGREGATORKEY] [UPDATEINTERVAL]`

set an aggregator's minimum update delay

```
USAGE
  $ sbv2 aggregator set updateInterval [AGGREGATORKEY] [UPDATEINTERVAL] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY   public key of the aggregator account
  UPDATEINTERVAL  set an aggregator's minimum update delay

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's minimum update delay

EXAMPLES
  $ sbv2 aggregator:set:updateInterval GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 60 --keypair ../payer-keypair.json
```

## `sbv2 aggregator set variance [AGGREGATORKEY] [VARIANCETHRESHOLD]`

set an aggregator's variance threshold

```
USAGE
  $ sbv2 aggregator set variance [AGGREGATORKEY] [VARIANCETHRESHOLD] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY      public key of the aggregator
  VARIANCETHRESHOLD  percentage change between a previous accepted result and the next round before an oracle reports a
                     value on-chain. Used to conserve lease cost during low volatility

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's variance threshold

ALIASES
  $ sbv2 aggregator set variance

EXAMPLES
  $ sbv2 aggregator:set:varianceThreshold GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 0.1 --keypair ../payer-keypair.json
```

## `sbv2 aggregator set varianceThreshold [AGGREGATORKEY] [VARIANCETHRESHOLD]`

set an aggregator's variance threshold

```
USAGE
  $ sbv2 aggregator set varianceThreshold [AGGREGATORKEY] [VARIANCETHRESHOLD] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY      public key of the aggregator
  VARIANCETHRESHOLD  percentage change between a previous accepted result and the next round before an oracle reports a
                     value on-chain. Used to conserve lease cost during low volatility

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an aggregator's variance threshold

ALIASES
  $ sbv2 aggregator set variance

EXAMPLES
  $ sbv2 aggregator:set:varianceThreshold GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 0.1 --keypair ../payer-keypair.json
```

## `sbv2 aggregator update [AGGREGATORKEY]`

request a new aggregator result from a set of oracles

```
USAGE
  $ sbv2 aggregator update [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  request a new aggregator result from a set of oracles

EXAMPLES
  $ sbv2 aggregator:update J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa --keypair ../payer-keypair.json
```

## `sbv2 aggregator watch [AGGREGATORKEY]`

watch an aggregator for a new value

```
USAGE
  $ sbv2 aggregator watch [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  watch an aggregator for a new value

ALIASES
  $ sbv2 aggregator watch

EXAMPLES
  $ sbv2 watch:aggregator J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa
```

## `sbv2 anchor test`

run anchor test and a switchboard oracle in parallel

```
USAGE
  $ sbv2 anchor test [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [-d <value>]
    [--oracleKey <value>] [--nodeImage <value>] [--arm] [-t <value>]

FLAGS
  -d, --switchboardDir=<value>  directory with switchboard.env to load a switchboard environment
  -k, --keypair=<value>         keypair that will pay for onchain transactions. defaults to new account authority if no
                                alternate authority provided
  -s, --silent                  suppress docker logging
  -t, --timeout=<value>         [default: 120] number of seconds before timing out
  -u, --rpcUrl=<value>          alternate RPC url
  -v, --verbose                 log everything
  --arm                         apple silicon needs to use a docker image for linux/arm64
  --mainnetBeta                 WARNING: use mainnet-beta solana cluster
  --nodeImage=<value>           [default: dev-v2-08-14-22a-mc-beta] public key of the oracle to start-up
  --oracleKey=<value>           public key of the oracle to start-up
  --programId=<value>           alternative Switchboard program ID to interact with

DESCRIPTION
  run anchor test and a switchboard oracle in parallel
```

## `sbv2 buffer create [QUEUEKEY]`

create a buffer relayer account

```
USAGE
  $ sbv2 buffer create [QUEUEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [-a
    <value>] [-n <value>] [--minUpdateDelaySeconds <value>] [--jobDefinition <value> | --jobKey <value>]

ARGUMENTS
  QUEUEKEY  oracle queue to create BufferRelayer account on

FLAGS
  -a, --authority=<value>          alternate keypair that will be the aggregator authority
  -k, --keypair=<value>            keypair that will pay for onchain transactions. defaults to new account authority if
                                   no alternate authority provided
  -n, --name=<value>               name of the buffer account
  -s, --silent                     suppress cli prompts
  -u, --rpcUrl=<value>             alternate RPC url
  -v, --verbose                    log everything
  --jobDefinition=<value>          filesystem path to job definition
  --jobKey=<value>                 public key of existing job account
  --mainnetBeta                    WARNING: use mainnet-beta solana cluster
  --minUpdateDelaySeconds=<value>  [default: 30] minimum number of seconds between update calls
  --programId=<value>              alternative Switchboard program ID to interact with

DESCRIPTION
  create a buffer relayer account
```

## `sbv2 buffer print [BUFFERRELAYERKEY]`

Print the deserialized Switchboard buffer relayer account

```
USAGE
  $ sbv2 buffer print [BUFFERRELAYERKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
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

## `sbv2 custom queue`

create a custom queue

```
USAGE
  $ sbv2 custom queue [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [--force] [-a
    <value>] [-n <value>] [--minStake <value>] [-r <value>] [-c <value>] [--oracleTimeout <value>] [-o <value>]
    [--queueSize <value>] [--unpermissionedFeeds] [--unpermissionedVrf] [--enableBufferRelayers] [-f <value>]

FLAGS
  -a, --authority=<value>   keypair to delegate authority to for creating permissions targeted at the queue
  -c, --crankSize=<value>   [default: 100] size of the crank
  -f, --outputFile=<value>  output queue schema to a json file
  -k, --keypair=<value>     keypair that will pay for onchain transactions. defaults to new account authority if no
                            alternate authority provided
  -n, --name=<value>        [default: Custom Queue] name of the queue for easier identification
  -o, --numOracles=<value>  number of oracles to add to the queue
  -r, --reward=<value>      [default: 0] oracle rewards for successfully responding to an update request
  -s, --silent              suppress cli prompts
  -u, --rpcUrl=<value>      alternate RPC url
  -v, --verbose             log everything
  --enableBufferRelayers    enable oracles to fulfill buffer relayer requests
  --force                   overwrite output file if existing
  --mainnetBeta             WARNING: use mainnet-beta solana cluster
  --minStake=<value>        [default: 0] minimum stake required by an oracle to join the queue
  --oracleTimeout=<value>   [default: 180] number of oracles to add to the queue
  --programId=<value>       alternative Switchboard program ID to interact with
  --queueSize=<value>       [default: 100] maximum number of oracles the queue can support
  --unpermissionedFeeds     permit unpermissioned feeds
  --unpermissionedVrf       permit unpermissioned VRF accounts

DESCRIPTION
  create a custom queue

ALIASES
  $ sbv2 custom queue
```

## `sbv2 help [COMMAND]`

Display help for sbv2.

```
USAGE
  $ sbv2 help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for sbv2.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `sbv2 job create JOBDEFINITION`

create a job account

```
USAGE
  $ sbv2 job create [JOBDEFINITION] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [-a <value>] [-n <value>]

ARGUMENTS
  JOBDEFINITION  filesystem path to job definition

FLAGS
  -a, --authority=<value>  alternate keypair that will be the account authority
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -n, --name=<value>       name of the buffer account
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  create a job account
```

## `sbv2 job print [JOBKEY]`

Print the deserialized Switchboard job account

```
USAGE
  $ sbv2 job print [JOBKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

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

## `sbv2 json create aggregator [DEFINITIONFILE]`

create an aggregator from a json file

```
USAGE
  $ sbv2 json create aggregator [DEFINITIONFILE] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [-q <value>] [-a <value>]

ARGUMENTS
  DEFINITIONFILE  filesystem path of queue definition json file

FLAGS
  -a, --authority=<value>  alternate keypair that will be the authority for the aggregator
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -q, --queueKey=<value>   public key of the oracle queue to create aggregator for
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  create an aggregator from a json file

ALIASES
  $ sbv2 json create aggregator

EXAMPLES
  $ sbv2 aggregator:create:json examples/aggregator.json --keypair ../payer-keypair.json --queueKey GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --outputFile aggregator.schema.json
```

## `sbv2 lease create [AGGREGATORKEY]`

fund and re-enable an aggregator lease

```
USAGE
  $ sbv2 lease create [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [--amount <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to extend a lease for

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --amount=<value>       token amount to load into the lease escrow. If decimals provided, amount will be normalized to
                         raw tokenAmount
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  fund and re-enable an aggregator lease

ALIASES
  $ sbv2 aggregator lease create

EXAMPLES
  $ sbv2 lease:create GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.5 --keypair ../payer-keypair.json
```

## `sbv2 lease extend [AGGREGATORKEY]`

fund and re-enable an aggregator lease

```
USAGE
  $ sbv2 lease extend [AGGREGATORKEY] --amount <value> [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to extend a lease for

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --amount=<value>       (required) token amount to load into the lease escrow. If decimals provided, amount will be
                         normalized to raw tokenAmount
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  fund and re-enable an aggregator lease

ALIASES
  $ sbv2 aggregator lease extend

EXAMPLES
  $ sbv2 aggregator:lease:extend GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.1 --keypair ../payer-keypair.json
```

## `sbv2 lease withdraw [AGGREGATORKEY]`

withdraw funds from an aggregator lease

```
USAGE
  $ sbv2 lease withdraw [AGGREGATORKEY] --amount <value> [-v] [-s] [--mainnetBeta] [-u <value>] [--programId
    <value>] [-k <value>] [--withdrawAddress <value>] [-a <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to extend a lease for

FLAGS
  -a, --authority=<value>    keypair delegated as the authority for managing the oracle account
  -k, --keypair=<value>      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided
  -s, --silent               suppress cli prompts
  -u, --rpcUrl=<value>       alternate RPC url
  -v, --verbose              log everything
  --amount=<value>           (required) token amount to withdraw from lease account. If decimals provided, amount will
                             be normalized to raw tokenAmount
  --mainnetBeta              WARNING: use mainnet-beta solana cluster
  --programId=<value>        alternative Switchboard program ID to interact with
  --withdrawAddress=<value>  tokenAccount to withdraw to. If not provided, payer associated token account will be used

DESCRIPTION
  withdraw funds from an aggregator lease

ALIASES
  $ sbv2 aggregator lease withdraw

EXAMPLES
  $ sbv2 aggregator:lease:withdraw GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.1 --keypair ../payer-keypair.json
```

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

_See code: [dist/commands/print/index.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.2.26/dist/commands/print/index.ts)_

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

## `sbv2 program print`

print the deserialized switchboard program state account

```
USAGE
  $ sbv2 program print [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

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

## `sbv2 queue create`

create a custom queue

```
USAGE
  $ sbv2 queue create [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [--force] [-a
    <value>] [-n <value>] [--minStake <value>] [-r <value>] [-c <value>] [--oracleTimeout <value>] [-o <value>]
    [--queueSize <value>] [--unpermissionedFeeds] [--unpermissionedVrf] [--enableBufferRelayers] [-f <value>]

FLAGS
  -a, --authority=<value>   keypair to delegate authority to for creating permissions targeted at the queue
  -c, --crankSize=<value>   [default: 100] size of the crank
  -f, --outputFile=<value>  output queue schema to a json file
  -k, --keypair=<value>     keypair that will pay for onchain transactions. defaults to new account authority if no
                            alternate authority provided
  -n, --name=<value>        [default: Custom Queue] name of the queue for easier identification
  -o, --numOracles=<value>  number of oracles to add to the queue
  -r, --reward=<value>      [default: 0] oracle rewards for successfully responding to an update request
  -s, --silent              suppress cli prompts
  -u, --rpcUrl=<value>      alternate RPC url
  -v, --verbose             log everything
  --enableBufferRelayers    enable oracles to fulfill buffer relayer requests
  --force                   overwrite output file if existing
  --mainnetBeta             WARNING: use mainnet-beta solana cluster
  --minStake=<value>        [default: 0] minimum stake required by an oracle to join the queue
  --oracleTimeout=<value>   [default: 180] number of oracles to add to the queue
  --programId=<value>       alternative Switchboard program ID to interact with
  --queueSize=<value>       [default: 100] maximum number of oracles the queue can support
  --unpermissionedFeeds     permit unpermissioned feeds
  --unpermissionedVrf       permit unpermissioned VRF accounts

DESCRIPTION
  create a custom queue

ALIASES
  $ sbv2 custom queue
```

## `sbv2 queue print [QUEUEKEY]`

Print the deserialized Switchboard oraclequeue account

```
USAGE
  $ sbv2 queue print [QUEUEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
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

## `sbv2 queue set rewards [QUEUEKEY] [REWARDS]`

set an oracle queue's rewards

```
USAGE
  $ sbv2 queue set rewards [QUEUEKEY] [REWARDS] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
    <value>] [-a <value>]

ARGUMENTS
  QUEUEKEY  public key of the oracle queue
  REWARDS   token rewards for each assigned oracle per open round call

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for oracle queue
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set an oracle queue's rewards
```

## `sbv2 queue set vrf [QUEUEKEY]`

set unpermissionedVrfEnabled

```
USAGE
  $ sbv2 queue set vrf [QUEUEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [-a
    <value>] [--disable]

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to create a crank on

FLAGS
  -a, --authority=<value>  alternate keypair that is the authority for oracle queue
  -k, --keypair=<value>    keypair that will pay for onchain transactions. defaults to new account authority if no
                           alternate authority provided
  -s, --silent             suppress cli prompts
  -u, --rpcUrl=<value>     alternate RPC url
  -v, --verbose            log everything
  --disable                disable unpermissionedVrfEnabled
  --mainnetBeta            WARNING: use mainnet-beta solana cluster
  --programId=<value>      alternative Switchboard program ID to interact with

DESCRIPTION
  set unpermissionedVrfEnabled
```

## `sbv2 sandbox [PLACEHOLDER]`

sandbox

```
USAGE
  $ sbv2 sandbox [PLACEHOLDER] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [-n
    <value>]

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -n, --name=<value>     name of the job account for easier identification
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  sandbox
```

_See code: [dist/commands/sandbox.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.2.26/dist/commands/sandbox.ts)_

## `sbv2 set aggregator [AGGREGATORKEY]`

set an aggregator's config

```
USAGE
  $ sbv2 set aggregator [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [-a <value>] [--forceReportPeriod <value>] [--minJobs <value>] [--minOracles <value>] [--newQueue <value>]
    [--updateInterval <value>] [--varianceThreshold <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator

FLAGS
  -a, --authority=<value>      alternate keypair that is the authority for the aggregator
  -k, --keypair=<value>        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided
  -s, --silent                 suppress cli prompts
  -u, --rpcUrl=<value>         alternate RPC url
  -v, --verbose                log everything
  --forceReportPeriod=<value>  Number of seconds for which, even if the variance threshold is not passed, accept new
                               responses from oracles.
  --mainnetBeta                WARNING: use mainnet-beta solana cluster
  --minJobs=<value>            number of jobs that must respond before an oracle responds
  --minOracles=<value>         number of oracles that must respond before a value is accepted on-chain
  --newQueue=<value>           public key of the new oracle queue
  --programId=<value>          alternative Switchboard program ID to interact with
  --updateInterval=<value>     set an aggregator's minimum update delay
  --varianceThreshold=<value>  percentage change between a previous accepted result and the next round before an oracle
                               reports a value on-chain. Used to conserve lease cost during low volatility

DESCRIPTION
  set an aggregator's config

ALIASES
  $ sbv2 set aggregator

EXAMPLES
  $ sbv2 aggregator:set GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --updateInterval 300 --minOracles 3 --keypair ../payer-keypair.json
```

## `sbv2 test [ORACLEKEY]`

sandbox

```
USAGE
  $ sbv2 test [ORACLEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  ORACLEKEY  public key of the oracle to deposit funds into

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  sandbox
```

_See code: [dist/commands/test.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.2.26/dist/commands/test.ts)_

## `sbv2 update [CHANNEL]`

update the sbv2 CLI

```
USAGE
  $ sbv2 update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
  --force                Force a re-download of the requested version.

DESCRIPTION
  update the sbv2 CLI

EXAMPLES
  Update to the stable channel:

    $ sbv2 update stable

  Update to a specific version:

    $ sbv2 update --version 1.0.0

  Interactively select version:

    $ sbv2 update --interactive

  See available versions:

    $ sbv2 update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v3.0.0/src/commands/update.ts)_

## `sbv2 version`

```
USAGE
  $ sbv2 version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.1.1/src/commands/version.ts)_

## `sbv2 vrf create [QUEUEKEY]`

create a Switchboard VRF Account

```
USAGE
  $ sbv2 vrf create [QUEUEKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [--vrfKeypair <value>] [--enable] [--authority <value>] [--queueAuthority <value>] [--callback <value> |
    --accountMeta <value> | --callbackPid <value> | --ixData <value>]

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to create VRF account for

FLAGS
  -k, --keypair=<value>     keypair that will pay for onchain transactions. defaults to new account authority if no
                            alternate authority provided
  -s, --silent              suppress cli prompts
  -u, --rpcUrl=<value>      alternate RPC url
  -v, --verbose             log everything
  --accountMeta=<value>...  account metas for VRF callback
  --authority=<value>       alternative keypair to use for VRF authority
  --callback=<value>        filesystem path to callback json
  --callbackPid=<value>     callback program ID
  --enable                  enable vrf permissions
  --ixData=<value>          serialized instruction data in bytes
  --mainnetBeta             WARNING: use mainnet-beta solana cluster
  --programId=<value>       alternative Switchboard program ID to interact with
  --queueAuthority=<value>  alternative keypair to use for queue authority
  --vrfKeypair=<value>      filesystem path of existing keypair to use for VRF Account

DESCRIPTION
  create a Switchboard VRF Account

EXAMPLES
  $ sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable --queueAuthority queue-authority-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HpQoFL5kxPp2JCFvjsVTvBd7navx4THLefUU68SXAyd6","isSigner": false,"isWritable": true}" -a "{"pubkey": "8VdBtS8ufkXMCa6Yr9E4KVCfX2inVZVwU4KGg2CL1q7P","isSigner": false,"isWritable": false}"

  $ sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable --queueAuthority oracle-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HYKi1grticLXPe5vqapUHhm976brwqRob8vqRnWMKWL5","isSigner": false,"isWritable": true}" -a "{"pubkey": "6vG9QLMgSvsfjvSpDxWfZ2MGPYGzEYoBxviLG7cr4go","isSigner": false,"isWritable": false}"

  $ sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable --queueAuthority queue-authority-keypair.json --callback callback-example.json
```

## `sbv2 vrf create example [QUEUEKEY]`

create a VRF account for the client example program

```
USAGE
  $ sbv2 vrf create example [QUEUEKEY] --vrfPid <value> [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k
    <value>] [--vrfKeypair <value>] [--enable] [--queueAuthority <value>] [--maxResult <value>]

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to create VRF account for

FLAGS
  -k, --keypair=<value>     keypair that will pay for onchain transactions. defaults to new account authority if no
                            alternate authority provided
  -s, --silent              suppress cli prompts
  -u, --rpcUrl=<value>      alternate RPC url
  -v, --verbose             log everything
  --enable                  enable vrf permissions
  --mainnetBeta             WARNING: use mainnet-beta solana cluster
  --maxResult=<value>       [default: 256000] the maximum VRF result
  --programId=<value>       alternative Switchboard program ID to interact with
  --queueAuthority=<value>  alternative keypair to use for queue authority
  --vrfKeypair=<value>      filesystem path of existing keypair to use for VRF Account
  --vrfPid=<value>          (required) program ID for the VRF example program

DESCRIPTION
  create a VRF account for the client example program

EXAMPLES
  $ sbv2 vrf:create:example 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --vrfPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --keypair ../payer-keypair.json -v --enable --queueAuthority queue-authority-keypair.json
```

## `sbv2 vrf print [VRFKEY]`

Print the deserialized Switchboard VRF account

```
USAGE
  $ sbv2 vrf print [VRFKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>] [--json]

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

## `sbv2 vrf request [VRFKEY]`

request a new value for a VRF

```
USAGE
  $ sbv2 vrf request [VRFKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]
    [--funderAuthority <value>] [--authority <value>]

ARGUMENTS
  VRFKEY  public key of the VRF account to request randomness for

FLAGS
  -k, --keypair=<value>      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided
  -s, --silent               suppress cli prompts
  -u, --rpcUrl=<value>       alternate RPC url
  -v, --verbose              log everything
  --authority=<value>        alternative keypair that is the VRF authority
  --funderAuthority=<value>  alternative keypair to pay for VRF request
  --mainnetBeta              WARNING: use mainnet-beta solana cluster
  --programId=<value>        alternative Switchboard program ID to interact with

DESCRIPTION
  request a new value for a VRF

EXAMPLES
  $ sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable --queueAuthority queue-authority-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HpQoFL5kxPp2JCFvjsVTvBd7navx4THLefUU68SXAyd6","isSigner": false,"isWritable": true}" -a "{"pubkey": "8VdBtS8ufkXMCa6Yr9E4KVCfX2inVZVwU4KGg2CL1q7P","isSigner": false,"isWritable": false}"
```

## `sbv2 vrf verify [VRFKEY]`

if ready, verify a VRF proof

```
USAGE
  $ sbv2 vrf verify [VRFKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  VRFKEY  public key of the VRF account to request randomness for

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  if ready, verify a VRF proof
```

## `sbv2 vrf watch [VRFKEY]`

watch a vrf for a new value

```
USAGE
  $ sbv2 vrf watch [VRFKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

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

DESCRIPTION
  watch a vrf for a new value

ALIASES
  $ sbv2 vrf watch

EXAMPLES
  $ sbv2 vrf:aggregator J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa
```

## `sbv2 watch aggregator [AGGREGATORKEY]`

watch an aggregator for a new value

```
USAGE
  $ sbv2 watch aggregator [AGGREGATORKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to deserialize

FLAGS
  -k, --keypair=<value>  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided
  -s, --silent           suppress cli prompts
  -u, --rpcUrl=<value>   alternate RPC url
  -v, --verbose          log everything
  --mainnetBeta          WARNING: use mainnet-beta solana cluster
  --programId=<value>    alternative Switchboard program ID to interact with

DESCRIPTION
  watch an aggregator for a new value

ALIASES
  $ sbv2 aggregator watch

EXAMPLES
  $ sbv2 watch:aggregator J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa
```

## `sbv2 watch vrf [VRFKEY]`

watch a vrf for a new value

```
USAGE
  $ sbv2 watch vrf [VRFKEY] [-v] [-s] [--mainnetBeta] [-u <value>] [--programId <value>] [-k <value>]

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

DESCRIPTION
  watch a vrf for a new value

ALIASES
  $ sbv2 vrf watch

EXAMPLES
  $ sbv2 vrf:aggregator J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa
```
<!-- commandsstop -->
