// API Tambah Produk

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export const POST = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Tambah Kategori Produk')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  // parsing data yang dikirim ke database
  try {
    const data = await req.json()

    console.log('Request Data:', data)

    // mengambil masing-masing data
    const { userId, kategoriId, barcode, nama, harga, hargabeli, jenis, stok, satuan, keterangan, kadaluarsa } = data

    if (!nama || !stok || !kategoriId || !satuan || !harga) {

      return NextResponse.json({ error: "Semua bidang harus diisi." }, { status: 400 });
    }

    // set variable
    const status = "AKTIF"
    const barcodeValue = barcode || "0"

    // memasukkan data ke database
    try {
      const produk = await prisma.produk.create({
        data: {
          userId,
          nama,
          barcode: barcodeValue,
          harga,
          hargabeli,
          kadaluarsa: kadaluarsa ? new Date(kadaluarsa) : null,
          jenis,
          stok,
          satuan,
          status,
          kategoriId,
          keterangan,
        },
      })

      console.log('Produk dibuat :', produk)

      // kirim response berhasil
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
