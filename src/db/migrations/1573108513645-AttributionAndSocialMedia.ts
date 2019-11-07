import {MigrationInterface, QueryRunner} from "typeorm";

export class AttributionAndSocialMedia1573108513645 implements MigrationInterface {
    name = 'AttributionAndSocialMedia1573108513645'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "attribution_social_media" ("id" SERIAL NOT NULL, "facebook" character varying DEFAULT 'No Facebook details available.', "instragram" character varying DEFAULT 'No Instagram details available.', "twitter" character varying DEFAULT 'No Twitter details available', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_06177990940ce4f86bf1e175850" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "recipe_attribution" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "website" character varying DEFAULT 'No website details available.', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "attributionSocialMediaId" integer, CONSTRAINT "REL_3aee4e50be9eda35def890b40f" UNIQUE ("attributionSocialMediaId"), CONSTRAINT "PK_bfbfc1974499381d97110b472e8" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "attributionId" integer`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "UQ_ab1e01d977113ec35c331c89a68" UNIQUE ("attributionId")`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe_attribution" ADD CONSTRAINT "FK_3aee4e50be9eda35def890b40f7" FOREIGN KEY ("attributionSocialMediaId") REFERENCES "attribution_social_media"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" ADD CONSTRAINT "FK_ab1e01d977113ec35c331c89a68" FOREIGN KEY ("attributionId") REFERENCES "recipe_attribution"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "FK_ab1e01d977113ec35c331c89a68"`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe_attribution" DROP CONSTRAINT "FK_3aee4e50be9eda35def890b40f7"`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" DROP CONSTRAINT "UQ_ab1e01d977113ec35c331c89a68"`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "attributionId"`, undefined);
        await queryRunner.query(`DROP TABLE "recipe_attribution"`, undefined);
        await queryRunner.query(`DROP TABLE "attribution_social_media"`, undefined);
    }

}
