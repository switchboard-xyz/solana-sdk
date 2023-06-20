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
} from "@switchboard-xyz/solana.js";

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
    switchboard = await AttestationQueueAccount.bootstrapNewQueue(
      await SwitchboardProgram.fromProvider(
        program.provider as anchor.AnchorProvider
      )
    );

    [functionAccount] = await FunctionAccount.create(
      switchboard.attestationQueueAccount.program,
      {
        container: "switchboardlabs/basic-oracle-function",
        version: "latest",
        schedule: "15 * * * * *",
        mrEnclave: MRENCLAVE,
        attestationQueue: switchboard.attestationQueueAccount,
      }
    );
  });

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
      .initialize({ mrEnclaves: [] })
      .accounts({
        program: programStatePubkey,
        oracle: oraclePubkey,
        authority: payer,
      })
      .rpc()
      .catch((err) => {
        console.error(err);
        throw err;
      });
    console.log("Your transaction signature", tx);
  });

  it("Adds an enclave measurement", async () => {
    // Add your test here.
    const tx = await program.methods
      .setEnclaves({ mrEnclaves: [Array.from(MRENCLAVE)] })
      .accounts({
        program: programStatePubkey,
        authority: payer,
      })
      .rpc()
      .catch((err) => {
        console.error(err);
        throw err;
      });
    console.log("Your transaction signature", tx);
    const programState = await program.account.myProgramState.fetch(
      programStatePubkey
    );
    console.log(
      `MrEnclaves:\n\t${programState.mrEnclaves
        .filter(
          (e) => Buffer.compare(Buffer.from(e), Buffer.from(emptyEnclave)) !== 0
        )
        .map((e) => `[${e}]`)
        .join("\n\t")}`
    );
  });

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
        fnSigner: securedSigner.publicKey,
        securedSigner: switchboard.verifier.signer.publicKey,
        verifierQuote: switchboard.verifier.quoteAccount.publicKey,
        attestationQueue: switchboard.attestationQueueAccount.publicKey,
        escrow: functionAccount.getEscrow(),
        receiver: rewardAddress,
        verifierPermission: switchboard.verifier.permissionAccount.publicKey,
        fnPermission: functionAccount.getPermissionAccount(
          switchboard.attestationQueueAccount.publicKey,
          payer
        )[0].publicKey,
        state:
          switchboard.attestationQueueAccount.program.attestationProgramState
            .publicKey,
        payer: payer,
        fnQuote: functionAccount.getQuoteAccount()[0].publicKey,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    );

    // Add your test here.
    const tx = await program.methods
      .refreshOracles({
        btc: {
          oracleTimestamp: new anchor.BN(0),
          price: new anchor.BN("25225000000000"), // 25225
          volume: new anchor.BN("1337000000000000"), // 1337000
          twap24hr: new anchor.BN("25550000000000"), // 25550
        },
        eth: {
          oracleTimestamp: new anchor.BN(0),
          price: new anchor.BN("1815000000000"), // 1815
          volume: new anchor.BN("556000000000000"), // 556000
          twap24hr: new anchor.BN("1913000000000"), // 1913
        },
        sol: null,
        usdt: null,
        usdc: null,
        doge: null,
        near: null,
      })
      .accounts({
        program: programStatePubkey,
        oracle: oraclePubkey,
        function: functionAccount.publicKey,
        quote: functionAccount.getQuoteAccount()[0].publicKey,
        securedSigner: securedSigner.publicKey,
      })
      .preInstructions([functionVerifyIxn])
      .signers([switchboard.verifier.signer, securedSigner])
      .rpc()
      .catch((err) => {
        console.error(err);
        throw err;
      });

    console.log("Your transaction signature", tx);

    const oracleState = await program.account.myOracleState.fetch(oraclePubkey);

    console.log(`BTC`);
    printData(oracleState.btc);
    console.log(`ETH`);
    printData(oracleState.eth);
    console.log(`SOL`);
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
  volume: anchor.BN;
  twap24hr: anchor.BN;
}) {
  console.log(
    `\tprice: $${normalizeDecimals(obj.price)}\n\tvolume: ${normalizeDecimals(
      obj.volume
    )}\n\t24Hr Twap: $${normalizeDecimals(obj.twap24hr)}`
  );
}
