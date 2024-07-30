// API Data Produk | Mengambil data produk


import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Data Produk')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID tidak ditemukan!' }, { status: 400 })
  }

  console.log('User dengan Id : ',userId,' mengakses API data produk')

  try{
    const produks = await prisma.produk.findMany({
      select:{
        id:true,
        nama:true,
        stok:true,
        harga:true,
        satuan:true,
        status:true,
        kategori:{select:{nama:true,},},
      }
    })

    const formattedproduk = {
      ...produks,
      kategori: produks.kategori?.nama || '-'
    }

    return NextResponse.json(formattedproduk, {status:200})
  }
  catch(error){
    console.error('Error mengambil data produk:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data produk' }, { status: 500 })

  }

}
