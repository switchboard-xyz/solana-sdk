import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";
import { InvalidKeypairFsPathProvided, InvalidKeypairProvided } from "../types";

export interface fromLocalKeypair {
  localPath: string;
}

export interface fromGoogleSecret {
  secretPath: string;
}

export type KeypairDescriptor = string | fromLocalKeypair | fromGoogleSecret;

export interface IKeypairDescriptor {
  publicKey: PublicKey;
  localPath?: string;
  secretPath?: string;
}

export const loadKeypairFs = (keypairPath: string): Keypair => {
  const fullPath =
    keypairPath.charAt(0) === "/"
      ? keypairPath
      : path.join(process.cwd(), keypairPath);
  if (!fs.existsSync(fullPath)) {
    throw new InvalidKeypairFsPathProvided(fullPath);
  }

  try {
    // const walletKeypair = Keypair.fromSecretKey(
    //   Buffer.from(
    //     JSON.parse(
    //       fs.readFileSync(process.env.ANCHOR_WALLET, {
    //         encoding: "utf-8",
    //       })
    //     )
    //   )
    // );
    const walletKeypair = Keypair.fromSecretKey(
      new Uint8Array(
        JSON.parse(
          fs.readFileSync(fullPath, {
            encoding: "utf-8",
          })
        )
      )
    );
    return walletKeypair;
  } catch (error) {
    throw new Error(`failed to load keypair from ${fullPath}: ${error}`);
  }
};

export const loadGoogleSecretKeypair = async (
  secretPath: string
): Promise<Keypair> => {
  const client = new SecretManagerServiceClient();

  const [accessResponse] = await client.accessSecretVersion({
    name: secretPath.includes("/versions/")
      ? secretPath
      : `${secretPath}/versions/latest`,
  });

  const secrets = accessResponse.payload.data;
  if (secrets === undefined) {
    throw new Error("Google secret not found.");
  }

  let secretKey: Uint8Array;

  if (typeof secrets === "string") {
    secretKey = new Uint8Array(Buffer.from(secrets));
  } else if (secrets instanceof Buffer) {
    secretKey = new Uint8Array(JSON.parse(secrets.toString()));
  }

  if (secretKey) {
    return Keypair.fromSecretKey(secretKey);
  }

  throw new Error(`failed to read gcp secret`);
};

export const loadKeypair = async (
  keypairPath: KeypairDescriptor
): Promise<Keypair> => {
  if (typeof keypairPath === "string") {
    try {
      const keypair = loadKeypairFs(keypairPath);
      return keypair;
    } catch {}

    try {
      const keypair = await loadGoogleSecretKeypair(keypairPath);
      return keypair;
    } catch {}
  } else if ("localPath" in keypairPath) {
    return loadKeypairFs(keypairPath.localPath as string);
  } else if ("secretPath" in keypairPath) {
    return loadGoogleSecretKeypair(keypairPath.secretPath);
  }

  throw new InvalidKeypairProvided(keypairPath);
};

/** Loads a keypair with a descriptor to find and retrieve on-command */
export const loadKeypairWithDescriptor = async (
  keypairPath: KeypairDescriptor
): Promise<[Keypair, IKeypairDescriptor]> => {
  if (typeof keypairPath === "string") {
    try {
      const keypair = loadKeypairFs(keypairPath);
      const descriptor: IKeypairDescriptor = {
        publicKey: keypair.publicKey,
        localPath: keypairPath,
      };
      return [keypair, descriptor];
    } catch {
      try {
        const keypair = await loadGoogleSecretKeypair(keypairPath);
        const descriptor: IKeypairDescriptor = {
          publicKey: keypair.publicKey,
          secretPath: keypairPath,
        };
        return [keypair, descriptor];
      } catch {}
    }
  } else if ("localPath" in keypairPath) {
    const keypair = loadKeypairFs(keypairPath.localPath as string);
    const descriptor: IKeypairDescriptor = {
      publicKey: keypair.publicKey,
      localPath: keypairPath.localPath,
    };
    return [keypair, descriptor];
  } else if ("secretPath" in keypairPath) {
    const keypair = await loadGoogleSecretKeypair(keypairPath.secretPath);
    const descriptor: IKeypairDescriptor = {
      publicKey: keypair.publicKey,
      secretPath: keypairPath.secretPath,
    };
    return [keypair, descriptor];
  }

  throw new InvalidKeypairProvided(keypairPath);
};
