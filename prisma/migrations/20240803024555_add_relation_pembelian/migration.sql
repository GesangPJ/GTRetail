/*
  Warnings:

  - Added the required column `pembelianId` to the `PembelianDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PembelianDetail" ADD COLUMN     "pembelianId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PembelianDetail" ADD CONSTRAINT "PembelianDetail_pembelianId_fkey" FOREIGN KEY ("pembelianId") REFERENCES "Pembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
