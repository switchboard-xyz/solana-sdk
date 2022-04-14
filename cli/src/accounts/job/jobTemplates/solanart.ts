import { OracleJob } from "@switchboard-xyz/v2-task-library";

export function solanartFloorPrice(projectId: string): Array<OracleJob.Task> {
  return [
    OracleJob.Task.create({
      httpTask: {
        url: `https://jmccmlyu33.medianetwork.cloud/nft_for_sale?collection=${projectId}`,
      },
    }),
    OracleJob.Task.create({
      jsonParseTask: {
        path: `$[?(@.price)].price`,
        aggregationMethod: OracleJob.JsonParseTask.AggregationMethod.MIN,
      },
    }),
  ];
}
