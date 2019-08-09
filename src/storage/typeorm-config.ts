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

    if (this.env.get('NODE_ENV') !== 'production') {
      await this.writeOrmConfig(options)
    }

    // Some options should not be serialized to the file
    return {
      ...options,
      logger: this.logger,
    }
  }

  /** Write the configuration to a file for use with the TypeORM CLI. */
  private async writeOrmConfig(options: TypeOrmModuleOptions): Promise<void> {
    await fsWriteFile(
      join(__dirname, '../..', 'ormconfig.json'),
      JSON.stringify(options, null, 2),
    )
  }
}
