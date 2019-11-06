import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSToHashtagRecipe1572857763666 implements MigrationInterface {
    name = 'AddSToHashtagRecipe1572857763666'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe" RENAME COLUMN "hashtag" TO "hashtags"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe" RENAME COLUMN "hashtags" TO "hashtag"`, undefined);
    }

}
