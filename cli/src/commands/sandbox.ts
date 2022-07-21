import { Flags } from "@oclif/core";
import { PublicKey } from "@solana/web3.js";
import BaseCommand from "../BaseCommand";

export default class SandboxCommand extends BaseCommand {
  static description = "sandbox";

  static flags = {
    ...BaseCommand.flags,
    name: Flags.string({
      char: "n",
      description: "name of the job account for easier identification",
      default: "",
    }),
  };

  static args = [
    {
      name: "placeholder",
      required: false,
      description: "",
    },
  ];

  async run() {
    const { args, flags } = await this.parse(SandboxCommand);

    // const size = this.program.account.vrfAccountData.size;
    // const rentExemption =
    //   await this.program.provider.connection.getMinimumBalanceForRentExemption(
    //     size
    //   );

    // console.log(`VRF SIZE:           ${size}`);
    // console.log(`VRF Rent Exemption: ${rentExemption}`);

    // const vrfKey = new PublicKey(
    //   "Ccwo1g4myQytwa2XBJXty4mpnMtrofFPeeQnpV16Ee63"
    // );
    // const accountInfo = await this.program.provider.connection.getAccountInfo(
    //   vrfKey
    // );
    // const byteArray = Uint8Array.from(accountInfo.data);
    // console.log(`[${byteArray.toString()}]`);
    // console.log(byteArray.length);
    // console.log(`[${Uint8Array.from(vrfKey.toBuffer()).toString()}]`);

    // const aggregatorKey = new PublicKey(
    //   "EzLEabKKa7jf4N4eM7SmtbKc6UPSpj1C4Gxhg9myZNaE"
    // );
    // const historyKey = new PublicKey(
    //   "DiFWjRtc9PQGposykEULC93y7uTXde3Eyr7HnQ7kvqkD"
    // );

    // const aggregator = new AggregatorAccount({
    //   program: this.program,
    //   publicKey: aggregatorKey,
    // });
    // const history = await aggregator.loadHistory();
    // for (const row of history) {
    //   console.log(
    //     `${row.timestamp.toString(10).padEnd(12)} - ${row.value.toString()}`
    //   );
    // }

    // const accountInfo = await this.program.provider.connection.getAccountInfo(
    //   historyKey
    // );
    // const byteArray = Uint8Array.from(accountInfo.data);
    // console.log(`[${byteArray.toString()}]`);
    // console.log(byteArray.length);
    // console.log(`[${Uint8Array.from(historyKey.toBuffer()).toString()}]`);

    const parseAddress = new PublicKey(
      "DpoK8Zz69APV9ntjuY9C4LZCxANYMV56M2cbXEdkjxME"
    );
    console.log(`parseAddress: [${Uint8Array.from(parseAddress.toBuffer())}]`);

    const accountInfo = await this.program.provider.connection.getAccountInfo(
      parseAddress
    );
    const byteArray = Uint8Array.from(accountInfo.data);
    console.log(`parseAddress Data [${byteArray.length}]: [${byteArray}]`);

    const owner = accountInfo.owner;
    console.log(`Owner: [${Uint8Array.from(owner.toBuffer())}]`);

    console.log(accountInfo.lamports);
  }

  async catch(error) {
    super.catch(error, "sandbox command failed");
  }
}
