-- CreateTable
CREATE TABLE "Distributor" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "notelp" BIGINT NOT NULL,
    "alamat" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Distributor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pembelian" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "distributorId" INTEGER NOT NULL,
    "produkId" INTEGER NOT NULL,
    "jumlah" BIGINT NOT NULL,
    "hargabeli" BIGINT NOT NULL,
    "totalharga" BIGINT NOT NULL,
    "keterangan" TEXT,
    "kedatangan" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pembelian_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pembelian_kode_key" ON "Pembelian"("kode");

-- AddForeignKey
ALTER TABLE "Pembelian" ADD CONSTRAINT "Pembelian_produkId_fkey" FOREIGN KEY ("produkId") REFERENCES "Produk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
