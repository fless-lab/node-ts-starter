import { createLogger, format, transports, Logger } from 'winston';
import { Format } from 'logform';
import config from '../../../config';

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
    if (!config.runningProd) {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), logFormat),
        }),
      );
    }
  }

  log(level: string, message: string): void {
    this.logger.log({ level, message });
  }

  info(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string): void {
    this.logger.error(message);
  }
}

export const logger = new LoggerService();
