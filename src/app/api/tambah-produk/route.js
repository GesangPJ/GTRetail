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
    const { kategoriproduk, barcode, nama, harga, stok, satuan, keterangan } = await req.json()

    if (!nama || !stok || !kategoriproduk || !satuan || !harga) {
      return NextResponse.json({ error: "Semua bidang harus diisi." }, { status: 400 });
    }

    const status = "AKTIF"

    try {
      const produk = await prisma.produk.create({
        data: {
          nama,
          barcode,
          harga,
          stok,
          satuan,
          status,
          kategoriId: kategoriproduk,
          keterangan,
        },
      })

      console.log('Produk dibuat :', produk)

      return NextResponse.json(produk, { status: 201 })
    } catch (error) {
      console.error('Error membuat produk:', error)

      return NextResponse.json({ error: "produk sudah ada" }, { status: 400 })
    }
  } catch (error) {
    console.error('Error membuat produk:', error)

    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan." }, { status: 500 })
  }



}
