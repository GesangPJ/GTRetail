/*
  Warnings:

  - You are about to drop the column `satuan` on the `PembelianDetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pembelian" ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "PembelianDetail" DROP COLUMN "satuan";
