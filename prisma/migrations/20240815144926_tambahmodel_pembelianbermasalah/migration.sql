-- CreateTable
CREATE TABLE "PembelianBermasalah" (
    "id" SERIAL NOT NULL,
    "pembeliandetailId" INTEGER NOT NULL,
    "kodepembelian" TEXT,
    "produkId" INTEGER NOT NULL,
    "jumlahpesanan" INTEGER NOT NULL,
    "jumlahkedatangan" INTEGER NOT NULL,
    "selisih" INTEGER NOT NULL,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PembelianBermasalah_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PembelianBermasalah" ADD CONSTRAINT "PembelianBermasalah_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PembelianBermasalah" ADD CONSTRAINT "PembelianBermasalah_pembeliandetailId_fkey" FOREIGN KEY ("pembeliandetailId") REFERENCES "PembelianDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
