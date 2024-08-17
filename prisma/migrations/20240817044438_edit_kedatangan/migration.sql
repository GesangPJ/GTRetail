/*
  Warnings:

  - Added the required column `pembelianId` to the `Kedatangan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kedatangan" ADD COLUMN     "pembelianId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Kedatangan" ADD CONSTRAINT "Kedatangan_pembelianId_fkey" FOREIGN KEY ("pembelianId") REFERENCES "Pembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
