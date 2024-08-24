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
        user:{select:{name:true,},},
      }
    })

    const formatpengaturan = {
      ...pengaturan,
      namaAdmin: pengaturan.user?.name || '-',
      nama: pengaturan.nama_toko || '-',
      notelp: pengaturan.notelp_toko || '-',
      email: pengaturan.email_toko || '-',
      no_izin: pengaturan.siup_toko || '-',
      alamat: pengaturan.alamat_toko || '-',
      email: pengaturan.email_toko || '-',
      npwp: pengaturan.npwp_toko || '-',
      ppn: pengaturan.tarif_ppn || '-',
      updatedAt: pengaturan.updatedAt.toISOString() || '-',
    }

    console.log("Data Pengaturan berhasil diambil :", formatpengaturan)

    return NextResponse.json(formatpengaturan, {status:200})

  }
  catch(error){
    console.error("Error mengambil data pengaturan", error)

    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data pengaturan :" }, { status: 500 })

  }

}
