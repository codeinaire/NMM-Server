import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateRecipeSomeItemsArray1582422028983
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "recipe" ALTER COLUMN "ingredients" TYPE text[] USING ingredients::text[]`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "recipe" ALTER COLUMN "method" TYPE text[] USING method::text[]`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "recipe" ALTER COLUMN "hashtags" TYPE text[] USING hashtags::text[]`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "recipe" ALTER COLUMN "ingredients" text NOT NULL`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "recipe" ALTER COLUMN "method" text NOT NULL`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "recipe" ALTER COLUMN "hashtags" text NOT NULL`,
      undefined
    )
  }
}
