import { OracleJob } from "@switchboard-xyz/switchboard-api";
import AbstractJobTemplate from "./template";

export class SaberLp extends AbstractJobTemplate {
  url(): string {
    return `${this.id}`;
  }

  async tasks(): Promise<OracleJob.Task[]> {
    const tasks = [
      OracleJob.Task.create({
        lpTokenPriceTask: OracleJob.LpTokenPriceTask.create({
          saberPoolAddress: this.url(),
        }),
      }),
    ];
    return tasks;
  }
}
