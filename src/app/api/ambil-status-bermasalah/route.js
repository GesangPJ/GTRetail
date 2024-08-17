// API status-pembelian-bermasalah

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Ambil Status Pembelian Bermasalah')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {

    return NextResponse.json({ error: 'User ID tidak ditemukan!' }, { status: 400 })
  }

  console.log('User dengan Id : ',userId,' mengakses API data pembelian status bermasalah')

  try{
    const datapembelian = await prisma.pembelian.findMany({

      where: {
        OR: [
          { status: "BERMASALAH" },
          { status: "RETURN" }
        ]
      },
      select:{
        id:true,
        kode:true,
        status:true,
        jumlahtotalharga:true,
        updatedAt: true,
        distributor:{select:{nama:true,},},
      }
    })

    const formatpembelian = datapembelian.map(pembelian => ({
      ...pembelian,
      namaDistributor: pembelian.distributor?.nama || '-',
      updatedAt: pembelian.updatedAt.toISOString(),
    }))

    return NextResponse.json(formatpembelian, {status:200})
  }
  catch(error){
    console.error('Error mengambil data pembelian:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data pembelian' }, { status: 500 })

  }

}
