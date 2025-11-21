import { ILogger } from "../ports/outbound/logger.js";

export class ConsoleLogger implements ILogger {
  info(message: string, context?: Record<string, unknown>): void {
    console.info(message, context ?? {});
  }

  warn(message: string, context?: Record<string, unknown>): void {
    console.warn(message, context ?? {});
  }

  error(message: string, context?: Record<string, unknown>): void {
    console.error(message, context ?? {});
  }
}
