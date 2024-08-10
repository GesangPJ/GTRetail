// API Data kategori | Mengambil data kategori


import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Data kategori')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  // cek user Id yang mengakses API
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID tidak ditemukan!' }, { status: 400 })
  }

  console.log('User dengan Id : ',userId,' mengakses API data kategori')

  // ambil data dari database
  try{
    const kategoris = await prisma.kategori.findMany({
      select:{
        id:true,
        nama:true,
      }
    })

    // kirim data ke client
    return NextResponse.json(kategoris, {status:200})
  }
  catch(error){
    console.error('Error mengambil data kategori:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data kategori' }, { status: 500 })

  }

}
