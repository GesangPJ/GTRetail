// API data transaksi

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

  console.log('User dengan Id : ',userId,' mengakses API data transaksi')

  // Ambil data transaksi dari database
  try{
    const datatransaksi = await prisma.transaksi.findMany({
      select:{
        id:true,
        kode:true,
        metode:true,
        namapelanggan:true,
        status: true,
        jumlahTotal:true,
        updatedAt: true,
        pelanggan:{select:{nama:true,},},
      }
    })

    // Format tanggal update dan nama pelanggan
    const formattransaksi = datatransaksi.map(transaksi => ({
      ...transaksi,
      namaPelanggan: transaksi.pelanggan?.nama || transaksi.namapelanggan || '-',
      updatedAt: transaksi.updatedAt.toISOString(),
    }))

    // Kirim data ke client
    return NextResponse.json(formattransaksi, {status:200})
  }
  catch(error){
    console.error('Error mengambil data transaksi:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data transaksi' }, { status: 500 })

  }

}
