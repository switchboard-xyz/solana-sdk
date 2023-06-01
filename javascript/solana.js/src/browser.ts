/**
 * Returns true if being run inside a web browser, false if in a Node process or electron app.
 *
 * Taken from @coral-xyz/anchor implementation.
 */
export const isBrowser =
  process.env.ANCHOR_BROWSER ||
  (typeof window !== "undefined" && !window.process?.hasOwnProperty("type")); // eslint-disable-line no-prototype-builtins
