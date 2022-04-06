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
* [`sbv2 aggregator:add:crank AGGREGATORKEY CRANKKEY`](#sbv2-aggregatoraddcrank-aggregatorkey-crankkey)
* [`sbv2 aggregator:add:history AGGREGATORKEY SIZE`](#sbv2-aggregatoraddhistory-aggregatorkey-size)
* [`sbv2 aggregator:add:job AGGREGATORKEY`](#sbv2-aggregatoraddjob-aggregatorkey)
* [`sbv2 aggregator:create:copy AGGREGATORSOURCE QUEUEKEY`](#sbv2-aggregatorcreatecopy-aggregatorsource-queuekey)
* [`sbv2 aggregator:create:json DEFINITIONFILE`](#sbv2-aggregatorcreatejson-definitionfile)
* [`sbv2 aggregator:lease:extend AGGREGATORKEY AMOUNT`](#sbv2-aggregatorleaseextend-aggregatorkey-amount)
* [`sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY`](#sbv2-aggregatorremovejob-aggregatorkey-jobkey)
* [`sbv2 aggregator:update AGGREGATORKEY`](#sbv2-aggregatorupdate-aggregatorkey)
* [`sbv2 config:print`](#sbv2-configprint)
* [`sbv2 config:set PARAM [VALUE]`](#sbv2-configset-param-value)
* [`sbv2 crank:turn CRANKKEY`](#sbv2-crankturn-crankkey)
* [`sbv2 job:create:copy JOBSOURCE`](#sbv2-jobcreatecopy-jobsource)
* [`sbv2 job:create:json DEFINITIONFILE`](#sbv2-jobcreatejson-definitionfile)
* [`sbv2 job:create:template TEMPLATE ID`](#sbv2-jobcreatetemplate-template-id)
* [`sbv2 json:add:aggregator`](#sbv2-jsonaddaggregator)
* [`sbv2 json:add:crank SCHEMAFILE`](#sbv2-jsonaddcrank-schemafile)
* [`sbv2 json:add:oracle SCHEMAFILE`](#sbv2-jsonaddoracle-schemafile)
* [`sbv2 json:create:queue INPUTFILE OUTPUTFILE`](#sbv2-jsoncreatequeue-inputfile-outputfile)
* [`sbv2 oracle:balance ORACLEKEY`](#sbv2-oraclebalance-oraclekey)
* [`sbv2 oracle:create QUEUEKEY`](#sbv2-oraclecreate-queuekey)
* [`sbv2 oracle:deposit ORACLEKEY AMOUNT`](#sbv2-oracledeposit-oraclekey-amount)
* [`sbv2 oracle:withdraw ORACLEKEY AMOUNT`](#sbv2-oraclewithdraw-oraclekey-amount)
* [`sbv2 print PUBLICKEY`](#sbv2-print-publickey)
* [`sbv2 print:aggregator AGGREGATORKEY`](#sbv2-printaggregator-aggregatorkey)
* [`sbv2 print:aggregator:history AGGREGATORKEY`](#sbv2-printaggregatorhistory-aggregatorkey)
* [`sbv2 print:aggregator:lease AGGREGATORKEY`](#sbv2-printaggregatorlease-aggregatorkey)
* [`sbv2 print:aggregator:permission AGGREGATORKEY`](#sbv2-printaggregatorpermission-aggregatorkey)
* [`sbv2 print:crank CRANKKEY`](#sbv2-printcrank-crankkey)
* [`sbv2 print:job JOBKEY`](#sbv2-printjob-jobkey)
* [`sbv2 print:job:templates`](#sbv2-printjobtemplates)
* [`sbv2 print:json:samples OUTPUTDIRECTORY`](#sbv2-printjsonsamples-outputdirectory)
* [`sbv2 print:mint`](#sbv2-printmint)
* [`sbv2 print:oracle ORACLEKEY`](#sbv2-printoracle-oraclekey)
* [`sbv2 print:oracle:permission ORACLEKEY`](#sbv2-printoraclepermission-oraclekey)
* [`sbv2 print:program`](#sbv2-printprogram)
* [`sbv2 print:queue QUEUEKEY`](#sbv2-printqueue-queuekey)
* [`sbv2 queue:add:crank QUEUEKEY`](#sbv2-queueaddcrank-queuekey)
* [`sbv2 queue:create`](#sbv2-queuecreate)
* [`sbv2 queue:permit:aggregator AGGREGATORKEY`](#sbv2-queuepermitaggregator-aggregatorkey)
* [`sbv2 queue:permit:oracle ORACLEKEY`](#sbv2-queuepermitoracle-oraclekey)
* [`sbv2 sandbox [PLACEHOLDER]`](#sbv2-sandbox-placeholder)
* [`sbv2 update [CHANNEL]`](#sbv2-update-channel)

## `sbv2 aggregator:add:crank AGGREGATORKEY CRANKKEY`

add the aggregator to a crank

```
USAGE
  $ sbv2 aggregator:add:crank AGGREGATORKEY CRANKKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator to add to a crank
  CRANKKEY       public key of the crank to add aggregator to

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

EXAMPLE
  $ sbv2 aggregator:add:crank --keypair ../payer-keypair.json
```

_See code: [src/commands/aggregator/add/crank.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/aggregator/add/crank.ts)_

## `sbv2 aggregator:add:history AGGREGATORKEY SIZE`

add a history buffer to an aggregator

```
USAGE
  $ sbv2 aggregator:add:history AGGREGATORKEY SIZE

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

EXAMPLE
  $ sbv2 aggregator:add:history --keypair ../payer-keypair.json GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR 10000
```

_See code: [src/commands/aggregator/add/history.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/aggregator/add/history.ts)_

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

_See code: [src/commands/aggregator/add/job.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/aggregator/add/job.ts)_

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

_See code: [src/commands/aggregator/create/copy.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/aggregator/create/copy.ts)_

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

_See code: [src/commands/aggregator/create/json.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/aggregator/create/json.ts)_

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

_See code: [src/commands/aggregator/lease/extend.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/aggregator/lease/extend.ts)_

## `sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY`

remove a switchboard job account from an aggregator

```
USAGE
  $ sbv2 aggregator:remove:job AGGREGATORKEY JOBKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account
  JOBKEY         public key of an existing job account to remove from an aggregator

OPTIONS
  -f, --outputFile=outputFile                output file to save aggregator definition to
  -h, --help                                 show CLI help

  -k, --keypair=keypair                      keypair that will pay for onchain transactions. defaults to new account
                                             authority if no alternate authority provided

  -s, --silent                               suppress cli prompts

  -u, --rpcUrl=rpcUrl                        alternate RPC url

  -v, --verbose                              log everything

  --aggregatorAuthority=aggregatorAuthority  alternate keypair that is the authority for the aggregator

  --force                                    overwrite outputFile if existing

  --mainnetBeta                              WARNING: use mainnet-beta solana cluster

EXAMPLE
  $ sbv2 aggregator:remove:job
```

_See code: [src/commands/aggregator/remove/job.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/aggregator/remove/job.ts)_

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

_See code: [src/commands/aggregator/update.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/aggregator/update.ts)_

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

EXAMPLE
  $ sbv2 config:print
```

_See code: [src/commands/config/print.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/config/print.ts)_

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
```

_See code: [src/commands/config/set.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/config/set.ts)_

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

EXAMPLE
  $ sbv2 crank:turn 85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr --keypair ../payer-keypair.json
```

_See code: [src/commands/crank/turn.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/crank/turn.ts)_

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

EXAMPLE
  $ sbv2 job:create:copy 7pdb5RVM6cVBU8XDfpGqakb1S4wX2i5QsZxT117tK4HS --keypair ../payer-keypair.json
```

_See code: [src/commands/job/create/copy.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/job/create/copy.ts)_

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

ALIASES
  $ sbv2 json:create:job

EXAMPLE
  $ sbv2 job:create:json examples/job.json --keypair ../payer-keypair.json 
  --aggregatorAuthority=../aggregator-keypair.json --outputFile=job.schema.json
```

_See code: [src/commands/job/create/json.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/job/create/json.ts)_

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

EXAMPLES
  $ sbv2 job:create:template ftxUs BTC_USD --keypair ../payer-keypair.json
  $ sbv2 job:create:template ftxUs BTC_USD --keypair ../payer-keypair.json --name=ftxUs_Btc
  $ sbv2 job:create:template ftxUs BTC_USD -k ../payer-keypair.json -n ftxUs_Btc -f ftx_us_btc_job.json
```

_See code: [src/commands/job/create/template.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/job/create/template.ts)_

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

  --sourceAggregator=sourceAggregator  public key of an existing aggregator account to copy
```

_See code: [src/commands/json/add/aggregator.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/json/add/aggregator.ts)_

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
```

_See code: [src/commands/json/add/crank.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/json/add/crank.ts)_

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
```

_See code: [src/commands/json/add/oracle.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/json/add/oracle.ts)_

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

ALIASES
  $ sbv2 queue:create:json

EXAMPLE
  $ sbv2 json:create:queue examples/queue.json queue-1.json -k ../authority-keypair.json
```

_See code: [src/commands/json/create/queue.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/json/create/queue.ts)_

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

EXAMPLE
  $ sbv2 oracle:balance 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

_See code: [src/commands/oracle/balance.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/oracle/balance.ts)_

## `sbv2 oracle:create QUEUEKEY`

create a new oracle account for a given queue

```
USAGE
  $ sbv2 oracle:create QUEUEKEY

ARGUMENTS
  QUEUEKEY  public key of the oracle queue to join

OPTIONS
  -a, --authority=authority  keypair to delegate authority to for managing the oracle account
  -h, --help                 show CLI help

  -k, --keypair=keypair      keypair that will pay for onchain transactions. defaults to new account authority if no
                             alternate authority provided

  -n, --name=name            name of the oracle for easier identification

  -s, --silent               suppress cli prompts

  -u, --rpcUrl=rpcUrl        alternate RPC url

  -v, --verbose              log everything

  --mainnetBeta              WARNING: use mainnet-beta solana cluster

EXAMPLES
  $ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --keypair ../payer-and-authority-keypair.json
  $ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --name=oracle-1  --keypair 
  ../payer-and-authority-keypair.json
  $ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --keypair ../payer-keypair.json --authority 
  ../oracle-keypair.json
```

_See code: [src/commands/oracle/create.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/oracle/create.ts)_

## `sbv2 oracle:deposit ORACLEKEY AMOUNT`

deposit tokens into an oracle's token wallet

```
USAGE
  $ sbv2 oracle:deposit ORACLEKEY AMOUNT

ARGUMENTS
  ORACLEKEY  public key of the oracle to deposit funds into
  AMOUNT     amount to deposit into oracle's token wallet

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

EXAMPLE
  $ sbv2 oracle:deposit 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json
```

_See code: [src/commands/oracle/deposit.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/oracle/deposit.ts)_

## `sbv2 oracle:withdraw ORACLEKEY AMOUNT`

withdraw tokens from an oracle's token wallet

```
USAGE
  $ sbv2 oracle:withdraw ORACLEKEY AMOUNT

ARGUMENTS
  ORACLEKEY  public key of the oracle to withdraw from
  AMOUNT     amount to withdraw from oracle's token wallet

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

  --mainnetBeta                          WARNING: use mainnet-beta solana cluster

EXAMPLES
  $ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../oracle-keypair.json
  $ sbv2 oracle:withdraw 6kPsQoufdugtHLjM4fH7Z2fNv7jLt5pgvwKHt5JvRhQ6 2500 --keypair ../payer-keypair.json --authority 
  ../oracle-keypair.json -w ByJs8E29jxvqf2KFLwfyiE2gUh5fivaS7aShcRMAsnzg
```

_See code: [src/commands/oracle/withdraw.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/oracle/withdraw.ts)_

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

_See code: [src/commands/print/index.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/index.ts)_

## `sbv2 print:aggregator AGGREGATORKEY`

Print the deserialized Switchboard aggregator account

```
USAGE
  $ sbv2 print:aggregator AGGREGATORKEY

ARGUMENTS
  AGGREGATORKEY  public key of the aggregator account to deserialize

OPTIONS
  -f, --outputFile=outputFile  output aggregator schema to json file
  -h, --help                   show CLI help

  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided

  -s, --silent                 suppress cli prompts

  -u, --rpcUrl=rpcUrl          alternate RPC url

  -v, --verbose                log everything

  --force                      overwrite outputFile if existing

  --mainnetBeta                WARNING: use mainnet-beta solana cluster

ALIASES
  $ sbv2 aggregator:print

EXAMPLES
  $ sbv2 aggregator:print 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee
  $ sbv2 aggregator:print 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee -f btc-usd.json
```

_See code: [src/commands/print/aggregator.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/aggregator.ts)_

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

ALIASES
  $ sbv2 aggregator:history:print

EXAMPLE
  $ sbv2 aggregator:history:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

_See code: [src/commands/print/aggregator/history.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/aggregator/history.ts)_

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

ALIASES
  $ sbv2 aggregator:lease:print

EXAMPLE
  $ sbv2 aggregator:lease:print 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee
```

_See code: [src/commands/print/aggregator/lease.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/aggregator/lease.ts)_

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

ALIASES
  $ sbv2 aggregator:permission:print

EXAMPLE
  $ sbv2 aggregator:permission:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

_See code: [src/commands/print/aggregator/permission.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/aggregator/permission.ts)_

## `sbv2 print:crank CRANKKEY`

print deserialized switchboard crank account

```
USAGE
  $ sbv2 print:crank CRANKKEY

ARGUMENTS
  CRANKKEY  public key of the crank account to deserialize

OPTIONS
  -f, --outputFile=outputFile  output aggregator schema to json file
  -h, --help                   show CLI help

  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided

  -s, --silent                 suppress cli prompts

  -u, --rpcUrl=rpcUrl          alternate RPC url

  -v, --verbose                log everything

  --force                      overwrite outputFile if existing

  --mainnetBeta                WARNING: use mainnet-beta solana cluster

ALIASES
  $ sbv2 crank:print

EXAMPLE
  $ sbv2 crank:print 85L2cFUvXaeGQ4HrzP8RJEVCL7WvRrXM2msvEmQ82AVr
```

_See code: [src/commands/print/crank.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/crank.ts)_

## `sbv2 print:job JOBKEY`

Print the deserialized Switchboard job account

```
USAGE
  $ sbv2 print:job JOBKEY

ARGUMENTS
  JOBKEY  public key of the job account to deserialize

OPTIONS
  -f, --outputFile=outputFile  output queue json file
  -h, --help                   show CLI help

  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided

  -s, --silent                 suppress cli prompts

  -u, --rpcUrl=rpcUrl          alternate RPC url

  -v, --verbose                log everything

  --force                      overwrite outputFile if existing

  --mainnetBeta                WARNING: use mainnet-beta solana cluster

ALIASES
  $ sbv2 job:print

EXAMPLE
  $ sbv2 job:print SzTvFZLz3hwjZFMwVWzuEnr1oUF6qyvXwXCvsqf7qeA
```

_See code: [src/commands/print/job.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/job.ts)_

## `sbv2 print:job:templates`

list available templates to build a job from

```
USAGE
  $ sbv2 print:job:templates

ALIASES
  $ sbv2 job:print:templates
```

_See code: [src/commands/print/job/templates.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/job/templates.ts)_

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

ALIASES
  $ sbv2 json:samples
  $ sbv2 write:json:samples

EXAMPLES
  $ sbv2 print:json:samples ~/switchboard_json_samples
  $ sbv2 json:samples ~/switchboard_json_samples
  $ sbv2 write:json:samples ~/switchboard_json_samples
```

_See code: [src/commands/print/json/samples.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/json/samples.ts)_

## `sbv2 print:mint`

print switchboard token mint address

```
USAGE
  $ sbv2 print:mint

OPTIONS
  -h, --help             show CLI help

  -k, --keypair=keypair  keypair that will pay for onchain transactions. defaults to new account authority if no
                         alternate authority provided

  -s, --silent           suppress cli prompts

  -u, --rpcUrl=rpcUrl    alternate RPC url

  -v, --verbose          log everything

  --mainnetBeta          WARNING: use mainnet-beta solana cluster

ALIASES
  $ sbv2 mint:print

EXAMPLE
  $ sbv2 print:mint
```

_See code: [src/commands/print/mint.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/mint.ts)_

## `sbv2 print:oracle ORACLEKEY`

Print the deserialized Switchboard oracle account

```
USAGE
  $ sbv2 print:oracle ORACLEKEY

ARGUMENTS
  ORACLEKEY  public key of the oracle account to deserialize

OPTIONS
  -f, --outputFile=outputFile  output aggregator schema to json file
  -h, --help                   show CLI help

  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided

  -s, --silent                 suppress cli prompts

  -u, --rpcUrl=rpcUrl          alternate RPC url

  -v, --verbose                log everything

  --force                      overwrite outputFile if existing

  --mainnetBeta                WARNING: use mainnet-beta solana cluster

ALIASES
  $ sbv2 oracle:print

EXAMPLE
  $ sbv2 oracle:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

_See code: [src/commands/print/oracle.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/oracle.ts)_

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

ALIASES
  $ sbv2 oracle:permission:print

EXAMPLE
  $ sbv2 oracle:permission:print 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4
```

_See code: [src/commands/print/oracle/permission.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/oracle/permission.ts)_

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

ALIASES
  $ sbv2 program:print

EXAMPLE
  $ sbv2 program:print
```

_See code: [src/commands/print/program.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/program.ts)_

## `sbv2 print:queue QUEUEKEY`

Print the deserialized Switchboard oraclequeue account

```
USAGE
  $ sbv2 print:queue QUEUEKEY

ARGUMENTS
  QUEUEKEY  public key of the oracle queue account to deserialize

OPTIONS
  -f, --outputFile=outputFile  output queue json file
  -h, --help                   show CLI help

  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided

  -s, --silent                 suppress cli prompts

  -u, --rpcUrl=rpcUrl          alternate RPC url

  -v, --verbose                log everything

  --force                      overwrite outputFile if existing

  --mainnetBeta                WARNING: use mainnet-beta solana cluster

ALIASES
  $ sbv2 queue:print

EXAMPLE
  $ sbv2 queue:print GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U
```

_See code: [src/commands/print/queue.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/print/queue.ts)_

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

EXAMPLE
  $ sbv2 queue:add:crank 5aYuxRdcB9GpWrEXVMBQp2R5uf94uoBiFdMEBwcmHuU4 -k ../authority-keypair.json -n crank-1
```

_See code: [src/commands/queue/add/crank.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/queue/add/crank.ts)_

## `sbv2 queue:create`

create an oracle queue

```
USAGE
  $ sbv2 queue:create

OPTIONS
  -a, --authority=authority    keypair to delegate authority to for creating permissions targeted at the queue
  -c, --numCranks=numCranks    number of cranks to add to the queue
  -f, --outputFile=outputFile  output queue schema to a json file
  -h, --help                   show CLI help

  -k, --keypair=keypair        keypair that will pay for onchain transactions. defaults to new account authority if no
                               alternate authority provided

  -n, --name=name              name of the queue for easier identification

  -o, --numOracles=numOracles  number of oracles to add to the queue

  -r, --reward=reward          oracle rewards for successfully responding to an update request

  -s, --silent                 suppress cli prompts

  -u, --rpcUrl=rpcUrl          alternate RPC url

  -v, --verbose                log everything

  --force                      overwrite output file if existing

  --mainnetBeta                WARNING: use mainnet-beta solana cluster

  --minStake=minStake          minimum stake required by an oracle to join the queue

EXAMPLES
  $ sbv2 queue:create --keypair ../authority-keypair.json --name queue-1
  $ sbv2 queue:create --keypair ../payer-keypair.json --name queue-1 --authority ../authority-keypair.json
  $ sbv2 queue:create --keypair ../authority-keypair.json --name queue-1 --numCranks 1 --numOracles 1 --outputFile 
  new-queue.json
```

_See code: [src/commands/queue/create.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/queue/create.ts)_

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

EXAMPLE
  $ sbv2 queue:permit:aggregator 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4 --keypair ../queue-authority.json
```

_See code: [src/commands/queue/permit/aggregator.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/queue/permit/aggregator.ts)_

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

EXAMPLE
  $ sbv2 queue:permit:oracle 9CmLriMhykZ8xAoNTSHjHbk6SkuMhie1NCZn9P6LCuZ4 --keypair ../queue-authority.json
```

_See code: [src/commands/queue/permit/oracle.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/queue/permit/oracle.ts)_

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
```

_See code: [src/commands/sandbox.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.5/src/commands/sandbox.ts)_

## `sbv2 update [CHANNEL]`

update the sbv2 CLI

```
USAGE
  $ sbv2 update [CHANNEL]

OPTIONS
  --from-local  interactively choose an already installed version
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.5.0/src/commands/update.ts)_
<!-- commandsstop -->
