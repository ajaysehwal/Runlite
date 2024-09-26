/*
  Warnings:

  - The values [V1] on the enum `Verison` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Verison_new" AS ENUM ('v1');
ALTER TABLE "ApiKey" ALTER COLUMN "version" TYPE "Verison_new" USING ("version"::text::"Verison_new");
ALTER TYPE "Verison" RENAME TO "Verison_old";
ALTER TYPE "Verison_new" RENAME TO "Verison";
DROP TYPE "Verison_old";
COMMIT;
