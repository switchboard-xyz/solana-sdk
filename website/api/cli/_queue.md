
interact with a switchboard oracle queue account

* [`sbv2 queue create`](#sbv2-queue-create)
* [`sbv2 queue print [QUEUEKEY]`](#sbv2-queue-print-queuekey)
* [`sbv2 queue set rewards [QUEUEKEY] [REWARDS]`](#sbv2-queue-set-rewards-queuekey-rewards)
* [`sbv2 queue set vrf [QUEUEKEY]`](#sbv2-queue-set-vrf-queuekey)

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
