import { OracleJob } from "@switchboard-xyz/v2-task-library";
import AbstractJobTemplate from "./template";

export class Bonfida extends AbstractJobTemplate {
  public id: string;

  url(): string {
    return `https://serum-api.bonfida.com/orderbooks/${this.id}`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        httpTask: OracleJob.HttpTask.create({
          url: ``,
        }),
      }),
      OracleJob.Task.create({
        medianTask: OracleJob.MedianTask.create({
          tasks: [
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data.bids[0].price",
              }),
            }),
            OracleJob.Task.create({
              jsonParseTask: OracleJob.JsonParseTask.create({
                path: "$.data.asks[0].price",
              }),
            }),
          ],
        }),
      }),
    ];
    return tasks;
  }
}
