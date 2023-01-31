import { SwitchboardProgram } from '../../SwitchboardProgram';
import { PublicKey } from '@solana/web3.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { BN } from '@switchboard-xyz/common'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh';

export interface AggregatorAddJobParamsFields {
  weight: number | null;
}

export interface AggregatorAddJobParamsJSON {
  weight: number | null;
}

export class AggregatorAddJobParams {
  readonly weight: number | null;

  constructor(fields: AggregatorAddJobParamsFields) {
    this.weight = fields.weight;
  }

  static layout(property?: string) {
    return borsh.struct([borsh.option(borsh.u8(), 'weight')], property);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new AggregatorAddJobParams({
      weight: obj.weight,
    });
  }

  static toEncodable(fields: AggregatorAddJobParamsFields) {
    return {
      weight: fields.weight,
    };
  }

  toJSON(): AggregatorAddJobParamsJSON {
    return {
      weight: this.weight,
    };
  }

  static fromJSON(obj: AggregatorAddJobParamsJSON): AggregatorAddJobParams {
    return new AggregatorAddJobParams({
      weight: obj.weight,
    });
  }

  toEncodable() {
    return AggregatorAddJobParams.toEncodable(this);
  }
}
