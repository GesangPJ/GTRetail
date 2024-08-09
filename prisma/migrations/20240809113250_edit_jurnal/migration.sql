/*
  Warnings:

  - You are about to drop the `JurnalPembelian` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `JurnalTransaksi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "JurnalPembelian" DROP CONSTRAINT "JurnalPembelian_pembelianId_fkey";

-- DropForeignKey
ALTER TABLE "JurnalTransaksi" DROP CONSTRAINT "JurnalTransaksi_transaksiId_fkey";

-- DropTable
DROP TABLE "JurnalPembelian";

-- DropTable
DROP TABLE "JurnalTransaksi";

-- CreateTable
CREATE TABLE "Jurnal" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "akun" TEXT NOT NULL,
    "transaksiId" INTEGER,
    "pembelianId" INTEGER,
    "debit" INTEGER,
    "kredit" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jurnal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Jurnal" ADD CONSTRAINT "Jurnal_pembelianId_fkey" FOREIGN KEY ("pembelianId") REFERENCES "Pembelian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jurnal" ADD CONSTRAINT "Jurnal_transaksiId_fkey" FOREIGN KEY ("transaksiId") REFERENCES "Transaksi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
