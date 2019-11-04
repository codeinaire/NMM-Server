import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreateUpdateColumnsRecipe1572853509499 implements MigrationInterface {
    name = 'AddCreateUpdateColumnsRecipe1572853509499'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "updatedAt"`, undefined);
        await queryRunner.query(`ALTER TABLE "recipe" DROP COLUMN "createdAt"`, undefined);
    }

}
