-- CreateEnum
CREATE TYPE "ProviderEnum" AS ENUM ('email', 'apple', 'facebook', 'twitter', 'google');

-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "title" "StatusEnum" NOT NULL DEFAULT 'inactive',

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "ProviderEnum" NOT NULL DEFAULT 'email',
    "statusId" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
