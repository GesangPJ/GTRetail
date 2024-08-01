/*
  Warnings:

  - You are about to alter the column `jumlahTotal` on the `Transaksi` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `harga` on the `TransaksiDetail` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `total` on the `TransaksiDetail` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Transaksi" ALTER COLUMN "pelangganId" SET DEFAULT 0,
ALTER COLUMN "jumlahTotal" DROP DEFAULT,
ALTER COLUMN "jumlahTotal" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "TransaksiDetail" ALTER COLUMN "harga" SET DATA TYPE INTEGER,
ALTER COLUMN "total" SET DATA TYPE INTEGER;
