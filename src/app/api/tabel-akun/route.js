import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Ambil Daftar Akun')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  // cek user Id yang mengakses API
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID tidak ditemukan' }, { status: 400 })
  }

  console.log(userId)

  // mengambil data dari database
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
      },
    })

    // kirim data ke client
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengambil data akun' }, { status: 500 })
  }
}
