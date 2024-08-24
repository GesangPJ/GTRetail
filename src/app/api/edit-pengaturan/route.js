// API untuk mengubah data pengaturan.

import { NextResponse } from "next/server"

import { getToken } from "next-auth/jwt"

import prisma from "@/app/lib/prisma"

export const PUT = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const resetKey = process.env.ADMIN_KEY

  console.log('Token :', token)

  if (!token) {
    console.log('Unauthorized Access : API Edit Bpjs')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  try{
    const{
      userId,
      nama,
      alamat,
      notelp,
      email,
      npwp,
      ppn,
      no_izin,
      masterKey,

    } = await req.json()

    if (masterKey !== resetKey) {
      return NextResponse.json({ error: "MasterKey Salah!" }, { status: 403 })
    }

    const nilai_ppn = convertToFloat(ppn)

    try{
      const pengaturan = await prisma.pengaturan.update({
        where: {id:1},
        data:{
          userId,
          nama_toko: nama,
          alamat_toko: alamat,
          tarif_ppn: nilai_ppn,
          notelp_toko: notelp,
          email_toko: email,
          npwp_toko: npwp,
          siup_toko: no_izin,

        }
      })

      console.log("Data Pengaturan berhasil diperbarui :", pengaturan)

      return NextResponse.json({status: 201})
    }
    catch(error){
      console.error("Tidak dapat memperbarui data pengaturan :", error)

      return NextResponse.json({error: "Tidak dapat memperbarui data pengaturan"}, {status:500})

    }

  }
  catch(error){
    console.error("Error tidak dapat parsing request body", error)

    return NextResponse.json({ error: "Bad Request" }, { status: 400 })
  }

}
