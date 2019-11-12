import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCascadeOption1573435108415 implements MigrationInterface {
    name = 'UpdateCascadeOption1573435108415'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe_attribution" ADD "email" character varying NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe_attribution" DROP COLUMN "email"`, undefined);
    }

}
