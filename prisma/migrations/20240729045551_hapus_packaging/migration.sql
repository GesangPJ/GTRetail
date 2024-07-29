/*
  Warnings:

  - You are about to drop the column `packagingId` on the `Produk` table. All the data in the column will be lost.
  - You are about to drop the column `packagingId` on the `TransaksiDetail` table. All the data in the column will be lost.
  - You are about to drop the `Packaging` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Produk" DROP CONSTRAINT "Produk_packagingId_fkey";

-- DropForeignKey
ALTER TABLE "TransaksiDetail" DROP CONSTRAINT "TransaksiDetail_packagingId_fkey";

-- AlterTable
ALTER TABLE "Produk" DROP COLUMN "packagingId",
ADD COLUMN     "satuan" TEXT NOT NULL DEFAULT 'pcs';

-- AlterTable
ALTER TABLE "TransaksiDetail" DROP COLUMN "packagingId";

-- DropTable
DROP TABLE "Packaging";
