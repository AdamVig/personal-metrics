import { Injectable, LoggerService } from '@nestjs/common'

import { LogFactory, Logger } from './log-factory'

@Injectable()
export class NestLogger implements LoggerService {
  private logger: Logger

  public constructor(logFactory: LogFactory) {
    this.logger = logFactory.child('Nest')
  }

  public error(message: object, trace?: string, context?: string): void {
    this.logger.error(message, trace, context)
  }

  public log(message: object, context?: string): void {
    this.logger.info(message, context)
  }

  public warn(message: object, context?: string): void {
    this.logger.warn(message, context)
  }

  public debug(message: object, context?: string): void {
    this.logger.debug(message, context)
  }

  public verbose(message: object, context?: string): void {
    this.logger.verbose(message, context)
  }

  private static getLogger(): Logger {
    return new LogFactory().child('Nest')
  }

  public static log(message: object, context?: string): void {
    NestLogger.getLogger().info(message, context)
  }

  public static error(message: object, trace?: string, context?: string): void {
    NestLogger.getLogger().error(message, trace, context)
  }

  public static warn(message: object, context?: string): void {
    NestLogger.getLogger().warn(message, context)
  }

  public static debug(message: object, context?: string): void {
    NestLogger.getLogger().debug(message, context)
  }

  public static verbose(message: object, context?: string): void {
    NestLogger.getLogger().verbose(message, context)
  }
}
