/*
  Warnings:

  - You are about to alter the column `jumlah` on the `Pembelian` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `hargabeli` on the `Pembelian` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `totalharga` on the `Pembelian` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Pembelian" ALTER COLUMN "jumlah" SET DATA TYPE INTEGER,
ALTER COLUMN "hargabeli" SET DATA TYPE INTEGER,
ALTER COLUMN "totalharga" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Produk" ADD COLUMN     "hargabeli" INTEGER;
