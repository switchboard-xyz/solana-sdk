import { OracleJob } from "@switchboard-xyz/switchboard-api";
import AbstractJobTemplate from "./template";

export class SMB extends AbstractJobTemplate {
  url(): string {
    return `https://market.solanamonkey.business/.netlify/functions/fetchOffers`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        httpTask: {
          url: `https://market.solanamonkey.business/.netlify/functions/fetchOffers`,
        },
      }),
      OracleJob.Task.create({
        jsonParseTask: {
          path: `$.offers[?(@.price)].price`,
          aggregationMethod: OracleJob.JsonParseTask.AggregationMethod.MIN,
        },
      }),
    ];
    return tasks;
  }
}
