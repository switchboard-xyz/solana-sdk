/* eslint-disable new-cap */
import type * as anchor from "@project-serum/anchor";
import { OracleJob } from "@switchboard-xyz/v2-task-library";
import { JSONPath } from "jsonpath-plus";
import Websocket from "ws-reconnect";
import {
  LoggerStrategy,
  OracleContext,
  SwitchboardTask,
  SwitchboardTaskError,
} from "../types";
import { sleep } from "../utils";

export class WebsocketTimeoutError extends SwitchboardTaskError {
  constructor() {
    super("websocket timeout", "Websocket");
  }
}

export class WebsocketCacheEmptyError extends SwitchboardTaskError {
  constructor() {
    super("websocket cache is empty", "Websocket");
  }
}

export class WebsocketTask extends SwitchboardTask {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  async run(
    wsTask: OracleJob.IWebsocketTask,
    input: undefined,
    program: anchor.Program,
    context?: OracleContext
  ): Promise<string> {
    const logger = context?.logger ?? (console as LoggerStrategy);
    const cache = context?.cache ?? undefined;

    if (cache) {
      const cacheKey = JSON.stringify(wsTask);
      try {
        const ws = this.getOrCreateWebsocket(wsTask, context);
        const wsResponse = cache.getSocketResponse(wsTask);
        if (wsResponse) return wsResponse.toString();
      } catch (error) {
        if (error.message === "websocket cache is empty") {
          logger.error(error);
          return;
        }

        throw error;
      }
    }

    // no context or failed to read from cache, create new ws
    return this.newWebSocket(wsTask);
  }

  async getOrCreateWebsocket(
    wsTask: OracleJob.IWebsocketTask,
    context: OracleContext
  ): Websocket {
    const cache = context.cache ?? undefined;
    const logger = context?.logger ?? (console as LoggerStrategy);

    // find existing task in cache
    const taskKey = JSON.stringify(wsTask);
    let tasks = cache.getSocketTasks(wsTask);
    if (!tasks) {
      tasks = new Set<string>();
      cache.setSocketTasks(wsTask, tasks);
    }

    // find ws in cache, send subscription and return ws
    const existingWs: Websocket | undefined = cache.getSocket(wsTask);
    if (existingWs) {
      if (!tasks.has(taskKey)) {
        cache.setSocketTasks(wsTask, tasks.add(taskKey));
        if (existingWs.isConnected) {
          existingWs.send(wsTask.subscription);
          logger.debug(
            `Socket ${wsTask.url} has registered subscription ${wsTask.subscription}`
          );
        }
      }

      return existingWs;
    }

    // create new ws
    cache.setSocketTasks(wsTask, tasks.add(taskKey));
    logger.debug(`Creating socket for: ${wsTask.url}`);
    const ws = new Websocket(wsTask.url, {
      retryCount: 10,
      reconnectInterval: 3,
    });
    cache.setSocket(wsTask, ws);

    ws.on("connect", () => {
      logger.debug(`Connected: ${ws.url}`);
      const tasksSet = cache.getSocketTasks(wsTask) ?? new Set<string>();
      for (const rawTask of tasksSet) {
        const task = OracleJob.WebsocketTask.create(JSON.parse(rawTask));
        ws.send(task.subscription);
        logger.debug(
          `Socket ${task.url} has registered subscription ${task.subscription}`
        );
      }
    });
    ws.on("reconnect", () => {
      logger.debug(`Reconnecting websocket for: ${ws.url}`);
      const tasksSet = cache.getSocketTasks(ws) ?? new Set<string>();
      for (const rawTask of tasksSet) {
        const task = OracleJob.WebsocketTask.create(JSON.parse(rawTask));
        ws.send(task.subscription);
        logger.debug(
          `Socket ${task.url} has registered subscription ${task.subscription}`
        );
      }
    });
    ws.on("message", (data) => {
      const tasksSet = cache.getSocketTasks(ws) ?? new Set<string>();
      for (const rawTask of tasksSet) {
        try {
          const task = OracleJob.WebsocketTask.create(JSON.parse(rawTask));
          if (
            JSONPath({ json: [JSON.parse(data)], path: task.filter }).length > 0
          ) {
            cache.setSocketResponse(task, data, task.maxDataAgeSeconds * 1000);
          }
        } catch (error) {
          logger.warn(error);
        }
      }
    });
    ws.on("destroyed", function () {
      logger.info("Destroyed: " + ws.url);
      cache.delSocket(wsTask);
      cache.delSocketTasks(wsTask);
    });
    ws.start();
    return ws;
  }

  private async newWebSocket(wsTask: OracleJob.IWebsocketTask) {
    const ws = new Websocket(wsTask.url, {
      retryCount: 10,
      reconnectInterval: 3,
    });

    ws.on("connect", () => {
      ws.send(wsTask.subscription);
    });

    let wsResponse: string | undefined;
    ws.on("message", (data) => {
      const result = JSONPath({
        json: [JSON.parse(data)],
        path: wsTask.filter,
      });
      if (result.length > 0) {
        wsResponse = data.toString();
        ws.destroy();
      }
    });

    ws.start();

    // TODO: Cleanup this logic
    // 2.5 second timeout to wait for websocket responses
    await sleep(500);
    if (wsResponse) return wsResponse;
    await sleep(500);
    if (wsResponse) return wsResponse;
    await sleep(250);
    if (wsResponse) return wsResponse;
    await sleep(250);
    if (wsResponse) return wsResponse;
    await sleep(100);
    if (wsResponse) return wsResponse;
    await sleep(100);
    if (wsResponse) return wsResponse;
    await sleep(100);
    if (wsResponse) return wsResponse;
    await sleep(100);
    if (wsResponse) return wsResponse;
    await sleep(100);
    if (wsResponse) return wsResponse;
    await sleep(500);
    if (wsResponse) return wsResponse;
    ws.destroy();
    throw new WebsocketTimeoutError();
  }
}
