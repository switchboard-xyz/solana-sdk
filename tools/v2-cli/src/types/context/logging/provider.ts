import { WinstonLogger } from "./winston";

export type LogLevel =
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "config"
  | "output";

export interface LoggerStrategy {
  log(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

export interface ConsoleParameters {
  level?: LogLevel;
}

export interface FileParameters {
  level: LogLevel;
  filename: string;
}

export interface LoggerParameters {
  console?: ConsoleParameters | false;
  file?: FileParameters | false;
  silent?: boolean;
  verbose?: boolean;
}

export class LogProvider implements LoggerStrategy {
  public logger: LoggerStrategy;

  public silent = false;

  public verbose = false;

  constructor(parameters: LoggerParameters) {
    this.logger = new WinstonLogger(parameters);
    this.silent = parameters.silent;
    this.verbose = parameters.verbose;
  }

  public log(message: string) {
    this.logger.info(message);
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public warn(message: string) {
    this.logger.warn(message);
  }

  public error(message: string) {
    this.logger.error(message);
  }

  public debug(message: string) {
    this.logger.debug(message);
  }
}

export const CONSOLE_ONLY_LOGGER: LoggerParameters = {
  console: { level: "info" },
};

export const DEFAULT_LOGGER = new LogProvider(CONSOLE_ONLY_LOGGER);
