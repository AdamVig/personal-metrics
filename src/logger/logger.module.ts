import { Module } from '@nestjs/common'

import { LogFactory } from './log-factory'
import { NestLogger } from './nest-logger'

@Module({
  providers: [LogFactory, NestLogger],
  exports: [LogFactory],
})
export class LoggerModule {}
