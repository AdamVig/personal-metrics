import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { join } from 'path'

import { EnvironmentProvider } from '../environment/environment.provider'
import { TypeOrmLogger } from '../logger/typeorm-logger'

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  public constructor(
    private readonly env: EnvironmentProvider,
    private readonly logger: TypeOrmLogger,
  ) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: 'localhost',
      port: Number(this.env.get('DB_PORT')),
      username: this.env.get('DB_USER'),
      password: this.env.get('DB_PASSWORD'),
      // The Postgres Docker container automatically creates a database for the configured user
      database: this.env.get('DB_USER'),
      entities: [join(__dirname, '..', '/**/*.entity.ts')],
      migrationsRun: true,
      migrations: [join(__dirname, '..', 'migrations')],
      logger: this.logger,
    }
  }
}
