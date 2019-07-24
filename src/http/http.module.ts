import { Module } from '@nestjs/common'

import { Http } from './http'
import { LoggerModule } from '../logger/logger.module'

@Module({
  imports: [LoggerModule],
  providers: [Http],
  exports: [Http],
})
export class HttpModule {}
