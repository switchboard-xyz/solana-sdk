/* eslint-disable no-promise-executor-return */
export const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

export const callWithRetry = async (function_, depth = 0) => {
  try {
    return function_();
  } catch (error) {
    if (depth > 7) {
      throw error;
    }

    await sleep(2 ** depth * 10);

    return callWithRetry(function_, depth + 1);
  }
};
