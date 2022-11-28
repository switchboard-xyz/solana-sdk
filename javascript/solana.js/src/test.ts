// import { AggregatorAccount, QueueAccount } from './accounts';
// import { SwitchboardProgram } from './program';

// export class SwitchboardTestContext {
//   constructor(
//     readonly program: SwitchboardProgram,
//     readonly queue: QueueAccount
//   ) {}

//   public async isReady(): Promise<boolean> {
//     return await this.queue.isReady();
//   }

//   // public async awaitOracleHeartbeat(timeout = 30): Promise<void> {
//   //   throw new Error(`Not implemented yet`);
//   // }

//   static async create(): Promise<SwitchboardTestContext> {
//     throw new Error(`Not implemented yet`);

//     // Create queue

//     // Create oracle

//     // Create token accounts
//   }

//   static async load(): Promise<SwitchboardTestContext> {
//     throw new Error(`Not implemented yet`);
//   }

//   public static findSwitchboardEnv(envFileName = 'switchboard.env'): string {
//     throw new Error(`Not implemented yet`);
//   }

//   public async createStaticFeed(
//     value: number,
//     timeout = 30
//   ): Promise<AggregatorAccount> {
//     throw new Error(`Not implemented yet`);
//   }

//   public async updateStaticFeed(
//     aggregatorAccount: AggregatorAccount,
//     value: number,
//     timeout = 30
//   ): Promise<AggregatorAccount> {
//     throw new Error(`Not implemented yet`);
//   }
// }
