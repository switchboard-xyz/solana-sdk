import { PublicKey } from "@solana/web3.js";
import { OracleJob } from "@switchboard-xyz/v2-task-library";

export async function buildOrcaLpTask(
  key: string,
  solKey: PublicKey
): Promise<OracleJob.Task[]> {
  const tasks = [
    OracleJob.Task.create({
      lpExchangeRateTask: OracleJob.LpExchangeRateTask.create({
        saberPoolAddress: key,
      }),
    }),
    OracleJob.Task.create({
      multiplyTask: OracleJob.MultiplyTask.create({
        aggregatorPubkey: solKey.toBase58(),
      }),
    }),
  ];
  return tasks;
}
