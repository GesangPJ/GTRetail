-- AlterTable
ALTER TABLE "Distributor" ALTER COLUMN "notelp" DROP NOT NULL,
ALTER COLUMN "notelp" SET DATA TYPE TEXT,
ALTER COLUMN "alamat" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pelanggan" ALTER COLUMN "notelp" SET DATA TYPE TEXT;