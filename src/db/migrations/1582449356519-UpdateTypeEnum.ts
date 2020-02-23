import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateTypeEnum1582449356519 implements MigrationInterface {
  name = 'UpdateTypeEnum1582449356519'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TYPE "public"."challenge_type_enum" RENAME TO "challenge_type_enum_old"`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "challenge_type_enum" AS ENUM('Recipe', 'Article', 'User Profile')`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "type" DROP DEFAULT`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "type" TYPE "challenge_type_enum" USING "type"::"text"::"challenge_type_enum"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "type" SET DEFAULT 'Recipe'`,
      undefined
    )
    await queryRunner.query(`DROP TYPE "challenge_type_enum_old"`, undefined)
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TYPE "challenge_type_enum_old" AS ENUM('Recipe', 'Article')`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "type" DROP DEFAULT`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "type" TYPE "challenge_type_enum_old" USING "type"::"text"::"challenge_type_enum_old"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "type" SET DEFAULT 'Recipe'`,
      undefined
    )
    await queryRunner.query(`DROP TYPE "challenge_type_enum"`, undefined)
    await queryRunner.query(
      `ALTER TYPE "challenge_type_enum_old" RENAME TO  "challenge_type_enum"`,
      undefined
    )
  }
}
