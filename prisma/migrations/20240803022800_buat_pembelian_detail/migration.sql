/*
  Warnings:

  - You are about to drop the column `hargabeli` on the `Pembelian` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah` on the `Pembelian` table. All the data in the column will be lost.
  - You are about to drop the column `produkId` on the `Pembelian` table. All the data in the column will be lost.
  - You are about to drop the column `totalharga` on the `Pembelian` table. All the data in the column will be lost.
  - Added the required column `jumlahtotalharga` to the `Pembelian` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pembelian" DROP CONSTRAINT "Pembelian_produkId_fkey";

-- AlterTable
ALTER TABLE "Pembelian" DROP COLUMN "hargabeli",
DROP COLUMN "jumlah",
DROP COLUMN "produkId",
DROP COLUMN "totalharga",
ADD COLUMN     "jumlahtotalharga" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PembelianDetail" (
    "id" SERIAL NOT NULL,
    "produkId" INTEGER NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "hargabeli" INTEGER NOT NULL,
    "satuan" TEXT,
    "total" INTEGER NOT NULL,

    CONSTRAINT "PembelianDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PembelianDetail" ADD CONSTRAINT "PembelianDetail_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
