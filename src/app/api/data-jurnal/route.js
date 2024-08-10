// API Data Jurnal | Mengambil data jurnal

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

  console.log('User dengan Id : ',userId,' mengakses API data jurnal')

  // Ambil data jurnal dari database
  try{
    const jurnals = await prisma.jurnal.findMany({
      select:{
        id:true,
        kode:true,
        akun:true,
        debit:true,
        kredit:true,
        createdAt:false,
        updatedAt:true,
      }
    })

    // Format tanggal update
    const formatjurnal = jurnals.map(jurnal => ({
      ...jurnal,
      updatedAt: jurnal.updatedAt.toISOString()
    }))

    // Kirim data ke client
    return NextResponse.json(formatjurnal, {status:200})

  }
  catch(error){

  }

}
