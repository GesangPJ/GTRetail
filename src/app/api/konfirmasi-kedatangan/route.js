// API konfirmasi Kedatangan

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    console.log('Unauthorized Access : API Data Kedatangan')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const { kode, id, items } = await req.json()

  if (!kode || !id || !items || !items.length) {
    console.error("Data yang dikirim kosong atau tidak lengkap")

    return NextResponse.json({ error: "Data tidak boleh kosong atau tidak lengkap" }, { status: 400 })
  }

  try {
    // Memulai transaksi
    const [statuspembelian, kedatangan, updatestok] = await prisma.$transaction([
      // Update status pembelian
      prisma.pembelian.update({
        where: { id: id },
        data: {
          status: "SELESAI",
        },
      }),

      // Buat kedatangan
      prisma.kedatangan.create({
        data: {
          kodepembelian: kode,
          items: {
            create: items.map(item => ({
              produkId: item.produkId,
              jumlahpesanan: item.jumlahpesanan,
              jumlahkedatangan: item.jumlahdatang,
              status: "SELESAI",
            })),
          },
        },
      }),

      // Update stok produk untuk setiap item
      ...items.map(item =>
        prisma.produk.update({
          where: {
            id: item.produkId,
          },
          data: {
            stok: {
              increment: item.jumlahdatang,
            },
          },
        })
      ),
    ])

    console.log("Berhasil konfirmasi kedatangan:", kode)

    return NextResponse.json({ statuspembelian, kedatangan, updatestok }, { status: 201 })
  } catch (error) {
    console.error('Error konfirmasi kedatangan:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan ketika konfirmasi kedatangan' }, { status: 500 })
  }
}
