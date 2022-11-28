import { SwitchboardProgram } from '../../program';
import { PublicKey, Connection } from '@solana/web3.js';
import BN from 'bn.js'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@project-serum/borsh'; // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types'; // eslint-disable-line @typescript-eslint/no-unused-vars

export interface OracleQueueAccountDataFields {
  name: Array<number>;
  metadata: Array<number>;
  authority: PublicKey;
  oracleTimeout: number;
  reward: BN;
  minStake: BN;
  slashingEnabled: boolean;
  varianceToleranceMultiplier: types.SwitchboardDecimalFields;
  feedProbationPeriod: number;
  currIdx: number;
  size: number;
  gcIdx: number;
  consecutiveFeedFailureLimit: BN;
  consecutiveOracleFailureLimit: BN;
  unpermissionedFeedsEnabled: boolean;
  unpermissionedVrfEnabled: boolean;
  curatorRewardCut: types.SwitchboardDecimalFields;
  lockLeaseFunding: boolean;
  mint: PublicKey;
  enableBufferRelayers: boolean;
  ebuf: Array<number>;
  maxSize: number;
  dataBuffer: PublicKey;
}

export interface OracleQueueAccountDataJSON {
  name: Array<number>;
  metadata: Array<number>;
  authority: string;
  oracleTimeout: number;
  reward: string;
  minStake: string;
  slashingEnabled: boolean;
  varianceToleranceMultiplier: types.SwitchboardDecimalJSON;
  feedProbationPeriod: number;
  currIdx: number;
  size: number;
  gcIdx: number;
  consecutiveFeedFailureLimit: string;
  consecutiveOracleFailureLimit: string;
  unpermissionedFeedsEnabled: boolean;
  unpermissionedVrfEnabled: boolean;
  curatorRewardCut: types.SwitchboardDecimalJSON;
  lockLeaseFunding: boolean;
  mint: string;
  enableBufferRelayers: boolean;
  ebuf: Array<number>;
  maxSize: number;
  dataBuffer: string;
}

export class OracleQueueAccountData {
  readonly name: Array<number>;
  readonly metadata: Array<number>;
  readonly authority: PublicKey;
  readonly oracleTimeout: number;
  readonly reward: BN;
  readonly minStake: BN;
  readonly slashingEnabled: boolean;
  readonly varianceToleranceMultiplier: types.SwitchboardDecimal;
  readonly feedProbationPeriod: number;
  readonly currIdx: number;
  readonly size: number;
  readonly gcIdx: number;
  readonly consecutiveFeedFailureLimit: BN;
  readonly consecutiveOracleFailureLimit: BN;
  readonly unpermissionedFeedsEnabled: boolean;
  readonly unpermissionedVrfEnabled: boolean;
  readonly curatorRewardCut: types.SwitchboardDecimal;
  readonly lockLeaseFunding: boolean;
  readonly mint: PublicKey;
  readonly enableBufferRelayers: boolean;
  readonly ebuf: Array<number>;
  readonly maxSize: number;
  readonly dataBuffer: PublicKey;

  static readonly discriminator = Buffer.from([
    164, 207, 200, 51, 199, 113, 35, 109,
  ]);

  static readonly layout = borsh.struct([
    borsh.array(borsh.u8(), 32, 'name'),
    borsh.array(borsh.u8(), 64, 'metadata'),
    borsh.publicKey('authority'),
    borsh.u32('oracleTimeout'),
    borsh.u64('reward'),
    borsh.u64('minStake'),
    borsh.bool('slashingEnabled'),
    types.SwitchboardDecimal.layout('varianceToleranceMultiplier'),
    borsh.u32('feedProbationPeriod'),
    borsh.u32('currIdx'),
    borsh.u32('size'),
    borsh.u32('gcIdx'),
    borsh.u64('consecutiveFeedFailureLimit'),
    borsh.u64('consecutiveOracleFailureLimit'),
    borsh.bool('unpermissionedFeedsEnabled'),
    borsh.bool('unpermissionedVrfEnabled'),
    types.SwitchboardDecimal.layout('curatorRewardCut'),
    borsh.bool('lockLeaseFunding'),
    borsh.publicKey('mint'),
    borsh.bool('enableBufferRelayers'),
    borsh.array(borsh.u8(), 968, 'ebuf'),
    borsh.u32('maxSize'),
    borsh.publicKey('dataBuffer'),
  ]);

  constructor(fields: OracleQueueAccountDataFields) {
    this.name = fields.name;
    this.metadata = fields.metadata;
    this.authority = fields.authority;
    this.oracleTimeout = fields.oracleTimeout;
    this.reward = fields.reward;
    this.minStake = fields.minStake;
    this.slashingEnabled = fields.slashingEnabled;
    this.varianceToleranceMultiplier = new types.SwitchboardDecimal({
      ...fields.varianceToleranceMultiplier,
    });
    this.feedProbationPeriod = fields.feedProbationPeriod;
    this.currIdx = fields.currIdx;
    this.size = fields.size;
    this.gcIdx = fields.gcIdx;
    this.consecutiveFeedFailureLimit = fields.consecutiveFeedFailureLimit;
    this.consecutiveOracleFailureLimit = fields.consecutiveOracleFailureLimit;
    this.unpermissionedFeedsEnabled = fields.unpermissionedFeedsEnabled;
    this.unpermissionedVrfEnabled = fields.unpermissionedVrfEnabled;
    this.curatorRewardCut = new types.SwitchboardDecimal({
      ...fields.curatorRewardCut,
    });
    this.lockLeaseFunding = fields.lockLeaseFunding;
    this.mint = fields.mint;
    this.enableBufferRelayers = fields.enableBufferRelayers;
    this.ebuf = fields.ebuf;
    this.maxSize = fields.maxSize;
    this.dataBuffer = fields.dataBuffer;
  }

  static async fetch(
    program: SwitchboardProgram,
    address: PublicKey
  ): Promise<OracleQueueAccountData | null> {
    const info = await program.connection.getAccountInfo(address);

    if (info === null) {
      return null;
    }
    if (!info.owner.equals(program.programId)) {
      throw new Error("account doesn't belong to this program");
    }

    return this.decode(info.data);
  }

  static async fetchMultiple(
    program: SwitchboardProgram,
    addresses: PublicKey[]
  ): Promise<Array<OracleQueueAccountData | null>> {
    const infos = await program.connection.getMultipleAccountsInfo(addresses);

    return infos.map(info => {
      if (info === null) {
        return null;
      }
      if (!info.owner.equals(program.programId)) {
        throw new Error("account doesn't belong to this program");
      }

      return this.decode(info.data);
    });
  }

  static decode(data: Buffer): OracleQueueAccountData {
    if (!data.slice(0, 8).equals(OracleQueueAccountData.discriminator)) {
      throw new Error('invalid account discriminator');
    }

    const dec = OracleQueueAccountData.layout.decode(data.slice(8));

    return new OracleQueueAccountData({
      name: dec.name,
      metadata: dec.metadata,
      authority: dec.authority,
      oracleTimeout: dec.oracleTimeout,
      reward: dec.reward,
      minStake: dec.minStake,
      slashingEnabled: dec.slashingEnabled,
      varianceToleranceMultiplier: types.SwitchboardDecimal.fromDecoded(
        dec.varianceToleranceMultiplier
      ),
      feedProbationPeriod: dec.feedProbationPeriod,
      currIdx: dec.currIdx,
      size: dec.size,
      gcIdx: dec.gcIdx,
      consecutiveFeedFailureLimit: dec.consecutiveFeedFailureLimit,
      consecutiveOracleFailureLimit: dec.consecutiveOracleFailureLimit,
      unpermissionedFeedsEnabled: dec.unpermissionedFeedsEnabled,
      unpermissionedVrfEnabled: dec.unpermissionedVrfEnabled,
      curatorRewardCut: types.SwitchboardDecimal.fromDecoded(
        dec.curatorRewardCut
      ),
      lockLeaseFunding: dec.lockLeaseFunding,
      mint: dec.mint,
      enableBufferRelayers: dec.enableBufferRelayers,
      ebuf: dec.ebuf,
      maxSize: dec.maxSize,
      dataBuffer: dec.dataBuffer,
    });
  }

  toJSON(): OracleQueueAccountDataJSON {
    return {
      name: this.name,
      metadata: this.metadata,
      authority: this.authority.toString(),
      oracleTimeout: this.oracleTimeout,
      reward: this.reward.toString(),
      minStake: this.minStake.toString(),
      slashingEnabled: this.slashingEnabled,
      varianceToleranceMultiplier: this.varianceToleranceMultiplier.toJSON(),
      feedProbationPeriod: this.feedProbationPeriod,
      currIdx: this.currIdx,
      size: this.size,
      gcIdx: this.gcIdx,
      consecutiveFeedFailureLimit: this.consecutiveFeedFailureLimit.toString(),
      consecutiveOracleFailureLimit:
        this.consecutiveOracleFailureLimit.toString(),
      unpermissionedFeedsEnabled: this.unpermissionedFeedsEnabled,
      unpermissionedVrfEnabled: this.unpermissionedVrfEnabled,
      curatorRewardCut: this.curatorRewardCut.toJSON(),
      lockLeaseFunding: this.lockLeaseFunding,
      mint: this.mint.toString(),
      enableBufferRelayers: this.enableBufferRelayers,
      ebuf: this.ebuf,
      maxSize: this.maxSize,
      dataBuffer: this.dataBuffer.toString(),
    };
  }

  static fromJSON(obj: OracleQueueAccountDataJSON): OracleQueueAccountData {
    return new OracleQueueAccountData({
      name: obj.name,
      metadata: obj.metadata,
      authority: new PublicKey(obj.authority),
      oracleTimeout: obj.oracleTimeout,
      reward: new BN(obj.reward),
      minStake: new BN(obj.minStake),
      slashingEnabled: obj.slashingEnabled,
      varianceToleranceMultiplier: types.SwitchboardDecimal.fromJSON(
        obj.varianceToleranceMultiplier
      ),
      feedProbationPeriod: obj.feedProbationPeriod,
      currIdx: obj.currIdx,
      size: obj.size,
      gcIdx: obj.gcIdx,
      consecutiveFeedFailureLimit: new BN(obj.consecutiveFeedFailureLimit),
      consecutiveOracleFailureLimit: new BN(obj.consecutiveOracleFailureLimit),
      unpermissionedFeedsEnabled: obj.unpermissionedFeedsEnabled,
      unpermissionedVrfEnabled: obj.unpermissionedVrfEnabled,
      curatorRewardCut: types.SwitchboardDecimal.fromJSON(obj.curatorRewardCut),
      lockLeaseFunding: obj.lockLeaseFunding,
      mint: new PublicKey(obj.mint),
      enableBufferRelayers: obj.enableBufferRelayers,
      ebuf: obj.ebuf,
      maxSize: obj.maxSize,
      dataBuffer: new PublicKey(obj.dataBuffer),
    });
  }
}
