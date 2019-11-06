import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialRecipe1572851628610 implements MigrationInterface {
    name = 'InitialRecipe1572851628610'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TYPE "recipe_difficulty_enum" AS ENUM('EASY', 'MEDIUM', 'HARD')`, undefined);
        await queryRunner.query(`CREATE TYPE "recipe_cost_enum" AS ENUM('BUDGET', 'MODERATE', 'Expensive')`, undefined);
        await queryRunner.query(`CREATE TYPE "recipe_mealtype_enum" AS ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK')`, undefined);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "hashtag" character varying NOT NULL, "difficulty" "recipe_difficulty_enum" NOT NULL, "cost" "recipe_cost_enum" NOT NULL, "mealType" "recipe_mealtype_enum" NOT NULL, "thumbnail" json NOT NULL, "lowResolution" json NOT NULL, "standardResolution" json NOT NULL, CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "recipe"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_mealtype_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_cost_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_difficulty_enum"`, undefined);
    }

}
