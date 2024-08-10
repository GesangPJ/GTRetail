// API detail pembelian

import { NextResponse } from "next/server"

import { getToken } from 'next-auth/jwt'

import prisma from "@/app/lib/prisma"

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // Cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Ambil Detail pembelian')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  // Cek user Id yang mengakses API ini
  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  try{
    if (!id){
      return NextResponse.json({error:"ID pembelian tidak ada"}, {status:400})
    }

    // Ambil data pembelian
    const pembelian = await prisma.pembelian.findUnique({
      where: { id: parseInt(id) },

      // termasuk pembelian detail
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

        // ambil nama distributor
        distributor:{
          select:{
            nama:true,
          },
        },
      }
    })

    // format nama distributor, tanggal dibuat, diupdate, dan detail pembelian
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

    // kirim data ke client
    return NextResponse.json(datapembelian)
  }
  catch(error){
    console.error("Error mengambil data pembelian", error)

    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data pembeliank" }, { status: 500 })

  }

}
