// Reset Pembelian

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // Hapus semua data dari tabel Pembelian detail dan Pembelian
    await prisma.pembelianDetail.deleteMany({})
    await prisma.pembelian.deleteMany({})
    console.log('Berhasil menghapus semua data di tabel Pembelian Detail & Pembelian.')

    // Reset ID PembelianDetail dan Pembelian dari 1
    await prisma.$executeRaw`ALTER SEQUENCE "PembelianDetail_id_seq" RESTART WITH 1`
    await prisma.$executeRaw`ALTER SEQUENCE "Pembelian_id_seq" RESTART WITH 1`
    console.log('Berhasil mereset ID di tabel Pembelian Detail & Pembelian.')

  } catch (error) {
    console.error('Error menghapus data dan reset ID Pembelian Detail & Pembelian  :', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
.catch((e) => {
  console.error(e)
  process.exit(1)
})
