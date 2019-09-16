import { MigrationInterface, QueryRunner } from 'typeorm'

export class BookmarkTagCount1568598583259 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bookmark_tag_count" (
        "time" TIMESTAMP NOT NULL DEFAULT now(),
        "tag" text NOT NULL,
        "count" integer NOT NULL,
        CONSTRAINT "UQ_223dd7cb08b548c699e5aee158f" UNIQUE ("tag"),
        CONSTRAINT "PK_223dd7cb08b548c699e5aee158f" PRIMARY KEY ("tag")
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bookmark_tag_count"`)
  }
}
