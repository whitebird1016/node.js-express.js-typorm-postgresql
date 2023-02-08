import { MigrationInterface, QueryRunner } from "typeorm";

export class addedUserEntity1675829963121 implements MigrationInterface {
    name = 'addedUserEntity1675829963121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "address1" character varying NOT NULL, "address2" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "phone" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
