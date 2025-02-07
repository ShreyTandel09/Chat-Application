import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedMEssages1738916591197 implements MigrationInterface {
    name = 'UpdatedMEssages1738916591197'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages_history" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages_history" DROP COLUMN "deleted_at"`);
    }

}
