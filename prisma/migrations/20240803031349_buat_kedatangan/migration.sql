-- CreateTable
CREATE TABLE "Kedatangan" (
    "id" SERIAL NOT NULL,
    "pembeliandetailId" INTEGER NOT NULL,
    "tanggalkedatangan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jumlahproduk" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "receivedBy" INTEGER,
    "notes" TEXT,

    CONSTRAINT "Kedatangan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Kedatangan" ADD CONSTRAINT "Kedatangan_pembeliandetailId_fkey" FOREIGN KEY ("pembeliandetailId") REFERENCES "PembelianDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kedatangan" ADD CONSTRAINT "Kedatangan_receivedBy_fkey" FOREIGN KEY ("receivedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
