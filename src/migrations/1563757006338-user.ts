import { MigrationInterface, QueryRunner } from 'typeorm'

import { LogFactory } from '../logger/log-factory'
import { EnvironmentProvider } from '../environment/environment.provider'

export class User1563757006338 implements MigrationInterface {
  private env = new EnvironmentProvider(new LogFactory())

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE USER "${this.env.get('DB_USER_READONLY')}" WITH PASSWORD '${this.env.get(
        'DB_PASSWORD_READONLY',
      )}'`,
    )
    await queryRunner.query(
      `GRANT SELECT ON ALL TABLES IN SCHEMA public TO "${this.env.get(
        'DB_USER_READONLY',
      )}"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // https://stackoverflow.com/a/3023840/1850656
    await queryRunner.query(
      `REASSIGN OWNED BY "${this.env.get('DB_USER_READONLY')}" TO "${this.env.get(
        'DB_USER',
      )}"`,
    )
    await queryRunner.query(`DROP OWNED BY "${this.env.get('DB_USER_READONLY')}"`)
    await queryRunner.query(`DROP USER "${this.env.get('DB_USER_READONLY')}"`)
  }
}
