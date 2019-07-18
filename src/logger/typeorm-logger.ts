import { Injectable } from '@nestjs/common'
import { Logger as ITypeOrmLogger } from 'typeorm'

import { LogFactory, Logger } from './log-factory'

@Injectable()
export class TypeOrmLogger implements ITypeOrmLogger {
  private logger: Logger

  public constructor(logFactory: LogFactory) {
    this.logger = logFactory.child('TypeORM')
  }

  public logQuery(query: string, parameters?: unknown[]): void {
    this.logger.trace({ parameters }, 'query: %s', query)
  }

  public logQueryError(error: string, query: string, parameters?: unknown[]): void {
    this.logger.warn({ query, parameters }, 'query error: %s', error)
  }

  public logQuerySlow(time: number, query: string, parameters?: unknown[]): void {
    this.logger.debug({ time, parameters }, 'slow query: %s', query)
  }

  public logSchemaBuild(message: string): void {
    this.logger.debug(message)
  }

  public logMigration(message: string): void {
    this.logger.debug(message)
  }

  public log(level: 'log' | 'info' | 'warn', message: string): void {
    let loggerMethod: Logger['warn'] | Logger['info']
    if (level === 'warn') {
      loggerMethod = this.logger.warn
    } else {
      loggerMethod = this.logger.info
    }

    loggerMethod(message)
  }
}
