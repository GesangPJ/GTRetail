// Reset Transaksi

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Hapus semua data dari tabel transaksi detail dan transaksi
    await prisma.transaksiDetail.deleteMany({})
    await prisma.transaksi.deleteMany({})
    console.log('Berhasil menghapus semua data di tabel Transaksi Detail & Transaksi.')

    // Reset ID TransaksiDetail dan Transaksi dari 1
    await prisma.$executeRaw`ALTER SEQUENCE "TransaksiDetail_id_seq" RESTART WITH 1`
    await prisma.$executeRaw`ALTER SEQUENCE "Transaksi_id_seq" RESTART WITH 1`
    console.log('Berhasil mereset ID di tabel Transaksi Detail & Transaksi.')

  } catch (error) {
    console.error('Error menghapus data dan reset ID Transaksi Detail & Transaksi  :', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
.catch((e) => {
  console.error(e)
  process.exit(1)
})
