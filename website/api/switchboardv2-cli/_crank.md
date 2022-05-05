
interact with a switchboard crank account

* [`sbv2 crank:list CRANKKEY`](#sbv2-cranklist-crankkey)
* [`sbv2 crank:push CRANKKEY AGGREGATORKEY`](#sbv2-crankpush-crankkey-aggregatorkey)
* [`sbv2 crank:turn CRANKKEY`](#sbv2-crankturn-crankkey)

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
```

_See code: [src/commands/crank/list.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.14/src/commands/crank/list.ts)_

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

ALIASES
  $ sbv2 aggregator:add:crank
  $ sbv2 crank:add:aggregator
```

_See code: [src/commands/crank/push.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.14/src/commands/crank/push.ts)_

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

_See code: [src/commands/crank/turn.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.14/src/commands/crank/turn.ts)_
