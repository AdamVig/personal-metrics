import { Injectable } from '@nestjs/common'
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { join } from 'path'
import { writeFile } from 'fs'
import { promisify } from 'util'

import { EnvironmentProvider } from '../environment/environment.provider'
import { TypeOrmLogger } from '../logger/typeorm-logger'

const fsWriteFile = promisify(writeFile)

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  public constructor(
    private readonly env: EnvironmentProvider,
    private readonly logger: TypeOrmLogger,
  ) {}

  public async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const options: TypeOrmModuleOptions = {
      type: 'postgres',
      host: 'localhost',
      port: Number(this.env.get('DB_PORT')),
      username: this.env.get('DB_USER'),
      password: this.env.get('DB_PASSWORD'),
      // The Postgres Docker container automatically creates a database for the configured user
      database: this.env.get('DB_USER'),
      entities: [join(__dirname, '..', '/**/*.entity.*')],
      migrationsRun: true,
      migrations: [join(__dirname, '..', 'migrations/*')],
    }

    await fsWriteFile(
      join(__dirname, '../..', 'ormconfig.json'),
      JSON.stringify(options, null, 2),
    )

    // Some options should not be serialized to the file
    return {
      ...options,
      logger: this.logger,
    }
  }
}
