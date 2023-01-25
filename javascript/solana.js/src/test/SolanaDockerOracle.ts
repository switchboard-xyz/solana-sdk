import {
  DockerOracle,
  IOracleBaseConfig,
  ISolanaOracleConfig,
} from '@switchboard-xyz/common';
import path from 'path';

export type SolanaOracleConfig = Omit<IOracleBaseConfig, 'chain'> &
  ISolanaOracleConfig;

export class SolanaDockerOracle extends DockerOracle {
  constructor(
    config: SolanaOracleConfig,
    readonly nodeImage: string,
    readonly switchboardDirectory = path.join(process.cwd(), '.switchboard'),
    readonly silent = false
  ) {
    super(
      {
        ...config,
        chain: 'solana',
        envVariables: {
          DISABLE_NONCE_QUEUE: 'true',
        },
      },
      nodeImage,
      switchboardDirectory,
      silent
    );
  }
}
