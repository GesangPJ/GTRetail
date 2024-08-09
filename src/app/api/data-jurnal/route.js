// API Data Jurnal | Mengambil data jurnal

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

  console.log('User dengan Id : ',userId,' mengakses API data jurnal')

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

    const formatjurnal = jurnals.map(jurnal => ({
      ...jurnal,
      updatedAt: jurnal.updatedAt.toISOString()
    }))

    return NextResponse.json(formatjurnal, {status:200})

  }
  catch(error){

  }

}
