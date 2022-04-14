import { OracleJob } from "@switchboard-xyz/v2-task-library";
import { TemplateSource, TEMPLATE_SOURCES } from ".";
import { Ascendex } from "./jobTemplates/ascendex";
import { BinanceCom } from "./jobTemplates/binanceCom";
import { BinanceUs } from "./jobTemplates/binanceUs";
import { Bitfinex } from "./jobTemplates/bitfinex";
import { Bitstamp } from "./jobTemplates/bitstamp";
import { Bittrex } from "./jobTemplates/bittrex";
import { Bonfida } from "./jobTemplates/bonfida";
import { Coinbase } from "./jobTemplates/coinbase";
import { FtxCom } from "./jobTemplates/ftxCom";
import { FtxUs } from "./jobTemplates/ftxUs";
import { Gate } from "./jobTemplates/gate";
import { Huobi } from "./jobTemplates/huobi";
import { Kraken } from "./jobTemplates/kraken";
import { Kucoin } from "./jobTemplates/kucoin";
import { Mexc } from "./jobTemplates/mexc";
import { Okex } from "./jobTemplates/okex";
import { Orca } from "./jobTemplates/orca";
import { Raydium } from "./jobTemplates/raydium";
import { SMB } from "./jobTemplates/smb";

export const buildJobTasks = async (
  source: TemplateSource,
  id?: string
): Promise<OracleJob.Task[]> => {
  switch (source.toLowerCase()) {
    case "ascendex":
      return new Ascendex(id).tasks();
    case "binancecom":
      return new BinanceCom(id).tasks();
    case "binanceus":
      return new BinanceUs(id).tasks();
    case "bitfinex":
      return new Bitfinex(id).tasks();
    case "bitstamp":
      return new Bitstamp(id).tasks();
    case "bittrex":
      return new Bittrex(id).tasks();
    case "bonfida":
      return new Bonfida(id).tasks();
    case "coinbase":
      return new Coinbase(id).tasks();
    case "ftxcom":
      return new FtxCom(id).tasks();
    case "ftxus":
      return new FtxUs(id).tasks();
    case "gate":
      return new Gate(id).tasks();
    case "huobi":
      return new Huobi(id).tasks();
    case "kraken":
      return new Kraken(id).tasks();
    case "kucoin":
      return new Kucoin(id).tasks();
    case "mexc":
      return new Mexc(id).tasks();
    case "okex":
      return new Okex(id).tasks();
    case "orca":
      return new Orca(id).tasks();
    case "raydium":
      return new Raydium(id).tasks();
    case "smb":
      return new SMB(id).tasks();
    default:
      throw new Error(
        `No job template found for ${source}. Available options:\r\n${TEMPLATE_SOURCES}`
      );
  }
};
