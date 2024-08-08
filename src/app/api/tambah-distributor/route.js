// API tambah distributor

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export const POST = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Tambah Distributor')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  try{
    const {nama, notelp, email, alamat} = await req.json()

    if( !nama || !notelp || !email || !alamat){
      return NextResponse.json({error: "Semua bidang harus diisi."}, {status:400})
    }

    try{
      const distributor = await prisma.distributor.create({
        data:{
          nama,
          email,
          notelp,
          alamat,
        },
      })

      console.log("distributor berhasil ditambahkan :", distributor)

      return NextResponse.json(distributor, {status:201})

    }
    catch(error){
      console.error("Error menambahkan data distributor :", error)

      return NextResponse.json({error: "Error menambahkan data distributor"}, {status:400})
    }

  }
  catch(error){
    console.error("Error memproses request", error)

    return NextResponse.json({error:"Error parsing request body"}, {status: 500})
  }
}
