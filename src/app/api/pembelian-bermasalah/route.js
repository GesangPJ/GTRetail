// API Lapor Pembelian Bermasalah

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    console.log('Unauthorized Access : API Lapor Pembelian Bermasalah')

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
          status: "BERMASALAH",
        },
    })

    const pembelianBermasalah = await prisma.pembelianBermasalah.create({
      data: {
        pembelianId: id,
        kodepembelian: kode,
        status: "BUKA",
        detailbermasalah: {
          create: items.map(item => ({
            produkId: parseInt(item.produkId),
            jumlahpesanan: parseInt(item.jumlahpesanan),
            jumlahkedatangan: parseInt(item.jumlahdatang),
          })),
        },
      },
    })

    console.log("Berhasil lapor pembelian bermasalah :", kode)

    return NextResponse.json({ statuspembelian, pembelianBermasalah }, { status: 201 })
  } catch (error) {
    console.error('Error konfirmasi kedatangan:', error)

    return NextResponse.json({ error: 'Terjadi kesalahan ketika konfirmasi kedatangan' }, { status: 500 })
  }
}
