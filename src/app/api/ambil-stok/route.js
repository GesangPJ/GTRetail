// API ambil data stok produk

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

  try{
    const stokproduk = await prisma.produk.findMany({
      select:{
        id:true,
        nama:true,
        stok:true,
      }
    })

    return NextResponse.json(stokproduk, {status: 200})

  }
  catch(error){
    console.error('Error tidak dapat mengambil data produk :', error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data produk' }, { status: 500 })
  }
}
