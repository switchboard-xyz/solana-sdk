
create a Switchboard VRF Account

* [`sbv2 vrf:create QUEUEKEY`](#sbv2-vrfcreate-queuekey)
* [`sbv2 vrf:create:example QUEUEKEY`](#sbv2-vrfcreateexample-queuekey)
* [`sbv2 vrf:request VRFKEY`](#sbv2-vrfrequest-vrfkey)

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

_See code: [src/commands/vrf/create/index.ts](https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/vrf/create/index.ts)_

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

_See code: [src/commands/vrf/create/example.ts](https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/vrf/create/example.ts)_

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

_See code: [src/commands/vrf/request.ts](https://github.com/switchboard-xyz/switchboard-v2/tree/main/cli/src/commands/vrf/request.ts)_
