// API Data Kedatangan

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Data Kedatangan')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {

    return NextResponse.json({ error: 'User ID tidak ditemukan!' }, { status: 400 })
  }

  console.log('User dengan Id : ',userId,' mengakses API data kedatangan')

  try{
    const datapembelian = await prisma.pembelian.findMany({

      // Memilih data dengan status DIPESAN atau PENDING
      where: {
          status: "DIPESAN" ,
      },
      select:{
        id:true,
        kode:true,
        status:true,
        jumlahtotalharga:true,
        updatedAt: true,
        createdAt:true,
        distributor:{select:{nama:true,},},
        pembeliandetail:{
          select:{
            id:true,
            produkId:true,
            jumlah:true,
            hargabeli:true,
            produk:{
              select:{
                nama:true,
              }
            }
          },
        },
      }
    })

    const formatpembelian = datapembelian.map(pembelian => ({
      ...pembelian,
      namaDistributor: pembelian.distributor?.nama || '-',
      updatedAt: pembelian.updatedAt.toISOString(),
      createdAt: pembelian.createdAt.toISOString(),
      pembeliandetail: pembelian.pembeliandetail.map(detail=>({
        ...detail,
        pembeliandetailId: detail.id,
        nama: detail.produk.nama,
        hargabeli: detail.hargabeli,
        jumlahpesanan: detail.jumlah,
        produkId: detail.produkId,
      }))
    }))

    return NextResponse.json(formatpembelian, {status:200})
  }
  catch(error){
    console.error('Error mengambil data pembelian:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data pembelian' }, { status: 500 })

  }

}
