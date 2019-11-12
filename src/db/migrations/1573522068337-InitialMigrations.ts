import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigrations1573522068337 implements MigrationInterface {
    name = 'InitialMigrations1573522068337'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "attribution_social_media" ("id" SERIAL NOT NULL, "facebook" character varying DEFAULT 'No Facebook details available.', "instragram" character varying DEFAULT 'No Instagram details available.', "twitter" character varying DEFAULT 'No Twitter details available', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_06177990940ce4f86bf1e175850" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "recipe_attribution" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "website" character varying DEFAULT 'No website details available.', "email" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attributionSocialMediaId" integer, CONSTRAINT "REL_3aee4e50be9eda35def890b40f" UNIQUE ("attributionSocialMediaId"), CONSTRAINT "PK_bfbfc1974499381d97110b472e8" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "recipe_difficulty_enum" AS ENUM('Easy', 'Medium', 'Hard')`, undefined);
        await queryRunner.query(`CREATE TYPE "recipe_cost_enum" AS ENUM('Budget', 'Moderate', 'Expensive')`, undefined);
        await queryRunner.query(`CREATE TYPE "recipe_mealtype_enum" AS ENUM('Breakfast', 'Lunch', 'Dinner', 'Snack')`, undefined);
        await queryRunner.query(`CREATE TABLE "recipe" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "ingredients" text NOT NULL, "method" text NOT NULL, "hashtags" character varying NOT NULL, "difficulty" "recipe_difficulty_enum" NOT NULL, "cost" "recipe_cost_enum" NOT NULL, "mealType" "recipe_mealtype_enum" NOT NULL, "lowResolution" character varying NOT NULL, "standardResolution" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attributionId" integer, CONSTRAINT "REL_ab1e01d977113ec35c331c89a6" UNIQUE ("attributionId"), CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe_attribution" ADD CONSTRAINT "FK_3aee4e50be9eda35def890b40f7" FOREIGN KEY ("attributionSocialMediaId") REFERENCES "attribution_social_media"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "FK_ab1e01d977113ec35c331c89a68" FOREIGN KEY ("attributionId") REFERENCES "recipe_attribution"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "FK_ab1e01d977113ec35c331c89a68"`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe_attribution" DROP CONSTRAINT "FK_3aee4e50be9eda35def890b40f7"`, undefined);
        await queryRunner.query(`DROP TABLE "recipe"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_mealtype_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_cost_enum"`, undefined);
        await queryRunner.query(`DROP TYPE "recipe_difficulty_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "recipe_attribution"`, undefined);
        await queryRunner.query(`DROP TABLE "attribution_social_media"`, undefined);
    }

}
