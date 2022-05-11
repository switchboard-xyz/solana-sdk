import { OracleJob } from "@switchboard-xyz/switchboard-v2";
import AbstractJobTemplate from "./template";

export class Coinbase extends AbstractJobTemplate {
  url(): string {
    return `wss://ws-feed.pro.coinbase.com`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        websocketTask: OracleJob.WebsocketTask.create({
          url: this.url(),
          subscription: JSON.stringify({
            type: "subscribe",
            product_ids: [this.id],
            channels: [
              "ticker",
              {
                name: "ticker",
                product_ids: [this.id],
              },
            ],
          }),
          maxDataAgeSeconds: 15,
          filter: `$[?(@.type == 'ticker' && @.product_id == '${this.id}')]`,
        }),
      }),
      OracleJob.Task.create({
        jsonParseTask: OracleJob.JsonParseTask.create({ path: "$.price" }),
      }),
    ];
    return tasks;
  }
}
