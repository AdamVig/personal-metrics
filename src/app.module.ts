import { Module, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { HelmetMiddleware } from '@nest-middlewares/helmet'

import { AppController } from './app.controller'
import { EnvironmentModule } from './environment/environment.module'
import { HttpModule } from './http/http.module'
import { LoggerModule } from './logger/logger.module'
import { MonitorsModule } from './monitors/monitors.module'
import { StorageModule } from './storage/storage.module'
import { TypeOrmConfig } from './storage/typeorm-config'

@Module({
  imports: [
    EnvironmentModule,
    HttpModule,
    LoggerModule,
    MonitorsModule,
    TypeOrmModule.forRootAsync({
      imports: [StorageModule],
      useExisting: TypeOrmConfig,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HelmetMiddleware).forRoutes('*')
  }
}
