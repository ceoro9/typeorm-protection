import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitUserEntity1604838726529 implements MigrationInterface {
  name = 'InitUserEntity1604838726529';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "firstName" json,
        "lastName" json,
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
