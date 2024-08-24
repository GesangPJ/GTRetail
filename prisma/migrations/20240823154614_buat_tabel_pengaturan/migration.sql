-- CreateTable
CREATE TABLE "Pengaturan" (
    "id" INTEGER NOT NULL,
    "nama_toko" TEXT NOT NULL,
    "tarif_ppn" DECIMAL(65,30) NOT NULL,
    "alamat_toko" TEXT NOT NULL,
    "npwp_toko" TEXT,
    "siup_toko" TEXT,
    "notelp_toko" TEXT,
    "email_toko" TEXT,

    CONSTRAINT "Pengaturan_pkey" PRIMARY KEY ("id")
);
