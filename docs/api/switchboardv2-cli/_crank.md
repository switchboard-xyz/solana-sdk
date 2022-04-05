
interact with a switchboard crank account

* [`sbv2 crank:turn CRANKKEY`](#sbv2-crankturn-crankkey)

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

_See code: [src/commands/crank/turn.ts](https://github.com/switchboard-xyz/switchboardv2-cli/blob/v0.1.4/src/commands/crank/turn.ts)_
