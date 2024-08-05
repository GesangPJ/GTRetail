-- CreateEnum
CREATE TYPE "jenis_p" AS ENUM ('BARANG', 'PANGAN');

-- AlterTable
ALTER TABLE "Produk" ADD COLUMN     "jenis" "jenis_p" NOT NULL DEFAULT 'BARANG',
ADD COLUMN     "kadaluarsa" TIMESTAMP(3);
