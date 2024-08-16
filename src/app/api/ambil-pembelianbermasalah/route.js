// API ambil data pembelian bermasalah

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

  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  try{
    const databermasalah = await prisma.pembelianBermasalah.findMany({
      where:{pembelianId:id,},
      select:{
        id:true,
        kodepembelian:true,
        status:true,
        createdAt:true,
        updatedAt:true,
        detailbermasalah:{
          select:{
            produkId:true,
            jumlahpesanan:true,
            jumlahkedatangan:true,
            produk:{
              select:{
                nama:true,
              }
            }
          }
        },
        pembelian:{
          select:{
            distributor:{
              select:{
                nama:true,
              },
              jumlahtotalharga:true,
            },
          },
        },

      }
    })

    const formatdatabermasalah = {
      ...databermasalah,
      createdAt: databermasalah.createdAt.toISOString(),
      updatedAt: databermasalah.updatedAt.toISOString(),
      namaDistributor: databermasalah.pembelian.distributor.nama || "-",
      jumlahTotal: databermasalah.pembelian.jumlahtotalharga,
      detailbermasalah: databermasalah.detailbermasalah.map(detail => ({
        ...detail,
        produkId: detail.produkId,
        namaProduk: detail.produk.nama,
        jumlahpesanan: detail.jumlahpesanan,
        jumlahkedatangan: detail.jumlahkedatangan,
      }))
    }

    console.log("Berhasil mengambil pembelian bermasalah")

    return NextResponse.json(formatdatabermasalah, {status:200})

  }
  catch(error){

  }

}
