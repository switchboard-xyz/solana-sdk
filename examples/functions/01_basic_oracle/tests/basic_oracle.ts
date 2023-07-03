import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BasicOracle } from "../target/types/basic_oracle";
import {
  AttestationQueueAccount,
  SwitchboardProgram,
  type BootstrappedAttestationQueue,
  FunctionAccount,
  parseMrEnclave,
  MrEnclave,
  types,
  attestationTypes,
  AttestationProgramStateAccount,
} from "@switchboard-xyz/solana.js";
import { sleep } from "@switchboard-xyz/common";

const unixTimestamp = () => Math.floor(Date.now() / 1000);

// vv1gTnfuUiroqgJHS4xsRASsRQqqixCv1su85VWvcP9

const MRENCLAVE = parseMrEnclave(
  Buffer.from("Y6keo0uTCiWDNcWwGjZ2jfTd4VFhrr6LC/6Mk1aiNCA=", "base64")
);
const emptyEnclave: number[] = new Array(32).fill(0);

function has_mr_enclave(
  enclaves: Array<MrEnclave>,
  unknown_enclave: MrEnclave
) {
  return enclaves.includes(unknown_enclave);
}

describe("basic_oracle", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.BasicOracle as Program<BasicOracle>;

  const payer = (program.provider as anchor.AnchorProvider).publicKey;

  const programStatePubkey = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("BASICORACLE")],
    program.programId
  )[0];

  const oraclePubkey = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("ORACLE_V1_SEED")],
    program.programId
  )[0];

  let switchboard: BootstrappedAttestationQueue;
  let functionAccount: FunctionAccount;

  before(async () => {
    const switchboardProgram = await SwitchboardProgram.fromProvider(
      program.provider as anchor.AnchorProvider
    );
    await AttestationProgramStateAccount.getOrCreate(switchboardProgram);
    switchboard = await AttestationQueueAccount.bootstrapNewQueue(
      switchboardProgram
    );

    [functionAccount] = await FunctionAccount.create(
      switchboard.attestationQueueAccount.program,
      {
        container: "switchboardlabs/basic-oracle-function",
        version: "latest",
        schedule: "15 * * * * *",
        mrEnclave: MRENCLAVE,
        attestationQueue: switchboard.attestationQueueAccount,
        authority: programStatePubkey,
      }
    );
  });

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize({})
      .accounts({
        program: programStatePubkey,
        oracle: oraclePubkey,
        authority: payer,
        function: functionAccount.publicKey,
      })
      .rpc()
      .catch((err) => {
        console.error(err);
        throw err;
      });
    console.log("Your transaction signature", tx);
  });

  // it("Adds an enclave measurement", async () => {
  //   // Add your test here.
  //   const tx = await program.methods
  //     .setEnclaves({ mrEnclaves: [Array.from(MRENCLAVE)] })
  //     .accounts({
  //       program: programStatePubkey,
  //       authority: payer,
  //     })
  //     .rpc()
  //     .catch((err) => {
  //       console.error(err);
  //       throw err;
  //     });
  //   console.log("Your transaction signature", tx);
  //   const programState = await program.account.myProgramState.fetch(
  //     programStatePubkey
  //   );
  // });

  it("Oracle refreshes the prices", async () => {
    const securedSigner = anchor.web3.Keypair.generate();

    const rewardAddress =
      await switchboard.attestationQueueAccount.program.mint.getOrCreateAssociatedUser(
        payer
      );

    // TODO: generate function verify ixn
    const functionVerifyIxn = attestationTypes.functionVerify(
      switchboard.attestationQueueAccount.program,
      {
        params: {
          observedTime: new anchor.BN(unixTimestamp()),
          nextAllowedTimestamp: new anchor.BN(unixTimestamp() + 100),
          isFailure: false,
          mrEnclave: Array.from(MRENCLAVE),
        },
      },
      {
        function: functionAccount.publicKey,
        functionEnclaveSigner: securedSigner.publicKey,
        verifierEnclaveSigner: switchboard.verifier.signer.publicKey,
        verifierQuote: switchboard.verifier.quoteAccount.publicKey,
        attestationQueue: switchboard.attestationQueueAccount.publicKey,
        escrow: functionAccount.getEscrow(),
        receiver: rewardAddress,
        verifierPermission: switchboard.verifier.permissionAccount.publicKey,
        state:
          switchboard.attestationQueueAccount.program.attestationProgramState
            .publicKey,
        fnQuote: functionAccount.getEnclaveAccount()[0].publicKey,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      }
    );

    // Add your test here.
    const tx = await program.methods
      .refreshOracles({
        rows: [
          {
            symbol: { btc: {} },
            data: {
              oracleTimestamp: new anchor.BN(unixTimestamp()),
              price: new anchor.BN("25225000000000"), // 25225
              volume1hr: new anchor.BN("25225000000000"), // 1337000
              volume24hr: new anchor.BN("25225000000000"), // 1337000
              twap1hr: new anchor.BN("25225000000000"), // 25550
              twap24hr: new anchor.BN("25225000000000"), // 25550
            },
          },
          {
            symbol: { eth: {} },
            data: {
              oracleTimestamp: new anchor.BN(unixTimestamp()),
              price: new anchor.BN("1750000000000"), // 1750
              volume1hr: new anchor.BN("420000000000"), // 420000
              volume24hr: new anchor.BN("420000000000"), // 420000
              twap1hr: new anchor.BN("1750000000000"), // 1750
              twap24hr: new anchor.BN("1750000000000"), // 1750
            },
          },
        ],
      })
      .accounts({
        programState: programStatePubkey,
        oracle: oraclePubkey,
        function: functionAccount.publicKey,
        enclave: functionAccount.getEnclaveAccount()[0].publicKey,
        enclaveSigner: securedSigner.publicKey,
      })
      .preInstructions([functionVerifyIxn])
      .signers([switchboard.verifier.signer, securedSigner])
      .rpc()
      .catch((err) => {
        console.error(err);
        throw err;
      });

    console.log("Your transaction signature", tx);

    await sleep(5000);

    const oracleState = await program.account.myOracleState.fetch(oraclePubkey);

    console.log(oracleState);

    console.log(`BTC\n`);
    printData(oracleState.btc);
    console.log(`ETH\n`);
    printData(oracleState.eth);
    console.log(`SOL\n`);
    printData(oracleState.sol);
  });
});

function normalizeDecimals(value: anchor.BN) {
  return (value ?? new anchor.BN(0))
    .div(new anchor.BN(10).pow(new anchor.BN(9)))
    .toNumber();
}

function printData(obj: {
  oracleTimestamp: anchor.BN;
  price: anchor.BN;
  volume1hr: anchor.BN;
  volume24hr: anchor.BN;
  twap1hr: anchor.BN;
  twap24hr: anchor.BN;
}) {
  console.log(`\tprice: ${normalizeDecimals(obj.price)}`);
  console.log(`\ttimestamp: ${obj.oracleTimestamp.toNumber()}`);
  console.log(`\t1Hr Volume: ${normalizeDecimals(obj.volume1hr)}`);
  console.log(`\t24Hr Volume: ${normalizeDecimals(obj.volume24hr)}`);
  console.log(`\t1Hr Twap: ${normalizeDecimals(obj.twap1hr)}`);
  console.log(`\t24Hr Twap: ${normalizeDecimals(obj.twap24hr)}`);
}
