import { OracleJob } from "@switchboard-xyz/switchboard-v2";
import AbstractJobTemplate from "./template";

export class FtxCom extends AbstractJobTemplate {
  url(): string {
    return `wss://ftx.com/ws/`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        websocketTask: OracleJob.WebsocketTask.create({
          url: this.url(),
          subscription: JSON.stringify({
            op: "subscribe",
            channel: "ticker",
            market: this.id,
          }),
          maxDataAgeSeconds: 15,
          filter: `$[?(@.type == 'update' && @.channel == 'ticker' && @.market == '${this.id}')]`,
        }),
      }),
      OracleJob.Task.create({
        medianTask: OracleJob.MedianTask.create({
          tasks: [
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data.bid",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data.ask",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data.last",
              }),
            }),
          ],
        }),
      }),
    ];
    return tasks;
  }
}
