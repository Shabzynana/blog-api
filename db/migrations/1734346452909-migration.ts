import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1734346452909 implements MigrationInterface {
    name = 'Migration1734346452909'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_verified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_verified_date" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified_date"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_verified"`);
    }

}
