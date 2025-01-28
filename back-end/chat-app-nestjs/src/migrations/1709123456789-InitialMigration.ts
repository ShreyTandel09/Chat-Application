import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1709123456789 implements MigrationInterface {
  name = 'InitialMigration1709123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL PRIMARY KEY,
                "email" VARCHAR NOT NULL UNIQUE,
                "password" VARCHAR NOT NULL,
                "first_name" VARCHAR NOT NULL,
                "last_name" VARCHAR NOT NULL,
                "is_verified" BOOLEAN NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "tokens" (
                "id" SERIAL PRIMARY KEY,
                "user_id" INTEGER NOT NULL,
                "access_token" VARCHAR NOT NULL,
                "refresh_token" VARCHAR NOT NULL,
                "expires_at" TIMESTAMP NOT NULL,
                "is_revoked" BOOLEAN NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                FOREIGN KEY ("user_id") REFERENCES "users"("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
