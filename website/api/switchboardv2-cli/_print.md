
find and print a switchboard account by public key for a given cluster

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

_See code: [src/commands/print/index.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/index.ts)_

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

_See code: [src/commands/print/aggregator.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/aggregator.ts)_

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

_See code: [src/commands/print/aggregator/history.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/aggregator/history.ts)_

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

_See code: [src/commands/print/aggregator/lease.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/aggregator/lease.ts)_

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

_See code: [src/commands/print/aggregator/permission.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/aggregator/permission.ts)_

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

_See code: [src/commands/print/crank.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/crank.ts)_

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

_See code: [src/commands/print/job.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/job.ts)_

## `sbv2 print:job:templates`

list available templates to build a job from

```
USAGE
  $ sbv2 print:job:templates

ALIASES
  $ sbv2 job:print:templates
```

_See code: [src/commands/print/job/templates.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/job/templates.ts)_

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

_See code: [src/commands/print/json/samples.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/json/samples.ts)_

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

_See code: [src/commands/print/mint.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/mint.ts)_

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

_See code: [src/commands/print/oracle.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/oracle.ts)_

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

_See code: [src/commands/print/oracle/permission.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/oracle/permission.ts)_

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

_See code: [src/commands/print/program.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/program.ts)_

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

_See code: [src/commands/print/queue.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.8/src/commands/print/queue.ts)_
