import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveRecipePhoto1573521605787 implements MigrationInterface {
    name = 'RemoveRecipePhoto1573521605787'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe" ADD "lowResolution" character varying NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "standardResolution" character varying NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "standardResolution"`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "lowResolution"`, undefined);
    }

}
