/*
  Warnings:

  - Added the required column `pembelianId` to the `PembelianBermasalah` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PembelianBermasalah" ADD COLUMN     "pembelianId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "PembelianBermasalah" ADD CONSTRAINT "PembelianBermasalah_pembelianId_fkey" FOREIGN KEY ("pembelianId") REFERENCES "Pembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
