/*
  Warnings:

  - You are about to drop the column `kedatangan` on the `Pembelian` table. All the data in the column will be lost.
  - You are about to drop the column `keterangan` on the `Pembelian` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Pembelian" DROP COLUMN "kedatangan",
DROP COLUMN "keterangan";
