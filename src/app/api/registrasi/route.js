import { NextResponse } from 'next/server'

import bcrypt from 'bcrypt'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export const POST = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Registrasi Akun')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  // parsing data yang dikirim ke API
  try {
    const { email, password, name, userType } = await req.json()

    if (!email || !password || !name || !userType) {
      return NextResponse.json({ error: "Semua bidang harus diisi." }, { status: 400 })
    }

    // hashing password dengan bcrypt 12 rounds
    const hashedPassword = await bcrypt.hash(password, 12)

    // masukkan data ke database
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          userType: userType.toUpperCase(),  // pastikan usertype KAPITAL
        },
      })

      // kirim response
      return NextResponse.json(user, { status: 201 })
    } catch (error) {
      return NextResponse.json({ error: "User sudah ada" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan saat memproses permintaan." }, { status: 500 })
  }
}
