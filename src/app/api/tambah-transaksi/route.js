// API tambah pembelian admin

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export const POST = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Tambah Pembelian Admin')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  try {
    const { pelangganId, pelangganNama, produk } = await req.json()

    if (!distributorId || !produk) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    // Mengambil bulan dan tahun saat ini
    const currentDate = new Date()
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const currentMonth = monthNames[currentDate.getMonth()]
    const currentYear = currentDate.getFullYear()

    // Menghitung total harga
    const totalHarga = produk.reduce((acc, produk) => acc + (produk.harga * produk.jumlah), 0)

    // Mengambil nomor urut terakhir dari pembelian bulan dan tahun ini
    const lastTransaksi = await prisma.pembelian.findFirst({
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

    let newNumber

    if (lastTransaksi) {
      const lastTransaksiDate = new Date(lastTransaksi.createdAt)
      const lastMonth = monthNames[lastTransaksiDate.getMonth()]
      const lastYear = lastTransaksiDate.getFullYear()

      // Reset nomor seri jika masuk bulan baru

      if (currentMonth !== lastMonth || currentYear !== lastYear) {
        newNumber = '00001'
      } else {
        const lastNumber = parseInt(lastTransaksi.kode.split('/').pop(), 10)

        newNumber = (lastNumber + 1).toString().padStart(5, '0')
      }
    } else {
      newNumber = '00001'
    }

    const status = "SELESAI"

    // Membuat kode baru
    const newKode = `GT/SALES/${currentMonth}/${currentYear}/${newNumber}`

    const newTransaksi = await prisma.transaksi.create({
      data: {
        kode: newKode,
        userId:pelangganId,
        namapelanggan:pelangganNama,
        status,
        jumlahTotal: totalHarga,
        transaksidetail: {
          create: produk.map(produk => ({
            produkId: produk.id,
            jumlah: parseInt(produk.jumlah),
            harga: parseInt(produk.harga),
            total: produk.harga * produk.jumlah,
          })),
        },
      },
    })

    return NextResponse.json(newTransaksi, { status: 201 })

  } catch (error) {
    console.error('Error menambah pembelian:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat menambah pembelian' }, { status: 500 })
  }
}
