<div align="center">

![Switchboard Logo](https://github.com/switchboard-xyz/sbv2-core/raw/main/website/static/img/icons/switchboard/avatar.png)

## Usage

Deploy function:

```bash
sb solana function create "CkvizjVnm2zA5Wuwan34NhVT3zFc7vqUyGnA6tuEF5aE" --container ${CONTAINER_NAME} --cluster devnet --schedule "15 * * * * *" --containerRegistry dockerhub --keypair /Users/mgild/switchboard_environments_v2/devnet/upgrade_authority/upgrade_authority.json --mrEnclave 0x63ba8df478b4a74795a79a73b8f0a6f792f88e95f9ed6202289091e6e1b65fa1 --fundAmount 0.25

sb solana function create "2ie3JZfKcvsRLsJaP5fSo43gUo1vsurnUAtAgUdUAiDG" --container ${CONTAINER_NAME} --schedule "30 * * * * *" --containerRegistry dockerhub --keypair /Users/mgild/switchboard_environments_v2/mainnet/upgrade_authority/upgrade_authority.json --mainnetBeta --mrEnclave 0x63ba8df478b4a74795a79a73b8f0a6f792f88e95f9ed6202289091e6e1b65fa1 --fundAmount 0.25
```