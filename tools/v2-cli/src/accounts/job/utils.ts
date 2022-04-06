import { OracleJob } from "@switchboard-xyz/switchboard-api";
import { URL } from "url";

export const getUrlFromTask = (job: OracleJob): string => {
  const { tasks } = job;
  const firstTask = tasks[0];
  const jobUrl: string = firstTask.httpTask
    ? firstTask.httpTask.url
    : firstTask.websocketTask
    ? firstTask.websocketTask.url
    : "";
  if (jobUrl === "") return jobUrl;
  const parsedUrl = new URL(jobUrl);
  return parsedUrl.hostname;
};
