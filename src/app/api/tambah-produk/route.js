// API Tambah Produk

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export const POST = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Tambah Kategori Produk')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  try {
    const data = await req.json()

    console.log('Request Data:', data)

    const { userId, kategoriId, barcode, nama, harga, stok, satuan, keterangan } = data

    if (!nama || !stok || !kategoriId || !satuan || !harga) {
      return NextResponse.json({ error: "Semua bidang harus diisi." }, { status: 400 });
    }

    const status = "AKTIF"
    const barcodeValue = barcode || "0"

    try {
      const produk = await prisma.produk.create({
        data: {
          userId,
          nama,
          barcode: barcodeValue,
          harga,
          stok,
          satuan,
          status,
          kategoriId,
          keterangan,
        },
      })

      console.log('Produk dibuat :', produk)

      return NextResponse.json(produk, { status: 201 })
    } catch (error) {
      console.error('Error membuat produk:', error)

      return NextResponse.json({ error: "Error nilai produk" }, { status: 400 })
    }
  } catch (error) {
    console.error('Error membuat produk:', error)

    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan." }, { status: 500 })
  }



}
