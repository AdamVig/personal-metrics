import { MigrationInterface, QueryRunner } from 'typeorm'

export class TaskRun1568428837309 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_run" (
        "time" TIMESTAMP NOT NULL DEFAULT now(),
        "id" text NOT NULL,
        "monitor_name" text NOT NULL,
        "success" boolean NOT NULL,
        CONSTRAINT "PK_edc9beb0c71827833e369601e26" PRIMARY KEY ("time")
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task_run"`)
  }
}
