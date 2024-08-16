/*
  Warnings:

  - You are about to drop the column `jumlahkedatangan` on the `Kedatangan` table. All the data in the column will be lost.
  - You are about to drop the column `jumlahpesanan` on the `Kedatangan` table. All the data in the column will be lost.
  - You are about to drop the column `produkId` on the `Kedatangan` table. All the data in the column will be lost.
  - You are about to drop the column `jumlahkedatangan` on the `PembelianBermasalah` table. All the data in the column will be lost.
  - You are about to drop the column `jumlahpesanan` on the `PembelianBermasalah` table. All the data in the column will be lost.
  - You are about to drop the column `produkId` on the `PembelianBermasalah` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Kedatangan" DROP CONSTRAINT "Kedatangan_produkId_fkey";

-- DropForeignKey
ALTER TABLE "PembelianBermasalah" DROP CONSTRAINT "PembelianBermasalah_produkId_fkey";

-- AlterTable
ALTER TABLE "Kedatangan" DROP COLUMN "jumlahkedatangan",
DROP COLUMN "jumlahpesanan",
DROP COLUMN "produkId";

-- AlterTable
ALTER TABLE "PembelianBermasalah" DROP COLUMN "jumlahkedatangan",
DROP COLUMN "jumlahpesanan",
DROP COLUMN "produkId";

-- CreateTable
CREATE TABLE "DetailBermasalah" (
    "id" SERIAL NOT NULL,
    "pembelianbermasalahId" INTEGER NOT NULL,
    "produkId" INTEGER NOT NULL,
    "jumlahpesanan" INTEGER NOT NULL,
    "jumlahkedatangan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailBermasalah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KedatanganDetail" (
    "id" SERIAL NOT NULL,
    "kedatanganId" INTEGER NOT NULL,
    "produkId" INTEGER NOT NULL,
    "jumlahpesanan" INTEGER NOT NULL,
    "jumlahkedatangan" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KedatanganDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DetailBermasalah" ADD CONSTRAINT "DetailBermasalah_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KedatanganDetail" ADD CONSTRAINT "KedatanganDetail_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
