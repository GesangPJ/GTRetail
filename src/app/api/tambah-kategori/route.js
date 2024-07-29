// Tambah kategori API. Lokasi : /src/app/api/tambah-kategori/route.js

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export const POST = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Tambah Kategori Produk')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  try {
    const { nama, status } = await req.json()

    if (!nama || !status) {
      return NextResponse.json({ error: "Semua bidang harus diisi." }, { status: 400 });
    }

    // Ambil tanggal dan waktu saat ini
    const now = new Date()
    const createdAt = now.toISOString() // menggunakan format ISO untuk datetime

    try {
      const kategori = await prisma.kategori.create({
        data: {
          nama,
          status,

          // createdAt,
          // updatedAt: createdAt,
        },
      })

      console.log('kategori created:', kategori)

      return NextResponse.json(kategori, { status: 201 })
    } catch (error) {
      console.error('Error membuat kategori:', error)

      return NextResponse.json({ error: "kategori sudah ada" }, { status: 400 })
    }
  } catch (error) {
    console.error('Error membuat kategori:', error)

    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan." }, { status: 500 })
  }
}
