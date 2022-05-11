import { CliConfig, DEFAULT_CONFIG } from "../../config";
import { FsProvider } from "./FsProvider";
import { DEFAULT_LOGGER, LogProvider } from "./logging";

export interface CommandContext {
  logger: LogProvider;
  fs?: FsProvider;
  config: CliConfig;
}

export const DEFAULT_CONTEXT: CommandContext = {
  logger: DEFAULT_LOGGER,
  config: DEFAULT_CONFIG,
};
