
create a Switchboard VRF Account

* [`sbv2 vrf create [QUEUEKEY]`](#sbv2-vrf-create-queuekey)
* [`sbv2 vrf create example [QUEUEKEY]`](#sbv2-vrf-create-example-queuekey)
* [`sbv2 vrf print [VRFKEY]`](#sbv2-vrf-print-vrfkey)
* [`sbv2 vrf request [VRFKEY]`](#sbv2-vrf-request-vrfkey)
* [`sbv2 vrf verify [VRFKEY]`](#sbv2-vrf-verify-vrfkey)
* [`sbv2 vrf watch [VRFKEY]`](#sbv2-vrf-watch-vrfkey)

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
