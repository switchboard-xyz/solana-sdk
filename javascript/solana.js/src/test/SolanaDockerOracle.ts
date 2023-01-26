import { DockerOracle, IOracleConfig } from '@switchboard-xyz/common';
import path from 'path';

export type SolanaOracleConfig = Omit<IOracleConfig, 'chain'>;

export class SolanaDockerOracle extends DockerOracle {
  constructor(
    readonly nodeImage: string,
    config: SolanaOracleConfig,
    readonly switchboardDirectory = path.join(process.cwd(), '.switchboard'),
    readonly silent = false
  ) {
    super(
      nodeImage,
      {
        ...config,
        chain: 'solana',
      },
      switchboardDirectory,
      silent
    );
  }
}
