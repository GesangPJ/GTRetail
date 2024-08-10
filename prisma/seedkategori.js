const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {

  try {

    // Seed data ke tabel Kategori
    const categories = await prisma.kategori.createMany({
      data: [
        { nama: 'Pulpen', status: 'AKTIF' },
        { nama: 'Pensil', status: 'AKTIF' },
        { nama: 'Mie', status: 'AKTIF' },
        { nama: 'Software', status: 'AKTIF'},
        { nama: 'Cokelat', status: 'AKTIF'},
        { nama: 'Roti', status: 'AKTIF'},
        { nama: 'Print', status: 'AKTIF'},
        { nama: 'Photo Copy', status: 'AKTIF'},
      ],
      skipDuplicates: true, // Optional: Skip jika data sudah ada
    })

    console.log('Data kategori berhasil dimasukkan:', categories)
  } catch (error) {
    console.error('Error membuat data kategori:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
