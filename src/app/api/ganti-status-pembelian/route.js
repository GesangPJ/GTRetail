// API ganti status pembelian

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export const PUT = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Ambil Status Pembelian')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  // parsing data yang dikirim ke API
  try{
    const {pembelianId, status} = await req.json()

    if(!pembelianId || !status){
      return NextResponse.json({error:"Data tidak boleh kosong"}, {status:400})
    }

    // masukkan data ke database
    const datastatus = await prisma.pembelian.update({

      // sesuai dengan Id
      where: {id:pembelianId},
      data:{status},
    })

    // kirim response berhasil
    return NextResponse.json(datastatus, {status:201})

  }
  catch(error){
    console.error("Error parsing request body:", error)

    return NextResponse.json({ error: "Bad Request" }, { status: 400 })
  }

}
