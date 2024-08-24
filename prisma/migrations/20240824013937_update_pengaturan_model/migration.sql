/*
  Warnings:

  - Added the required column `updatedAt` to the `Pengaturan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Pengaturan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pengaturan" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Pengaturan" ADD CONSTRAINT "Pengaturan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
