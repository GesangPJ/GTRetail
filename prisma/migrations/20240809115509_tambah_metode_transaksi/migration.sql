/*
  Warnings:

  - Added the required column `metode` to the `Transaksi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaksi" ADD COLUMN     "metode" TEXT NOT NULL;
