import { OracleJob } from "@switchboard-xyz/switchboard-v2";
import AbstractJobTemplate from "./template";

export class Kucoin extends AbstractJobTemplate {
  url(): string {
    return `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${this.id}`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        httpTask: OracleJob.HttpTask.create({
          url: this.url(),
        }),
      }),
      OracleJob.Task.create({
        jsonParseTask: OracleJob.JsonParseTask.create({ path: `$.data.price` }),
      }),
    ];
    return tasks;
  }
}
