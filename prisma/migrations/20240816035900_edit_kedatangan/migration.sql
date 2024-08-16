/*
  Warnings:

  - You are about to drop the column `notes` on the `Kedatangan` table. All the data in the column will be lost.
  - You are about to drop the column `receivedBy` on the `Kedatangan` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalkedatangan` on the `Kedatangan` table. All the data in the column will be lost.
  - You are about to drop the `KedatanganDetail` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jumlahkedatangan` to the `Kedatangan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jumlahpesanan` to the `Kedatangan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kodepembelian` to the `Kedatangan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `produkId` to the `Kedatangan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Kedatangan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Kedatangan" DROP CONSTRAINT "Kedatangan_receivedBy_fkey";

-- DropForeignKey
ALTER TABLE "KedatanganDetail" DROP CONSTRAINT "KedatanganDetail_produkId_fkey";

-- AlterTable
ALTER TABLE "Kedatangan" DROP COLUMN "notes",
DROP COLUMN "receivedBy",
DROP COLUMN "tanggalkedatangan",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "jumlahkedatangan" INTEGER NOT NULL,
ADD COLUMN     "jumlahpesanan" INTEGER NOT NULL,
ADD COLUMN     "kodepembelian" TEXT NOT NULL,
ADD COLUMN     "produkId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- DropTable
DROP TABLE "KedatanganDetail";

-- AddForeignKey
ALTER TABLE "Kedatangan" ADD CONSTRAINT "Kedatangan_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
