import { OracleJob } from "@switchboard-xyz/switchboard-v2";

abstract class AbstractJobTemplate {
  public id: string;

  constructor(id: string) {
    this.id = id ?? "";
  }

  abstract url(): string;

  abstract tasks(verify?: boolean): Promise<OracleJob.Task[]>;
}

export default AbstractJobTemplate;
