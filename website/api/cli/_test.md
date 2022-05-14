
sandbox

* [`sbv2 test ORACLEKEY`](#sbv2-test-oraclekey)

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

_See code: [src/commands/test.ts](https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/test.ts)_
