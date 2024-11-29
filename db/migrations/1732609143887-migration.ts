import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1732609143887 implements MigrationInterface {
    name = 'Migration1732609143887'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_followers" ("followerId" uuid NOT NULL, "followingId" uuid NOT NULL, CONSTRAINT "PK_fb5cff70c10f57282caec64ecf0" PRIMARY KEY ("followerId", "followingId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c3f56a3157b50bc8adcc6acf27" ON "user_followers" ("followerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b319cdc26936df06bca3feb3bc" ON "user_followers" ("followingId") `);
        await queryRunner.query(`ALTER TABLE "user_followers" ADD CONSTRAINT "FK_c3f56a3157b50bc8adcc6acf278" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_followers" ADD CONSTRAINT "FK_b319cdc26936df06bca3feb3bc2" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_followers" DROP CONSTRAINT "FK_b319cdc26936df06bca3feb3bc2"`);
        await queryRunner.query(`ALTER TABLE "user_followers" DROP CONSTRAINT "FK_c3f56a3157b50bc8adcc6acf278"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b319cdc26936df06bca3feb3bc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c3f56a3157b50bc8adcc6acf27"`);
        await queryRunner.query(`DROP TABLE "user_followers"`);
    }

}
