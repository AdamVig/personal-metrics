import { MigrationInterface, QueryRunner } from 'typeorm'

export class BookmarkCount1564022868147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bookmark_count" (
        "time" TIMESTAMP NOT NULL DEFAULT now(),
        "total" integer NOT NULL,
        "unread" integer NOT NULL,
        "private" integer NOT NULL,
        CONSTRAINT "PK_5f40d9759244a1a76a7266d06f7" PRIMARY KEY ("time")
      )`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "bookmark_count"`)
  }
}
