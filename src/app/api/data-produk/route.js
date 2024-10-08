// API Data Produk | Mengambil data produk

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // Cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Data Produk')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  // Cek user Id yang mengakses API ini
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID tidak ditemukan!' }, { status: 400 })
  }

  console.log('User dengan Id : ',userId,' mengakses API data produk')

  // Ambil data produk dari database
  try{
    const produks = await prisma.produk.findMany({
      select:{
        id:true,
        nama:true,
        stok:true,
        harga:true,
        hargabeli:true,
        satuan:true,
        jenis:true,
        kadaluarsa:true,
        status:true,
        kategori:{select:{nama:true,},},
      }
    })

    // Format nama Kategori dan tanggal kadaluarsa
    const formattedproduk = produks.map(produk => ({
      ...produk,
      namaKategori: produk.kategori?.nama || '-',
      kadaluarsa: produk.kadaluarsa ? produk.kadaluarsa.toISOString() : "-",
    }))

    // Kirim data ke client
    return NextResponse.json(formattedproduk, {status:200})
  }
  catch(error){
    console.error('Error mengambil data produk:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data produk' }, { status: 500 })

  }

}
