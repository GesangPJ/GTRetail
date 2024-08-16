/*
  Warnings:

  - You are about to drop the column `pembeliandetailId` on the `Kedatangan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kedatangan" DROP CONSTRAINT "Kedatangan_pembeliandetailId_fkey";

-- AlterTable
ALTER TABLE "Kedatangan" DROP COLUMN "pembeliandetailId";
