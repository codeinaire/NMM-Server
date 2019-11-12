import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateRecipePhotoEnum1573442890799 implements MigrationInterface {
    name = 'UpdateRecipePhotoEnum1573442890799'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TYPE "public"."recipe_photo_type_enum" RENAME TO "recipe_photo_type_enum_old"`, undefined);
        await queryRunner.query(`CREATE TYPE "recipe_photo_type_enum" AS ENUM('StandardResolution', 'LowResolution', 'Thumbnail')`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe_photo" ALTER COLUMN "type" TYPE "recipe_photo_type_enum" USING "type"::"text"::"recipe_photo_type_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_photo_type_enum_old"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "recipe_photo_type_enum_old" AS ENUM('standardResolution', 'lowResolution', 'thumbnail')`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe_photo" ALTER COLUMN "type" TYPE "recipe_photo_type_enum_old" USING "type"::"text"::"recipe_photo_type_enum_old"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_photo_type_enum"`, undefined);
        await queryRunner.query(`ALTER TYPE "recipe_photo_type_enum_old" RENAME TO  "recipe_photo_type_enum"`, undefined);
    }

}
