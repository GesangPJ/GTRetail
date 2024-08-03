// API tambah pembelian

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
    const { distributorId, produk } = await req.json()

    if (!distributorId || !produk) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // Mengambil bulan dan tahun saat ini
    const currentDate = new Date()
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const currentMonth = monthNames[currentDate.getMonth()]
    const currentYear = currentDate.getFullYear()

    // Menghitung total harga
    const totalHarga = produk.reduce((acc, produk) => acc + (produk.hargabeli * produk.jumlah), 0)

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
    const status = "DIPESAN"

    // Membuat kode baru
    const newKode = `GT/PURCHASE/${currentMonth}/${currentYear}/${newNumber}`

    const newPembelian = await prisma.pembelian.create({
      data: {
        kode: newKode,
        distributorId,
        status,
        jumlahtotalharga: totalHarga,
        pembeliandetail: {
          create: produk.map(produk => ({
            produkId: produk.id,
            jumlah: parseInt(produk.jumlah),
            hargabeli: parseInt(produk.hargabeli),
            total: produk.hargabeli * produk.jumlah,
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
