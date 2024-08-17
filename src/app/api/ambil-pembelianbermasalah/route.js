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
    const databermasalah = await prisma.pembelianBermasalah.findFirst({
      where:{pembelianId: parseInt(id),},
      select:{
        id:true,
        pembelianId:true,
        kodepembelian:true,
        status:true,
        createdAt:true,
        updatedAt:true,
        detailbermasalah:{
          select:{
            id:true,
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
            jumlahtotalharga:true,
            distributor:{
              select:{
                nama:true,
              },
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
    console.error("Error Mengambil data :", error)

    return NextResponse.json({error:"Error mengambil data"}, {status:500})

  }

}
