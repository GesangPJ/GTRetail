// API detail transaksi

import { NextResponse } from "next/server"

import { getToken } from 'next-auth/jwt'

import { logToFile } from '@/app/lib/logger'

import prisma from "@/app/lib/prisma"

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Ambil Detail transaksi')
    logToFile('Unauthorized Access : API Ambil Detail transaksi')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  try{
    if (!id){
      return NextResponse.json({error:"ID transaksi tidak ada"}, {status:400})
    }

    const transaksi = await prisma.transaksi.findUnique({
      where: { id: parseInt(id) },
      include: {
        transaksidetail: {
          select: {
            id: true,
            produkId: true,
            harga: true,
            jumlah: true,
            total: true,
            produk: {
              select: {
                nama: true
              },
            },
          }
        },
        user:{
          select:{
            name:true,
          },
        },
        pelanggan:{
          select:{
            nama:true,
          },
        },
      }
    })

    const datatransaksi = {
      ...transaksi,
      namaPelanggan: transaksi.pelanggan?.nama || transaksi.namapelanggan || '-',
      namaKasir: transaksi.user?.name || '-',
      createdAt: transaksi.createdAt.toISOString(),
      updatedAt: transaksi.updatedAt.toISOString(),
      transaksidetail: transaksi.transaksidetail.map(detail => ({
        ...detail,
        nama: detail.produk.nama
      }))
    }

    logToFile('Detal transaksi Berhasil diambil')

    return NextResponse.json(datatransaksi)
  }
  catch(error){
    console.error("Error mengambil data transaksi", error)
    logToFile("Error mengambil data transaksi", error)

    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data transaksik" }, { status: 500 })

  }

}



