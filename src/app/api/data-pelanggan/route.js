// API Data Pelanggan

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Data Pelanggan')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID tidak ditemukan!' }, { status: 400 })
  }

  console.log('User dengan Id : ',userId,' mengakses API data pelanggan')

  try{
    const pelanggans = await prisma.pelanggan.findMany({
      select:{
        id:true,
        nama:true,
        email:true,
        alamat:true,
        notelp:true,
      }
    })

    return NextResponse.json(pelanggans, {status:200})
  }
  catch(error){
    console.error("Error mengambil data pelanggan :", error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data pelanggan' }, { status: 500 })
  }

}
