// API Edit Data Kategori. Lokasi : /src/app/api/edit-kategori

import { NextResponse } from "next/server"

import { getToken } from "next-auth/jwt"

import prisma from "@/app/lib/prisma"

export const PUT = async (req) =>{
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})
  const resetKey = process.env.kategori_KEY

  console.log('Token :', token)

  // cek apakah API diakses dengan menggunakan token
  if(!token){
    console.log('Unauthorized Access : API Edit Kategori')

    return NextResponse.json({error:'Unauthorized Access'}, {status:401})
  }

  // parsing data yang dikirim ke API
  try{
    const {id, nama, status, masterKey} = await req.json()

    if(!id || !nama || !status || !masterKey){
      return NextResponse.json({error:"Data tidak boleh kosong!"}, {status:400})
    }

    // cek apakah masterKey benar
    if(masterKey !== resetKey){
      return NextResponse.json({error: "MasterKey Salah!"}, {status:403})
    }

    // masukkan data ke database
    try{
      const kategori = await prisma.kategori.update({

        // sesuai dengan Id
        where: {id: id},
        data:{
          nama,
          status,
        },
      })

      // kirim response berhasil
      return NextResponse.json({message:"Data Kategori Berhasil diubah", kategori}, {status:200})
    }
    catch(error){
      console.error("Error mengubah data kategori : ", error)

      return NextResponse.json({error:"Ada kesalahan ketika mengganti data kategori"}, {status:500})
    }
  }
  catch(error){
    console.error("Error tidak dapat parsing request body", error)

    return NextResponse.json({error:"Bad Request"}, {status:400})
  }
}
