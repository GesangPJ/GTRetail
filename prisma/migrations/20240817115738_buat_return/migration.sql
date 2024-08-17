-- CreateTable
CREATE TABLE "ReturnPembelian" (
    "id" SERIAL NOT NULL,
    "pembelianId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReturnPembelian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnDetail" (
    "id" SERIAL NOT NULL,
    "returnId" INTEGER NOT NULL,
    "produkId" INTEGER NOT NULL,
    "jumlahreturn" INTEGER NOT NULL,

    CONSTRAINT "ReturnDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReturnPembelian" ADD CONSTRAINT "ReturnPembelian_pembelianId_fkey" FOREIGN KEY ("pembelianId") REFERENCES "Pembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnDetail" ADD CONSTRAINT "ReturnDetail_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "ReturnPembelian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
