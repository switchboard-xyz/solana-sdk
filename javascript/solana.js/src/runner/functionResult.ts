export interface EvmTransaction {
  expiration_time_seconds: number;
  gas_limit: string;
  value: string;
  to: number[];
  from: number[];
  data: number[];
}

export interface EVMFunctionResult {
  txs: EvmTransaction[];
  signatures: number[][];
  call_ids: number[][];
  checksums: number[][];
}

export interface SOLFunctionResult {
  serialized_tx: number[];
}

export type ChainResultInfo = EVMFunctionResult | SOLFunctionResult;

export interface FunctionResult {
  version: number;
  quote: number[];
  fn_key: number[];
  signer: number[];
  fn_request_key: number[];
  fn_request_hash: number[];
  chain_result_info: ChainResultInfo;
}
