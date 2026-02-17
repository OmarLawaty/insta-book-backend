import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchemaPostgres1771354608018 implements MigrationInterface {
    name = 'InitialSchemaPostgres1771354608018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "publicId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "caption" character varying NOT NULL, "tags" text NOT NULL, "location" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "imageId" integer, "creatorId" integer, CONSTRAINT "REL_34a189b53541d1ece1750cc471" UNIQUE ("imageId"), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "birthday" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "imageId" integer, CONSTRAINT "REL_5e028298e103e1694147ada69e" UNIQUE ("imageId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post_likes_user" ("postId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_91dfae767678b39354875c2894f" PRIMARY KEY ("postId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_631290356ede4fcbb402128732" ON "post_likes_user" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ec7439ad132e39ffe77fba5fed" ON "post_likes_user" ("userId") `);
        await queryRunner.query(`CREATE TABLE "post_saves_user" ("postId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_38cdce22204bd5fa1e6f0df4bc4" PRIMARY KEY ("postId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8ea82135dde11d01886029601f" ON "post_saves_user" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_197443035c7582c9d24f17f14c" ON "post_saves_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_34a189b53541d1ece1750cc4717" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5e028298e103e1694147ada69e5" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_likes_user" ADD CONSTRAINT "FK_631290356ede4fcbb4021287321" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_likes_user" ADD CONSTRAINT "FK_ec7439ad132e39ffe77fba5fed9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_saves_user" ADD CONSTRAINT "FK_8ea82135dde11d01886029601f2" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_saves_user" ADD CONSTRAINT "FK_197443035c7582c9d24f17f14cf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_saves_user" DROP CONSTRAINT "FK_197443035c7582c9d24f17f14cf"`);
        await queryRunner.query(`ALTER TABLE "post_saves_user" DROP CONSTRAINT "FK_8ea82135dde11d01886029601f2"`);
        await queryRunner.query(`ALTER TABLE "post_likes_user" DROP CONSTRAINT "FK_ec7439ad132e39ffe77fba5fed9"`);
        await queryRunner.query(`ALTER TABLE "post_likes_user" DROP CONSTRAINT "FK_631290356ede4fcbb4021287321"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5e028298e103e1694147ada69e5"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_34a189b53541d1ece1750cc4717"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_197443035c7582c9d24f17f14c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8ea82135dde11d01886029601f"`);
        await queryRunner.query(`DROP TABLE "post_saves_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ec7439ad132e39ffe77fba5fed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_631290356ede4fcbb402128732"`);
        await queryRunner.query(`DROP TABLE "post_likes_user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
