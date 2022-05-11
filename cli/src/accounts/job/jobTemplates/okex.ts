import { OracleJob } from "@switchboard-xyz/switchboard-v2";
import AbstractJobTemplate from "./template";

export class Okex extends AbstractJobTemplate {
  url(): string {
    return `wss://ws.okex.com:8443/ws/v5/public`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        websocketTask: OracleJob.WebsocketTask.create({
          url: "wss://ws.okex.com:8443/ws/v5/public",
          subscription: JSON.stringify({
            op: "subscribe",
            args: [{ channel: "tickers", instId: this.id }],
          }),
          maxDataAgeSeconds: 15,
          filter:
            "$[?(" +
            `@.event != 'subscribe' && ` +
            `@.arg.channel == 'tickers' && ` +
            `@.arg.instId == '${this.id}' && ` +
            `@.data[0].instType == 'SPOT' && ` +
            `@.data[0].instId == '${this.id}')]`,
        }),
      }),
      OracleJob.Task.create({
        medianTask: OracleJob.MedianTask.create({
          tasks: [
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data[0].bidPx",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data[0].askPx",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data[0].last",
              }),
            }),
          ],
        }),
      }),
    ];
    return tasks;
  }
}
