// API konfirmasi Kedatangan

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function POST(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Data Kedatangan')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const {kode, id, items} = await req.json()

  if (!kode || !id || !items || !items.length) {
    console.error("Data yang dikirim kosong atau tidak lengkap")

    return NextResponse.json({ error: "Data tidak boleh kosong atau tidak lengkap" }, { status: 400 })
  }

  try{

    const statusbeli = "SELESAI"

    const statuspembelian = await prisma.pembelian.update({
      where: {id:id},
      data:{
        status:statusbeli,
      }
    })

    const kedatangan = await prisma.kedatangan.create({
      data: {
        kodepembelian: kode,
        items: {
          create: items.map(item => ({
            produkId: item.produkId,
            jumlahpesanan: item.jumlahpesanan,
            jumlahkedatangan: item.jumlahdatang,
            status: statusbeli,
          })),
        },
      },
    })

    console.log("Berhasil konfirmasi kedatangan :", kode)

    return NextResponse.json(statuspembelian, kedatangan, {status:201})
  }
  catch(error){
    console.error('Error konfirmasi kedatangan :', error)

    return NextResponse.json({error:'Terjadi kesalahan ketika konfirmasi kedatangan'}, {status:500})
  }
}
