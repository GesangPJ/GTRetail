// API Data Pengaturan | Mengambil data pengaturan toko

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function GET(req){
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // Cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Data Produk')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  // Cek user Id yang mengakses API ini
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID tidak ditemukan!' }, { status: 400 })
  }

  console.log('User dengan Id : ',userId,' mengakses API data pengaturan')

  const formatToFixed = (num, decimals) => {
    const factor = Math.pow(10, decimals)

    return Math.round(num * factor) / factor
  }

  try{
    const pengaturan = await prisma.pengaturan.findMany({
      select:{
        id:true,
        nama_toko:true,
        notelp_toko:true,
        email_toko:true,
        alamat_toko:true,
        npwp_toko:true,
        tarif_ppn:true,
        siup_toko:true,
      }
    })

    if (pengaturan.length === 0) {
      return NextResponse.json({ error: "Data pengaturan tidak ditemukan." }, { status: 404 })
    }

    const dataPengaturan = pengaturan[0]

    const formatpengaturan = {
      ...dataPengaturan,
      ppn: formatToFixed(dataPengaturan.tarif_ppn * 100, 2),
    }

    console.log("Data Pengaturan berhasil diambil :", formatpengaturan)

    return NextResponse.json(formatpengaturan, {status:200})

  }
  catch(error){
    console.error("Error mengambil data pengaturan", error)

    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data pengaturan :" }, { status: 500 })

  }

}
