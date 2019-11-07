import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigrations1573102890495 implements MigrationInterface {
    name = 'InitialMigrations1573102890495'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "recipe_photo_type_enum" AS ENUM('standardResolution', 'lowResolution', 'thumbnail')`, undefined);
        await queryRunner.query(`CREATE TABLE "recipe_photo" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "type" "recipe_photo_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "recipeId" integer, CONSTRAINT "PK_24fe9896056c200ae6f77dfba19" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "recipe_difficulty_enum" AS ENUM('Easy', 'Medium', 'Hard')`, undefined);
        await queryRunner.query(`CREATE TYPE "recipe_cost_enum" AS ENUM('Budget', 'Moderate', 'Expensive')`, undefined);
        await queryRunner.query(`CREATE TYPE "recipe_mealtype_enum" AS ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack')`, undefined);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "ingredients" text NOT NULL, "method" text NOT NULL, "hashtags" character varying NOT NULL, "difficulty" "recipe_difficulty_enum" NOT NULL, "cost" "recipe_cost_enum" NOT NULL, "mealType" "recipe_mealtype_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe_photo" ADD CONSTRAINT "FK_6a1db8f6d6d0a33b33c3699eb53" FOREIGN KEY ("recipeId") REFERENCES "recipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe_photo" DROP CONSTRAINT "FK_6a1db8f6d6d0a33b33c3699eb53"`, undefined);
        await queryRunner.query(`DROP TABLE "recipe"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_mealtype_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_cost_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_difficulty_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "recipe_photo"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_photo_type_enum"`, undefined);
    }

}
