/*
  Warnings:

  - You are about to drop the column `statusId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Status` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_statusId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "statusId";

-- DropTable
DROP TABLE "Status";

-- DropEnum
DROP TYPE "StatusEnum";
