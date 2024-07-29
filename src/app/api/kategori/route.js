// Api Kategori.

// Mengambil data kategori

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Ambil Daftar Kategori')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  try{
    const kategoris = await prisma.kategori.findMany({
      select:{
        id:true,
        nama:true,
        status:true,
      }
    })

    return NextResponse.json(kategoris, { status: 200})
  }
  catch(error){
    console.error('Data Kategori tidak dapat diambil', error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data kategori' }, { status: 500 })
  }
}
