import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1733241068113 implements MigrationInterface {
    name = 'Migration1733241068113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "deletedAt"`);
    }

}
