import { createLogger, format, transports, Logger } from 'winston';
import { Format } from 'logform';

class LoggerService {
  private logger: Logger;

  constructor() {
    const logFormat: Format = format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(
        (info) => `[${info.timestamp}] (${info.level}): ${info.message}`,
      ),
    );

    this.logger = createLogger({
      level: 'info',
      format: logFormat,
      transports: [
        new transports.Console({
          format: format.combine(format.colorize(), logFormat),
        }),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
      ],
      exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' }),
      ],
    });

    // Environments other than production
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), logFormat),
        }),
      );
    }
  }

  log(level: string, message: string, metadata?: Record<string, any>): void {
    this.logger.log({ level, message, ...metadata });
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.logger.info(message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.logger.warn(message, metadata);
  }

  error(message: string, error?: Error): void {
    this.logger.error(message, { error: error?.stack || error });
  }
}

export const logger = new LoggerService();
