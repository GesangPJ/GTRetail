/*
  Warnings:

  - You are about to drop the column `pembeliandetailId` on the `PembelianBermasalah` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PembelianBermasalah" DROP CONSTRAINT "PembelianBermasalah_pembeliandetailId_fkey";

-- AlterTable
ALTER TABLE "PembelianBermasalah" DROP COLUMN "pembeliandetailId";
