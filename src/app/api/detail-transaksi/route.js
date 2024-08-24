// API detail transaksi

import { NextResponse } from "next/server"

import { getToken } from 'next-auth/jwt'

import prisma from "@/app/lib/prisma"

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // Cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Ambil Detail transaksi')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  // Cek user Id yang mengakses API ini
  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  try{
    if (!id){
      return NextResponse.json({error:"ID transaksi tidak ada"}, {status:400})
    }

    // ambil data transaksi
    const transaksi = await prisma.transaksi.findUnique({
      where: { id: parseInt(id) },

      // termasuk transaksi detail
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

        // termasuk nama user
        user:{
          select:{
            name:true,
          },
        },

        // termasuk nama pelanggan terdaftar
        pelanggan:{
          select:{
            nama:true,
          },
        },
      }
    })

    // format data transaksi
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

    // kirim data ke client
    return NextResponse.json(datatransaksi)
  }
  catch(error){
    console.error("Error mengambil data transaksi", error)

    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data transaksi :" }, { status: 500 })

  }

}
