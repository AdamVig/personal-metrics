import { Injectable, LoggerService } from '@nestjs/common';

import { LogFactory, Logger } from './log-factory';

@Injectable()
export class NestLogger implements LoggerService {
  private logger: Logger;

  constructor(logFactory: LogFactory) {
    this.logger = logFactory.child('Nest');
  }

  error(message: any, trace?: string, context?: string): void {
    this.logger.error(message, trace, context)
  }

  log(message: any, context?: string): void {
    this.logger.info(message, context)
  }

  warn(message: any, context?: string): void {
    this.logger.warn(message, context)
  }

  debug(message: any, context?: string): void {
    this.logger.debug(message, context)
  }

  verbose(message: any, context?: string): void {
    this.logger.verbose(message, context)
  }

  private static getLogger(): Logger {
    return new LogFactory().child('Nest')
  }

  static log(message: any, context?: string): void {
    NestLogger.getLogger().info(message, context)
  }

  static error(message: any, trace?: string, context?: string): void {
    NestLogger.getLogger().error(message, trace, context)
  }

  static warn(message: any, context?: string): void {
    NestLogger.getLogger().warn(message, context)
  }

  static debug(message: any, context?: string): void {
    NestLogger.getLogger().debug(message, context)
  }

  static verbose(message: any, context?: string): void {
    NestLogger.getLogger().verbose(message, context)
  }

}
