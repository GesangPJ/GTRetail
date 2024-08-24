// API untuk mengubah data pengaturan.

import { NextResponse } from "next/server"

import { getToken } from "next-auth/jwt"

import prisma from "@/app/lib/prisma"

export const PUT = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const resetKey = process.env.ADMIN_KEY

  if (!token) {
    console.log('Unauthorized Access : API Edit Bpjs')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  try{
    const{
      nama_toko,
      alamat_toko,
      notelp_toko,
      email_toko,
      npwp_toko,
      ppn,
      siup_toko,
      masterKey,

    } = await req.json()

    console.log({
      nama_toko,
      alamat_toko,
      notelp_toko,
      email_toko,
      npwp_toko,
      ppn,
      siup_toko,
      masterKey
    })

    if (masterKey !== resetKey) {
      return NextResponse.json({ error: "MasterKey Salah!" }, { status: 403 })
    }

    const convertToFloat = (percent) => parseFloat((percent / 100).toFixed(4))

    const nilai_ppn = convertToFloat(ppn)

    try{
      const pengaturan = await prisma.pengaturan.update({
        where: {id:1},
        data:{
          nama_toko,
          alamat_toko,
          tarif_ppn: nilai_ppn,
          notelp_toko,
          email_toko,
          npwp_toko,
          siup_toko,

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
