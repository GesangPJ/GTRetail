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
    const statuspembelian = await prisma.pembelian.update({
      where: { id: id },
        data: {
          status: "SELESAI",
        },
    })

    const kedatangan = await prisma.kedatangan.create({
      data: {
        kodepembelian: kode,
        status: "SELESAI",
        kedatangandetail: {
          create: items.map(item => ({
            produkId: parseInt(item.produkId),
            jumlahpesanan: parseInt(item.jumlahpesanan),
            jumlahkedatangan: parseInt(item.jumlahdatang),
          })),
        },
      },
    })

    const updateStokPromises = items.map(item =>
      prisma.produk.update({
        where: { id: parseInt(item.produkId) },
        data: {
          stok: {
            increment: parseInt(item.jumlahpesanan),
          },
        },
      })
    )

    const updatedStok = await Promise.all(updateStokPromises)

    console.log("Berhasil konfirmasi kedatangan:", kode)

    return NextResponse.json({ statuspembelian, kedatangan, updatedStok }, { status: 201 })
  } catch (error) {
    console.error('Error konfirmasi kedatangan:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan ketika konfirmasi kedatangan' }, { status: 500 })
  }
}
