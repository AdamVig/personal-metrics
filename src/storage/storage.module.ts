import { Module } from '@nestjs/common'

import { EnvironmentModule } from '../environment/environment.module'
import { LoggerModule } from '../logger/logger.module'
import { TypeOrmConfig } from './typeorm-config'

@Module({
  imports: [EnvironmentModule, LoggerModule],
  providers: [TypeOrmConfig],
  exports: [TypeOrmConfig],
})
export class StorageModule {}
