import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export const POST = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Tambah Pembelian')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  try {
    const { distributorId, products } = await req.json()

    if (!distributorId || !products || products.length === 0) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // Mengambil bulan dan tahun saat ini
    const currentDate = new Date()
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const currentMonth = monthNames[currentDate.getMonth()]
    const currentYear = currentDate.getFullYear()

    // Menghitung total harga
    const totalHarga = products.reduce((acc, product) => acc + (product.hargabeli * product.jumlah), 0)

    // Mengambil nomor urut terakhir dari pembelian bulan dan tahun ini
    const lastPembelian = await prisma.pembelian.findFirst({
      where: {
        createdAt: {
          gte: new Date(currentYear, currentDate.getMonth(), 1),
          lte: new Date(currentYear, currentDate.getMonth() + 1, 0),
        },
      },
      orderBy: {
        id: 'desc',
      },
    })

    const lastNumber = lastPembelian ? parseInt(lastPembelian.kode.split('/').pop(), 10) : 0
    const newNumber = (lastNumber + 1).toString().padStart(5, '0')

    // Membuat kode baru
    const newKode = `GT/SALES/${currentMonth}${currentYear}/${newNumber}`

    const newPembelian = await prisma.pembelian.create({
      data: {
        kode: newKode,
        distributorId,
        jumlahtotalharga: totalHarga,
        pembeliandetail: {
          create: products.map(product => ({
            produkId: product.produkId,
            jumlah: product.jumlah,
            hargabeli: product.hargabeli,
            satuan: product.satuan || '',
            total: product.hargabeli * product.jumlah,
          })),
        },
      },
    })

    return NextResponse.json(newPembelian, { status: 201 })
  } catch (error) {
    console.error('Error menambah pembelian:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat menambah pembelian' }, { status: 500 })
  }
}
