/*
  Warnings:

  - You are about to drop the column `jumlahproduk` on the `Kedatangan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Kedatangan" DROP COLUMN "jumlahproduk";

-- CreateTable
CREATE TABLE "KedatanganDetail" (
    "id" SERIAL NOT NULL,
    "kedatanganId" INTEGER NOT NULL,
    "produkId" INTEGER NOT NULL,
    "jumlahkedatangan" INTEGER NOT NULL,

    CONSTRAINT "KedatanganDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KedatanganDetail" ADD CONSTRAINT "KedatanganDetail_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
