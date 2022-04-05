import type * as anchor from "@project-serum/anchor";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import fetch from "node-fetch";
import { OracleContext, SwitchboardTask, SwitchboardTaskError } from "../types";

export class HttpStatusError extends SwitchboardTaskError {
  constructor(status: number) {
    super(`Error (Status=${status})`, "Http");
  }
}

export class HttpTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    httpTask: OracleJob.IHttpTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<string> {
    const url: string = this.variableExpand(httpTask.url ?? "", {});
    const headers: Record<string, string> = {};
    for (const header of httpTask.headers ?? []) {
      headers[header.key ?? ""] = this.variableExpand(header.value ?? "", {});
    }

    const body: string = httpTask.body ?? "";

    const isPost = httpTask.method === OracleJob.HttpTask.Method.METHOD_POST;
    const requestSpec = {
      method: isPost ? "POST" : "GET",
      body: isPost ? body : undefined,
      headers: headers,
      timeout: 2 * 1000,
    };

    const response = await fetch(url, requestSpec);
    if (!response.ok) {
      throw new HttpStatusError(response.status);
    }

    return response.text();
  }
}
