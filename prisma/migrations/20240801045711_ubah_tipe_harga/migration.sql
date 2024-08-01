/*
  Warnings:

  - You are about to alter the column `harga` on the `Produk` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Produk" ALTER COLUMN "harga" SET DATA TYPE INTEGER;
