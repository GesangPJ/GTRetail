// API Tambah Produk

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import {logToFile} from '@/app/lib/logger'

import prisma from '@/app/lib/prisma'

export const POST = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Tambah Kategori Produk')
    logToFile('Unauthorized Access : API Tambah Kategori Produk')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  try {
    const data = await req.json()

    console.log('Request Data:', data)

    const { userId, kategoriId, barcode, nama, harga, hargabeli, jenis, stok, satuan, keterangan, kadaluarsa } = data

    if (!nama || !stok || !kategoriId || !satuan || !harga) {
      logToFile("Semua bidang harus diisi.(API tambah produk)")

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

      logToFile(`Produk berhasil ditambahkan : ${nama}`)

      return NextResponse.json(produk, { status: 201 })
    } catch (error) {
      console.error('Error membuat produk:', error)
      logToFile('Error membuat produk:', error)

      return NextResponse.json({ error: "Error nilai produk" }, { status: 400 })
    }
  } catch (error) {
    console.error('Error membuat produk:', error)
    logToFile('Error menambahkan produk', error)

    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan." }, { status: 500 })
  }



}
