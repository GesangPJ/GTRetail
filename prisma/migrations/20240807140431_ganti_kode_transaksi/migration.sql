/*
  Warnings:

  - You are about to drop the column `nomor` on the `Transaksi` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kode]` on the table `Transaksi` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `kode` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Transaksi_nomor_key";

-- AlterTable
ALTER TABLE "Transaksi" DROP COLUMN "nomor",
ADD COLUMN     "kode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Transaksi_kode_key" ON "Transaksi"("kode");
