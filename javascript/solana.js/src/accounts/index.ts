export * from './account';
export * from './aggregatorAccount';
export * from './aggregatorHistoryBuffer';
export * from './bufferRelayAccount';
export * from './crankAccount';
export * from './crankDataBuffer';
export * from './jobAccount';
export * from './leaseAccount';
export * from './oracleAccount';
export * from './permissionAccount';
export * from './programStateAccount';
export * from './queueAccount';
export * from './queueDataBuffer';
export * from './vrfAccount';

export const BUFFER_DISCRIMINATOR = Buffer.from([
  42,
  55,
  46,
  46,
  45,
  52,
  78,
  78, // BUFFERxx
]);

export type SwitchboardAccountTypes =
  | 'Aggregator'
  | 'AggregatorHistory'
  | 'BufferRelayer'
  | 'Crank'
  | 'CrankBuffer'
  | 'Job'
  | 'Lease'
  | 'Oracle'
  | 'Permission'
  | 'ProgramState'
  | 'Queue'
  | 'QueueBuffer'
  | 'Vrf';
