/*
  Warnings:

  - You are about to drop the column `userId` on the `Pengaturan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pengaturan" DROP CONSTRAINT "Pengaturan_userId_fkey";

-- AlterTable
ALTER TABLE "Pengaturan" DROP COLUMN "userId";
