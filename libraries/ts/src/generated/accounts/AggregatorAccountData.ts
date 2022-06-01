import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { Connection, PublicKey } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars

export interface AggregatorAccountDataFields {
  name: Array<number>
  metadata: Array<number>
  authorWallet: PublicKey
  queuePubkey: PublicKey
  oracleRequestBatchSize: number
  minOracleResults: number
  minJobResults: number
  minUpdateDelaySeconds: number
  startAfter: BN
  varianceThreshold: types.SwitchboardDecimalFields
  forceReportPeriod: BN
  expiration: BN
  consecutiveFailureCount: BN
  nextAllowedUpdateTime: BN
  isLocked: boolean
  crankPubkey: PublicKey
  latestConfirmedRound: types.AggregatorRoundFields
  currentRound: types.AggregatorRoundFields
  jobPubkeysData: Array<PublicKey>
  jobHashes: Array<types.HashFields>
  jobPubkeysSize: number
  jobsChecksum: Array<number>
  authority: PublicKey
  historyBuffer: PublicKey
  previousConfirmedRoundResult: types.SwitchboardDecimalFields
  previousConfirmedRoundSlot: BN
  disableCrank: boolean
  ebuf: Array<number>
}

export interface AggregatorAccountDataJSON {
  name: Array<number>
  metadata: Array<number>
  authorWallet: string
  queuePubkey: string
  oracleRequestBatchSize: number
  minOracleResults: number
  minJobResults: number
  minUpdateDelaySeconds: number
  startAfter: string
  varianceThreshold: types.SwitchboardDecimalJSON
  forceReportPeriod: string
  expiration: string
  consecutiveFailureCount: string
  nextAllowedUpdateTime: string
  isLocked: boolean
  crankPubkey: string
  latestConfirmedRound: types.AggregatorRoundJSON
  currentRound: types.AggregatorRoundJSON
  jobPubkeysData: Array<string>
  jobHashes: Array<types.HashJSON>
  jobPubkeysSize: number
  jobsChecksum: Array<number>
  authority: string
  historyBuffer: string
  previousConfirmedRoundResult: types.SwitchboardDecimalJSON
  previousConfirmedRoundSlot: string
  disableCrank: boolean
  ebuf: Array<number>
}

export class AggregatorAccountData {
  readonly name: Array<number>
  readonly metadata: Array<number>
  readonly authorWallet: PublicKey
  readonly queuePubkey: PublicKey
  readonly oracleRequestBatchSize: number
  readonly minOracleResults: number
  readonly minJobResults: number
  readonly minUpdateDelaySeconds: number
  readonly startAfter: BN
  readonly varianceThreshold: types.SwitchboardDecimal
  readonly forceReportPeriod: BN
  readonly expiration: BN
  readonly consecutiveFailureCount: BN
  readonly nextAllowedUpdateTime: BN
  readonly isLocked: boolean
  readonly crankPubkey: PublicKey
  readonly latestConfirmedRound: types.AggregatorRound
  readonly currentRound: types.AggregatorRound
  readonly jobPubkeysData: Array<PublicKey>
  readonly jobHashes: Array<types.Hash>
  readonly jobPubkeysSize: number
  readonly jobsChecksum: Array<number>
  readonly authority: PublicKey
  readonly historyBuffer: PublicKey
  readonly previousConfirmedRoundResult: types.SwitchboardDecimal
  readonly previousConfirmedRoundSlot: BN
  readonly disableCrank: boolean
  readonly ebuf: Array<number>

  static readonly discriminator = Buffer.from([
    217, 230, 65, 101, 201, 162, 27, 125,
  ])

  static readonly layout = borsh.struct([
    borsh.array(borsh.u8(), 32, "name"),
    borsh.array(borsh.u8(), 128, "metadata"),
    borsh.publicKey("authorWallet"),
    borsh.publicKey("queuePubkey"),
    borsh.u32("oracleRequestBatchSize"),
    borsh.u32("minOracleResults"),
    borsh.u32("minJobResults"),
    borsh.u32("minUpdateDelaySeconds"),
    borsh.i64("startAfter"),
    types.SwitchboardDecimal.layout("varianceThreshold"),
    borsh.i64("forceReportPeriod"),
    borsh.i64("expiration"),
    borsh.u64("consecutiveFailureCount"),
    borsh.i64("nextAllowedUpdateTime"),
    borsh.bool("isLocked"),
    borsh.publicKey("crankPubkey"),
    types.AggregatorRound.layout("latestConfirmedRound"),
    types.AggregatorRound.layout("currentRound"),
    borsh.array(borsh.publicKey(), 16, "jobPubkeysData"),
    borsh.array(types.Hash.layout(), 16, "jobHashes"),
    borsh.u32("jobPubkeysSize"),
    borsh.array(borsh.u8(), 32, "jobsChecksum"),
    borsh.publicKey("authority"),
    borsh.publicKey("historyBuffer"),
    types.SwitchboardDecimal.layout("previousConfirmedRoundResult"),
    borsh.u64("previousConfirmedRoundSlot"),
    borsh.bool("disableCrank"),
    borsh.array(borsh.u8(), 163, "ebuf"),
  ])

  constructor(fields: AggregatorAccountDataFields) {
    this.name = fields.name
    this.metadata = fields.metadata
    this.authorWallet = fields.authorWallet
    this.queuePubkey = fields.queuePubkey
    this.oracleRequestBatchSize = fields.oracleRequestBatchSize
    this.minOracleResults = fields.minOracleResults
    this.minJobResults = fields.minJobResults
    this.minUpdateDelaySeconds = fields.minUpdateDelaySeconds
    this.startAfter = fields.startAfter
    this.varianceThreshold = new types.SwitchboardDecimal({
      ...fields.varianceThreshold,
    })
    this.forceReportPeriod = fields.forceReportPeriod
    this.expiration = fields.expiration
    this.consecutiveFailureCount = fields.consecutiveFailureCount
    this.nextAllowedUpdateTime = fields.nextAllowedUpdateTime
    this.isLocked = fields.isLocked
    this.crankPubkey = fields.crankPubkey
    this.latestConfirmedRound = new types.AggregatorRound({
      ...fields.latestConfirmedRound,
    })
    this.currentRound = new types.AggregatorRound({ ...fields.currentRound })
    this.jobPubkeysData = fields.jobPubkeysData
    this.jobHashes = fields.jobHashes.map((item) => new types.Hash({ ...item }))
    this.jobPubkeysSize = fields.jobPubkeysSize
    this.jobsChecksum = fields.jobsChecksum
    this.authority = fields.authority
    this.historyBuffer = fields.historyBuffer
    this.previousConfirmedRoundResult = new types.SwitchboardDecimal({
      ...fields.previousConfirmedRoundResult,
    })
    this.previousConfirmedRoundSlot = fields.previousConfirmedRoundSlot
    this.disableCrank = fields.disableCrank
    this.ebuf = fields.ebuf
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<AggregatorAccountData | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<AggregatorAccountData | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): AggregatorAccountData {
    if (!data.slice(0, 8).equals(AggregatorAccountData.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = AggregatorAccountData.layout.decode(data.slice(8))

    return new AggregatorAccountData({
      name: dec.name,
      metadata: dec.metadata,
      authorWallet: dec.authorWallet,
      queuePubkey: dec.queuePubkey,
      oracleRequestBatchSize: dec.oracleRequestBatchSize,
      minOracleResults: dec.minOracleResults,
      minJobResults: dec.minJobResults,
      minUpdateDelaySeconds: dec.minUpdateDelaySeconds,
      startAfter: dec.startAfter,
      varianceThreshold: types.SwitchboardDecimal.fromDecoded(
        dec.varianceThreshold
      ),
      forceReportPeriod: dec.forceReportPeriod,
      expiration: dec.expiration,
      consecutiveFailureCount: dec.consecutiveFailureCount,
      nextAllowedUpdateTime: dec.nextAllowedUpdateTime,
      isLocked: dec.isLocked,
      crankPubkey: dec.crankPubkey,
      latestConfirmedRound: types.AggregatorRound.fromDecoded(
        dec.latestConfirmedRound
      ),
      currentRound: types.AggregatorRound.fromDecoded(dec.currentRound),
      jobPubkeysData: dec.jobPubkeysData,
      jobHashes: dec.jobHashes.map((item) => types.Hash.fromDecoded(item)),
      jobPubkeysSize: dec.jobPubkeysSize,
      jobsChecksum: dec.jobsChecksum,
      authority: dec.authority,
      historyBuffer: dec.historyBuffer,
      previousConfirmedRoundResult: types.SwitchboardDecimal.fromDecoded(
        dec.previousConfirmedRoundResult
      ),
      previousConfirmedRoundSlot: dec.previousConfirmedRoundSlot,
      disableCrank: dec.disableCrank,
      ebuf: dec.ebuf,
    })
  }

  toJSON(): AggregatorAccountDataJSON {
    return {
      name: this.name,
      metadata: this.metadata,
      authorWallet: this.authorWallet.toString(),
      queuePubkey: this.queuePubkey.toString(),
      oracleRequestBatchSize: this.oracleRequestBatchSize,
      minOracleResults: this.minOracleResults,
      minJobResults: this.minJobResults,
      minUpdateDelaySeconds: this.minUpdateDelaySeconds,
      startAfter: this.startAfter.toString(),
      varianceThreshold: this.varianceThreshold.toJSON(),
      forceReportPeriod: this.forceReportPeriod.toString(),
      expiration: this.expiration.toString(),
      consecutiveFailureCount: this.consecutiveFailureCount.toString(),
      nextAllowedUpdateTime: this.nextAllowedUpdateTime.toString(),
      isLocked: this.isLocked,
      crankPubkey: this.crankPubkey.toString(),
      latestConfirmedRound: this.latestConfirmedRound.toJSON(),
      currentRound: this.currentRound.toJSON(),
      jobPubkeysData: this.jobPubkeysData.map((item) => item.toString()),
      jobHashes: this.jobHashes.map((item) => item.toJSON()),
      jobPubkeysSize: this.jobPubkeysSize,
      jobsChecksum: this.jobsChecksum,
      authority: this.authority.toString(),
      historyBuffer: this.historyBuffer.toString(),
      previousConfirmedRoundResult: this.previousConfirmedRoundResult.toJSON(),
      previousConfirmedRoundSlot: this.previousConfirmedRoundSlot.toString(),
      disableCrank: this.disableCrank,
      ebuf: this.ebuf,
    }
  }

  static fromJSON(obj: AggregatorAccountDataJSON): AggregatorAccountData {
    return new AggregatorAccountData({
      name: obj.name,
      metadata: obj.metadata,
      authorWallet: new PublicKey(obj.authorWallet),
      queuePubkey: new PublicKey(obj.queuePubkey),
      oracleRequestBatchSize: obj.oracleRequestBatchSize,
      minOracleResults: obj.minOracleResults,
      minJobResults: obj.minJobResults,
      minUpdateDelaySeconds: obj.minUpdateDelaySeconds,
      startAfter: new BN(obj.startAfter),
      varianceThreshold: types.SwitchboardDecimal.fromJSON(
        obj.varianceThreshold
      ),
      forceReportPeriod: new BN(obj.forceReportPeriod),
      expiration: new BN(obj.expiration),
      consecutiveFailureCount: new BN(obj.consecutiveFailureCount),
      nextAllowedUpdateTime: new BN(obj.nextAllowedUpdateTime),
      isLocked: obj.isLocked,
      crankPubkey: new PublicKey(obj.crankPubkey),
      latestConfirmedRound: types.AggregatorRound.fromJSON(
        obj.latestConfirmedRound
      ),
      currentRound: types.AggregatorRound.fromJSON(obj.currentRound),
      jobPubkeysData: obj.jobPubkeysData.map((item) => new PublicKey(item)),
      jobHashes: obj.jobHashes.map((item) => types.Hash.fromJSON(item)),
      jobPubkeysSize: obj.jobPubkeysSize,
      jobsChecksum: obj.jobsChecksum,
      authority: new PublicKey(obj.authority),
      historyBuffer: new PublicKey(obj.historyBuffer),
      previousConfirmedRoundResult: types.SwitchboardDecimal.fromJSON(
        obj.previousConfirmedRoundResult
      ),
      previousConfirmedRoundSlot: new BN(obj.previousConfirmedRoundSlot),
      disableCrank: obj.disableCrank,
      ebuf: obj.ebuf,
    })
  }
}
