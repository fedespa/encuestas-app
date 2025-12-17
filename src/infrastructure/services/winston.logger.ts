import type { ILoggerService } from "../../application/services/logger.service.js";
import { createLogger, format, transports } from "winston";

export class WinstonLogger implements ILoggerService {
  private logger = createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json()
    ),
    transports: [new transports.Console()],
  });

  info(message: string, meta?: any): void {
    this.logger.info(message, meta);
  }
  warn(message: string, meta?: any): void {
    this.logger.warn(message, meta);
  }
  error(message: string, meta?: any): void {
    this.logger.error(message, meta);
  }
}
