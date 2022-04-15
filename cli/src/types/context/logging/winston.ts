import * as winston from "winston";
import type { LoggerParameters } from ".";

export class WinstonLogger {
  public logger: winston.Logger;

  constructor(parameters: LoggerParameters) {
    // file logger formatter
    const format = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
      // winston.format.printf((info) => {
      //   return JSON.stringify({
      //     timestamp: info.timestamp,
      //     level: info.level,
      //     service: info.service,
      //     message: info.message.replace(/[^\s\w]/gi, ""),
      //   });
      // })
    );
    const transports: winston.transport[] = [];

    if (parameters.file && parameters.file.filename) {
      transports.push(
        new winston.transports.File({
          filename: parameters.file.filename,
          level: "debug",
          format: format,
        })
      );
    }

    if (parameters.console) {
      transports.push(
        new winston.transports.Console({
          level: parameters.console.level || "info",
          format: winston.format.printf((info) => `${info.message}`),
        })
      );
    }

    this.logger = winston.createLogger({
      transports,
      defaultMeta: { service: "js_sbv2_cli" },
    });
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
