import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIngreMethodColumns1572853025178 implements MigrationInterface {
    name = 'AddIngreMethodColumns1572853025178'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe" ADD "ingredients" text NOT NULL`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "method" text NOT NULL`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "method"`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "ingredients"`, undefined);
    }

}
