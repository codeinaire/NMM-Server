import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRecipePhotoRecipe1573019592788 implements MigrationInterface {
    name = 'AddRecipePhotoRecipe1573019592788'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "recipe_photo_type_enum" AS ENUM('standardResolution', 'lowResolution', 'thumbnail')`, undefined);
        await queryRunner.query(`CREATE TABLE "recipe_photo" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "type" "recipe_photo_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "recipeId" integer, CONSTRAINT "PK_24fe9896056c200ae6f77dfba19" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe_photo" ADD CONSTRAINT "FK_6a1db8f6d6d0a33b33c3699eb53" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe_photo" DROP CONSTRAINT "FK_6a1db8f6d6d0a33b33c3699eb53"`, undefined);
        await queryRunner.query(`DROP TABLE "recipe_photo"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_photo_type_enum"`, undefined);
    }

}
