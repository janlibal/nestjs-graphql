-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('active', 'inactive');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "statusId" INTEGER NOT NULL DEFAULT 2;

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "title" "StatusEnum" NOT NULL DEFAULT 'inactive',

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
