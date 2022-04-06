/* eslint-disable max-depth */
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  OracleQueueAccount,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import * as chalk from "chalk";
import { fromPublicKey, fromQueueJSON } from "..";
import { CommandContext } from "../../types/context";
import { LogProvider } from "../../types/context/logging";
import { AggregatorClass, AggregatorDefinition } from "../aggregator";
import { CrankClass, CrankDefinition, CrankDefinitions } from "../crank";
import { OracleClass, OracleDefinition, OracleDefinitions } from "../oracle";
import {
  buffer2string,
  chalkString,
  getArrayOfSizeN,
  pubKeyConverter,
} from "../utils";
import {
  IOracleQueueClass,
  OracleQueueAccountData,
  QueueDefinition,
} from "./types";

export class OracleQueueClass implements IOracleQueueClass {
  account: OracleQueueAccount;
  logger: LogProvider;

  publicKey: PublicKey;
  authorityPublicKey: PublicKey;
  consecutiveFeedFailureLimit: anchor.BN;
  consecutiveOracleFailureLimit: anchor.BN;
  feedProbationPeriod: number;
  metadata: string;
  minStake: anchor.BN;
  minUpdateDelaySeconds: number;
  name: string;
  oracleTimeout: anchor.BN;
  queueSize: number;
  reward: anchor.BN;
  slashingEnabled: boolean;
  unpermissionedFeedsEnabled: boolean;
  unpermissionedVrfEnabled: boolean;
  varianceToleranceMultiplier: SwitchboardDecimal;

  oracleBuffer: PublicKey;
  cranks: CrankClass[] = [];
  oracles: OracleClass[] = [];
  aggregators: AggregatorClass[] = [];

  private constructor() {}

  private static async init(
    context: CommandContext,
    account: OracleQueueAccount,
    definition: QueueDefinition
  ) {
    const queue = new OracleQueueClass();
    queue.logger = context.logger;

    queue.account = account;
    queue.publicKey = queue.account.publicKey;

    await queue.loadData();

    if (definition && "oracles" in definition) {
      queue.oracles = await OracleQueueClass.buildOracles(
        context,
        queue.account,
        definition.oracles
      );
    }

    if (definition && "cranks" in definition) {
      queue.cranks = await OracleQueueClass.buildCranks(
        context,
        queue.account,
        definition.cranks
      );
    }

    if (definition && "aggregators" in definition) {
      queue.logger.debug(
        `creating ${definition.aggregators.length} aggregators from json definition`
      );
      for await (const aggregatorDefinition of definition.aggregators) {
        const aggregator = await AggregatorClass.build(
          context,
          queue.account.program,
          aggregatorDefinition,
          queue.account
        );

        await aggregator.grantPermission(context);
        queue.aggregators.push(aggregator);

        if (
          "crank" in aggregatorDefinition &&
          queue.cranks &&
          queue.cranks.length > 0
        ) {
          const key = aggregatorDefinition.crank;
          const crank = await OracleQueueClass.findCrankByKey(
            context,
            queue.cranks,
            key
          );
          if (typeof key === "object" && !("publicKey" in key)) {
            crank.account.push({
              aggregatorAccount: aggregator.account,
            });
            context.logger.debug(
              `added aggregator ${aggregator.name} to crank ${key} ${crank.publicKey}`
            );
          }

          aggregator.crankPublicKey = crank.publicKey;
        }
      }
    }

    return queue;
  }

  static async build(
    context: CommandContext,
    program: anchor.Program,
    definition: QueueDefinition
  ): Promise<OracleQueueClass> {
    if ("account" in definition) {
      if (definition.account instanceof OracleQueueAccount) {
        return OracleQueueClass.fromAccount(context, definition.account);
      }
      const errorMessage = `found account key in definition file but account is not an instanceof OracleQueueAccount`;
      context.logger.error(errorMessage);
      throw new Error(errorMessage);
    } else if ("publicKey" in definition) {
      return OracleQueueClass.fromPublicKey(context, program, definition);
    } else if ("name" in definition) {
      return OracleQueueClass.fromJSON(context, program, definition);
    }
    throw new Error("failed to build QueueClass");
  }

  public static fromAccount(
    context: CommandContext,
    account: OracleQueueAccount
  ) {
    return OracleQueueClass.init(context, account, { name: "queue" });
  }

  public static fromPublicKey(
    context: CommandContext,
    program: anchor.Program,
    definition: fromPublicKey
  ) {
    return OracleQueueClass.init(
      context,
      new OracleQueueAccount({
        program,
        publicKey: definition.publicKey,
      }),
      definition
    );
  }

  public static async fromJSON(
    context: CommandContext,
    program: anchor.Program,
    definition: fromQueueJSON
  ) {
    const queueAccount = await OracleQueueAccount.create(program, {
      authority:
        definition.authorityPublicKey ?? program.provider.wallet.publicKey,
      name: definition.name ? Buffer.from(definition.name) : undefined,
      metadata: definition.metadata
        ? Buffer.from(definition.metadata)
        : undefined,
      reward: definition.reward
        ? new anchor.BN(definition.reward)
        : new anchor.BN(0),
      minStake: definition.minStake
        ? new anchor.BN(definition.minStake)
        : new anchor.BN(0),
      minimumDelaySeconds: definition.minUpdateDelaySeconds,
      oracleTimeout: definition.oracleTimeout
        ? new anchor.BN(definition.oracleTimeout)
        : undefined,
      slashingEnabled: definition.slashingEnabled,
      unpermissionedFeeds: definition.unpermissionedFeedsEnabled,
      feedProbationPeriod: definition.feedProbationPeriod,
      consecutiveFeedFailureLimit: definition.consecutiveFeedFailureLimit
        ? new anchor.BN(definition.consecutiveFeedFailureLimit)
        : undefined,
      consecutiveOracleFailureLimit: definition.consecutiveOracleFailureLimit
        ? new anchor.BN(definition.consecutiveOracleFailureLimit)
        : undefined,
      varianceToleranceMultiplier: definition.varianceToleranceMultiplier,
    });

    context.logger.info(`created queue ${queueAccount.publicKey}`);

    return OracleQueueClass.init(context, queueAccount, definition);
  }

  async addCrank(
    context: CommandContext,
    crankDefinition: CrankDefinition
  ): Promise<number> {
    const crank = await CrankClass.fromJSON(
      context,
      {
        ...crankDefinition,
        queuePublicKey: this.publicKey,
      },
      this.account
    );
    this.cranks.push(crank);
    const newCrankIndex = this.cranks.findIndex((c) =>
      c.publicKey.equals(crank.publicKey)
    );
    if (newCrankIndex === -1) {
      throw new Error(`failed to find new crank in queue`);
    }
    return newCrankIndex;
  }

  static async buildCranks(
    context: CommandContext,
    queueAccount: OracleQueueAccount,
    cranks: CrankDefinitions
  ): Promise<CrankClass[]> {
    const newCranks: CrankClass[] = [];
    if (typeof cranks === "number") {
      context.logger.debug(`creating ${cranks} cranks`);
      for await (const index of getArrayOfSizeN(cranks)) {
        const crank = await CrankClass.fromDefault(
          context,
          queueAccount,
          `Crank-${index}` // should we get last crank num and increment?
        );
        newCranks.push(crank);
      }
    } else {
      context.logger.debug(
        `creating ${cranks.length} cranks from json definition`
      );
      for await (const crankDefinition of cranks) {
        const crank = await CrankClass.fromJSON(
          context,
          {
            ...crankDefinition,
            queuePublicKey: queueAccount.publicKey,
          },
          queueAccount
        );
        newCranks.push(crank);
      }
    }
    return newCranks;
  }

  async addOracle(
    context: CommandContext,
    oracleDefinition: OracleDefinition
  ): Promise<number> {
    const oracle = await OracleClass.build(
      context,
      this.account.program,
      {
        ...oracleDefinition,
        queuePublicKey: this.publicKey,
      },
      this.account
    );

    this.oracles.push(oracle);
    const newOracleIndex = this.oracles.findIndex((o) =>
      o.publicKey.equals(oracle.publicKey)
    );
    if (newOracleIndex === -1) {
      throw new Error(`failed to find new oracle in queue`);
    }
    return newOracleIndex;
  }

  static async buildOracles(
    context: CommandContext,
    queueAccount: OracleQueueAccount,
    oracles: OracleDefinitions
  ): Promise<OracleClass[]> {
    const newOracles: OracleClass[] = [];
    if (typeof oracles === "number") {
      context.logger.debug(`creating ${oracles} oracles`);
      for await (const index of getArrayOfSizeN(oracles)) {
        const oracle = await OracleClass.fromDefault(
          context,
          queueAccount,
          `Oracle-${index}`
        );
        await oracle.grantPermission(context);
        newOracles.push(oracle);
      }
    } else {
      context.logger.debug(
        `creating ${oracles.length} oracles from json definition`
      );
      for await (const oracleDefinition of oracles) {
        const oracle = await OracleClass.build(
          context,
          queueAccount.program,
          {
            ...oracleDefinition,
            queuePublicKey: queueAccount.publicKey,
          },
          queueAccount
        );
        await oracle.grantPermission(context);
        newOracles.push(oracle);
      }
    }
    return newOracles;
  }

  async addAggregator(
    context: CommandContext,
    aggregatorDefinition: AggregatorDefinition
  ): Promise<number> {
    const aggregator = await AggregatorClass.build(
      context,
      this.account.program,
      aggregatorDefinition,
      this.account
    );
    await aggregator.grantPermission(context);
    this.aggregators.push(aggregator);
    const newAggregatorIndex = this.aggregators.findIndex((aggregator) =>
      aggregator.publicKey.equals(aggregator.publicKey)
    );
    if (newAggregatorIndex === -1) {
      throw new Error(`failed to find new aggregator in queue`);
    }
    return newAggregatorIndex;
  }

  private static async findCrankByKey(
    context: CommandContext,
    cranks: CrankClass[],
    key: string | number | boolean | PublicKey
  ): Promise<CrankClass> {
    if (typeof key === "number") {
      if (cranks.length >= key) {
        const crank = cranks[key];
        return crank;
      }
      throw new Error(
        `failed to find crank by key ${key}, length ${cranks.length}`
      );
    } else if (typeof key === "boolean") {
      if (cranks.length > 0) {
        const crank = cranks[0];
        return crank;
      }
      throw new Error(`failed to find any cranks`);
    } else if (typeof key === "string") {
      const foundCrank = cranks.find((c) => c.name === key);
      if (foundCrank) {
        return foundCrank;
      }
      try {
        const crankKey = new PublicKey(key);
        const crank = cranks.find((c) => c.publicKey === crankKey);
        if (crank) {
          return crank;
        }
      } catch {}
    }
  }

  static async addAggregatorToCrank(
    context: CommandContext,
    aggregator: AggregatorClass,
    cranks: CrankClass[],
    key: string | number | boolean
  ) {
    const crank = await OracleQueueClass.findCrankByKey(context, cranks, key);
    crank.account.push({
      aggregatorAccount: aggregator.account,
    });
    context.logger.debug(
      `added aggregator ${aggregator.name} to crank ${key} ${crank.publicKey}`
    );
    aggregator.crankPublicKey = crank.publicKey;
  }

  // loads anchor idl and parses response
  async loadData() {
    const data: OracleQueueAccountData = await this.account.loadData();
    this.name = buffer2string(data.name as any);
    this.metadata = buffer2string(data.metadata as any);
    this.authorityPublicKey = data.authority;
    this.oracleTimeout = data.oracleTimeout;
    this.reward = data.reward;
    this.minStake = data.minStake;
    this.slashingEnabled = data.slashingEnabled;
    this.varianceToleranceMultiplier = data.varianceToleranceMultiplier;
    this.feedProbationPeriod = data.feedProbationPeriod;
    this.consecutiveFeedFailureLimit = data.consecutiveFeedFailureLimit;
    this.consecutiveOracleFailureLimit = data.consecutiveOracleFailureLimit;
    this.unpermissionedFeedsEnabled = data.unpermissionedFeedsEnabled;
    this.unpermissionedVrfEnabled = data.unpermissionedVrfEnabled;
    this.oracleBuffer = data.dataBuffer;
  }

  // needed to enforce ordering of json output
  toJSON(): IOracleQueueClass {
    return {
      name: this.name,
      metadata: this.metadata,
      publicKey: this.publicKey,
      authorityPublicKey: this.authorityPublicKey,
      queueSize: this.queueSize,
      minStake: this.minStake,
      reward: this.reward,
      slashingEnabled: this.slashingEnabled,
      unpermissionedFeedsEnabled: this.unpermissionedFeedsEnabled,
      unpermissionedVrfEnabled: this.unpermissionedVrfEnabled,
      minUpdateDelaySeconds: this.minUpdateDelaySeconds,
      consecutiveFeedFailureLimit: this.consecutiveFeedFailureLimit,
      feedProbationPeriod: this.feedProbationPeriod,
      consecutiveOracleFailureLimit: this.consecutiveOracleFailureLimit,
      oracleTimeout: this.oracleTimeout,
      varianceToleranceMultiplier: this.varianceToleranceMultiplier,
      cranks: this.cranks ? this.cranks.map((crank) => crank.toJSON()) : [],
      oracles: this.oracles
        ? this.oracles.map((oracle) => oracle.toJSON())
        : [],
      aggregators: this.aggregators
        ? this.aggregators.map((aggregator) => aggregator.toJSON())
        : [],
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON(), pubKeyConverter, 2);
  }

  prettyPrint(all = false, SPACING = 30): string {
    let outputString = "";

    outputString += chalk.underline(
      chalkString("## Queue", this.account.publicKey, SPACING) + "\r\n"
    );
    outputString += chalkString("name", this.name, SPACING) + "\r\n";
    outputString += chalkString("metadata", this.metadata, SPACING) + "\r\n";
    outputString +=
      chalkString("oracleBuffer", this.oracleBuffer, SPACING) + "\r\n";
    outputString +=
      chalkString("authority", this.authorityPublicKey, SPACING) + "\r\n";
    outputString +=
      chalkString("oracleTimeout", this.oracleTimeout.toString(), SPACING) +
      "\r\n";
    outputString +=
      chalkString("reward", this.reward.toString(), SPACING) + "\r\n";
    outputString +=
      chalkString("minStake", this.minStake.toString(), SPACING) + "\r\n";
    outputString +=
      chalkString("slashingEnabled", this.slashingEnabled, SPACING) + "\r\n";
    outputString +=
      chalkString(
        "consecutiveFeedFailureLimit",
        this.consecutiveFeedFailureLimit.toString(),
        SPACING
      ) + "\r\n";
    outputString +=
      chalkString(
        "consecutiveOracleFailureLimit",
        this.consecutiveOracleFailureLimit.toString(),
        SPACING
      ) + "\r\n";
    // outputString += chalkString(
    //   "varianceToleranceMultiplier",
    //   this.varianceToleranceMultiplier.toBig().toString(),
    //   SPACING
    // ) + "\r\n";
    outputString +=
      chalkString(
        "feedProbationPeriod",
        this.feedProbationPeriod.toString(),
        SPACING
      ) + "\r\n";
    outputString +=
      chalkString(
        "unpermissionedFeedsEnabled",
        this.unpermissionedFeedsEnabled.toString(),
        SPACING
      ) + "\r\n";
    outputString +=
      chalkString(
        "unpermissionedVrfEnabled",
        this.unpermissionedVrfEnabled.toString(),
        SPACING
      ) + "\r\n";

    if (all) {
      for (const crank of this.cranks) {
        outputString += crank.prettyPrint(true, SPACING);
      }
      for (const oracle of this.oracles) {
        outputString += oracle.prettyPrint(true, SPACING);
      }
    }

    return outputString;
  }
}
