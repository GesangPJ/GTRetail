// API data pembelian

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import { logToFile } from '@/app/lib/logger'

import prisma from '@/app/lib/prisma'

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Ambil Status Pembelian')

    logToFile('Unauthorized Access : API Ambil Status Pembelian')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    logToFile('User ID tidak ditemukan!')

    return NextResponse.json({ error: 'User ID tidak ditemukan!' }, { status: 400 })
  }

  console.log('User dengan Id : ',userId,' mengakses API data pembelian')

  try{
    const datapembelian = await prisma.pembelian.findMany({

      // Memilih data dengan status DIPESAN atau PENDING
      where: {
        OR: [
          { status: "DIPESAN" },
          { status: "PENDING" }
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
