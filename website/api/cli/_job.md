
interact with a switchboard job account

* [`sbv2 job create JOBDEFINITION`](#sbv2-job-create-jobdefinition)
* [`sbv2 job print [JOBKEY]`](#sbv2-job-print-jobkey)

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
