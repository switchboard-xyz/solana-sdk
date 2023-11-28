import { SB_ATTESTATION_PID } from "../SwitchboardProgram.js";

import dotenv from "dotenv";
import z from "zod";
import { generateErrorMessage } from "zod-error";
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  IS_SIMULATION: z.coerce.boolean().default(false),
  SWITCHBOARD: z.string().default(SB_ATTESTATION_PID.toBase58()),
  FUNCTION_KEY: z.string(),
  PAYER: z.string(),
  VERIFIER: z.string(),
  REWARD_RECEIVER: z.string(),
  FUNCTION_DATA: z.string().optional(),
  VERIFIER_ENCLAVE_SIGNER: z.string().optional(),
  QUEUE_AUTHORITY: z.string().optional(),
  FUNCTION_REQUEST_KEY: z.string().optional(),
  FUNCTION_REQUEST_DATA: z.string().optional(),
  CLUSTER: z
    .enum(["mainnet-beta", "devnet", "localnet"])
    .default("mainnet-beta"),
});

const ENV = envSchema.parse(process.env);

const getEnvIssues = (): z.ZodIssue[] | void => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) return result.error.issues;
  const env = envSchema.parse(process.env);
};

export function getEnv() {
  const issues = getEnvIssues();
  if (issues) {
    console.error("Invalid environment variables, check the errors below!");
    console.error(
      generateErrorMessage(issues, {
        delimiter: { error: "\\n" },
      })
    );
    process.exit(-1);
  }

  return ENV;
}

// export interface SolanaFunctionEnvironment {
//   switchboard: PublicKey;
//   functionKey: PublicKey;
//   payer: PublicKey;
//   verifier: PublicKey;
//   rewardReceiver: PublicKey;
//   functionData: FunctionAccountData;
//   verifierEnclaveSigner: PublicKey;
//   queueAuthority: PublicKey;
//   functionRequestKey: PublicKey;
//   functionRequestData: FunctionRequestAccountData;
//   cluster: Omit<Cluster, "testnet"> | "localnet";
// }

// export async function loadEnv(): Promise<SolanaFunctionEnvironment> {
//   const issues = getEnvIssues();
//   if (issues) {
//     console.error("Invalid environment variables, check the errors below!");
//     console.error(
//       generateErrorMessage(issues, {
//         delimiter: { error: "\\n" },
//       })
//     );
//     process.exit(-1);
//   }

//   const env = envSchema.parse(process.env);
//   if (env.IS_SIMULATION) {
//     // idk, handle this differently somehow
//   }
//   const cluster = env.CLUSTER;

//   const switchboard = env.SWITCHBOARD
//     ? new PublicKey(env.SWITCHBOARD)
//     : SB_ATTESTATION_PID;

//   const payer = new PublicKey(env.PAYER);
//   const verifier = new PublicKey(env.VERIFIER);

//   const functionKey = new PublicKey(env.FUNCTION_KEY);
// }
