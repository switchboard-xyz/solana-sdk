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
* [`sbv2 help [COMMAND]`](#sbv2-help-command)
* [`sbv2 print:job:templates`](#sbv2-printjobtemplates)
* [`sbv2 update [CHANNEL]`](#sbv2-update-channel)

## `sbv2 help [COMMAND]`

Display help for sbv2.

```
USAGE
  $ sbv2 help [COMMAND]

ARGUMENTS
  COMMAND  Command to show help for.

OPTIONS
  -n, --nested-commands  Include all nested commands in the output.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `sbv2 print:job:templates`

list available templates to build a job from

```
USAGE
  $ sbv2 print:job:templates

ALIASES
  $ sbv2 job:print:templates
```

_See code: [src/commands/print/job/templates.ts](https://github.com/switchboard-xyz/switchboard-v2/blob/v0.1.28/src/commands/print/job/templates.ts)_

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
