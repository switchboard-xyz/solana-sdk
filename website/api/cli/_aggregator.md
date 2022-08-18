
interact with a switchboard aggregator account

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
