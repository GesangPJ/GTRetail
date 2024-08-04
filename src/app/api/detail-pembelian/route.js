// API detail pembelian

import { NextResponse } from "next/server"

import { getToken } from 'next-auth/jwt'

import prisma from "@/app/lib/prisma"

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Ambil Detail pembelian')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  try{
    if (!id){
      return NextResponse.json({error:"ID pembelian tidak ada"}, {status:400})
    }

    const pembelian = await prisma.pembelian.findUnique({
      where: { id: parseInt(id) },
      include: {
        pembeliandetail: {
          select: {
            id: true,
            produkId: true,
            hargabeli: true,
            jumlah: true,
            total: true,
            produk: {
              select: {
                nama: true
              },
            },
          }
        },
        distributor:{
          select:{
            nama:true,
          },
        },
      }
    })

    const datapembelian = {
      ...pembelian,
      namaDistributor: pembelian.distributor.nama || "-",
      createdAt: pembelian.createdAt.toISOString(),
      updatedAt: pembelian.updatedAt.toISOString(),
      pembeliandetail: pembelian.pembeliandetail.map(detail => ({
        ...detail,
        nama: detail.produk.nama
      }))
    }

    return NextResponse.json(datapembelian)
  }
  catch(error){

  }



}



