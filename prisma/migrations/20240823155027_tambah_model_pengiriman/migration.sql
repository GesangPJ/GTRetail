-- AlterTable
ALTER TABLE "Pembelian" ADD COLUMN     "biayakirim" INTEGER;

-- CreateTable
CREATE TABLE "Pengiriman" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "tarif" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengiriman_pkey" PRIMARY KEY ("id")
);
