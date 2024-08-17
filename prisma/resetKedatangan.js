// Reset Kedatangan

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    // Hapus semua data dari tabel Kedatangan detail dan Kedatangan
    await prisma.kedatanganDetail.deleteMany({})
    await prisma.kedatangan.deleteMany({})
    console.log('Berhasil menghapus semua data di tabel Kedatangan Detail & Kedatangan.')

    // Reset ID KedatanganDetail dan Kedatangan dari 1
    await prisma.$executeRaw`ALTER SEQUENCE "KedatanganDetail_id_seq" RESTART WITH 1`
    await prisma.$executeRaw`ALTER SEQUENCE "Kedatangan_id_seq" RESTART WITH 1`
    console.log('Berhasil mereset ID di tabel Kedatangan Detail & Kedatangan.')

  } catch (error) {
    console.error('Error menghapus data dan reset ID Kedatangan Detail & Kedatangan  :', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
.catch((e) => {
  console.error(e)
  process.exit(1)
})
