/*
  Warnings:

  - Changed the type of `version` on the `ApiKey` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Version" AS ENUM ('v1');

-- AlterTable
ALTER TABLE "ApiKey" DROP COLUMN "version",
ADD COLUMN     "version" "Version" NOT NULL;

-- DropEnum
DROP TYPE "Verison";
