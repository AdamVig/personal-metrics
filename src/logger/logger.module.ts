import { Module } from '@nestjs/common'

import { LogFactory } from './log-factory'
import { NestLogger } from './nest-logger'
import { TypeOrmLogger } from './typeorm-logger'

@Module({
  providers: [LogFactory, NestLogger, TypeOrmLogger],
  exports: [LogFactory, NestLogger, TypeOrmLogger],
})
export class LoggerModule {}
