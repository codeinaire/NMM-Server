import { MigrationInterface, QueryRunner } from 'typeorm'

export class AllInOneMigration1582938202081 implements MigrationInterface {
  name = 'AllInOneMigration1582938202081'

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TYPE "public"."_challenge_sectionscompleted_enum" RENAME TO "challenge_sectionscompleted_enum_old"`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "challenge_sectionscompleted_enum" AS ENUM('None', 'Ingredients', 'Method', 'SharedFriendsImage', 'SharedRecipe', 'ReadArticle', 'SharedArticle', 'Motivations', 'ChallengeGoals', 'Username', 'Bio', 'LowResProfile', 'ChallengeQuote')`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "sectionsCompleted" DROP DEFAULT`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "sectionsCompleted" TYPE "challenge_sectionscompleted_enum"[] USING "sectionsCompleted"::"text"::"challenge_sectionscompleted_enum"[]`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "sectionsCompleted" SET DEFAULT '{None}'`,
      undefined
    )
    await queryRunner.query(
      `DROP TYPE "challenge_sectionscompleted_enum_old"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "completed" SET DEFAULT false`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "completed" DROP DEFAULT`,
      undefined
    )
    await queryRunner.query(
      `CREATE TYPE "challenge_sectionscompleted_enum_old" AS ENUM('None', 'Ingredients', 'Method', 'SharedFriendsImage', 'SharedRecipe', 'ReadArticle', 'SharedArticle')`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "sectionsCompleted" DROP DEFAULT`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "sectionsCompleted" TYPE "challenge_sectionscompleted_enum_old"[] USING "sectionsCompleted"::"text"::"challenge_sectionscompleted_enum_old"[]`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "challenge" ALTER COLUMN "sectionsCompleted" SET DEFAULT '{None}'`,
      undefined
    )
    await queryRunner.query(
      `DROP TYPE "challenge_sectionscompleted_enum"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TYPE "challenge_sectionscompleted_enum_old" RENAME TO  "_challenge_sectionscompleted_enum"`,
      undefined
    )
  }
}
