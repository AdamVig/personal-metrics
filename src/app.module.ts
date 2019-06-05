import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { EnvironmentModule } from './environment/environment.module'
import { LoggerModule } from './logger/logger.module'

@Module({
  imports: [EnvironmentModule, LoggerModule],
  controllers: [AppController],
})
export class AppModule {}
