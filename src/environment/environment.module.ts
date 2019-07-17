import { Module } from '@nestjs/common'

import { EnvironmentProvider } from './environment.provider'
import { LoggerModule } from '../logger/logger.module'

@Module({
  imports: [LoggerModule],
  providers: [EnvironmentProvider],
  exports: [EnvironmentProvider],
})
export class EnvironmentModule {}
