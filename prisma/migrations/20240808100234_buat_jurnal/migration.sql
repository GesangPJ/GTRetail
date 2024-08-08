-- CreateTable
CREATE TABLE "JurnalTransaksi" (
    "id" SERIAL NOT NULL,
    "transaksiId" INTEGER NOT NULL,
    "kode" TEXT NOT NULL,
    "pemasukan" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JurnalTransaksi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurnalPembelian" (
    "id" SERIAL NOT NULL,
    "pembelianId" INTEGER NOT NULL,
    "kode" TEXT NOT NULL,
    "pengeluaran" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JurnalPembelian_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JurnalTransaksi" ADD CONSTRAINT "JurnalTransaksi_transaksiId_fkey" FOREIGN KEY ("transaksiId") REFERENCES "Transaksi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JurnalPembelian" ADD CONSTRAINT "JurnalPembelian_pembelianId_fkey" FOREIGN KEY ("pembelianId") REFERENCES "Pembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
