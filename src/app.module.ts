import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { EnvironmentModule } from './environment/environment.module'
import { HttpModule } from './http/http.module'
import { LoggerModule } from './logger/logger.module'
import { StorageModule } from './storage/storage.module'
import { TypeOrmConfig } from './storage/typeorm-config'

@Module({
  imports: [
    EnvironmentModule,
    HttpModule,
    LoggerModule,
    TypeOrmModule.forRootAsync({
      imports: [StorageModule],
      useExisting: TypeOrmConfig,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
