export const sleep = (ms: number): Promise<any> =>
  new Promise((s) => setTimeout(s, ms));

export async function promiseWithTimeout<T>(
  ms: number,
  promise: Promise<T>,
  timeoutError = new Error("timeoutError")
): Promise<T> {
  // create a promise that rejects in milliseconds
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(timeoutError);
    }, ms);
  });

  return Promise.race<T>([promise, timeout]);
}
