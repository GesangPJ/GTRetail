// API Edit Data Karyawan. Lokasi : /src/app/api/edit-karyawan

// API untuk mengubah email, nama akun Karyawan.

import { NextResponse } from "next/server"

import { getToken } from "next-auth/jwt"

import prisma from "@/app/lib/prisma"

export const PUT = async (req) =>{
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})
  const resetKey = process.env.ADMIN_KEY

  console.log('Token :', token)

  // Cek apakah API diakses dengan menggunakan token
  if(!token){
    console.log('Unauthorized Access : API Edit Karyawan')

    return NextResponse.json({error:'Unauthorized Access'}, {status:401})
  }

  // parsing data yang dikirim ke API
  try{
    const {userId, nama, email, masterKey} = await req.json()

    if(!userId || !nama || !email || !masterKey){
      return NextResponse.json({error:"Data tidak boleh kosong!"}, {status:400})
    }

    // cek apakah masterKey benar
    if(masterKey !== resetKey){
      return NextResponse.json({error: "MasterKey Salah!"}, {status:403})
    }

    // Masukkan data ke database
    try{
      const user = await prisma.user.update({

        // sesuai dengan Id
        where: {id: userId},
        data:{
          name:nama,
          email:email,
        },
      })

      // kirim response berhasil
      return NextResponse.json({message:"Data Akun Berhasil diubah", user}, {status:200})
    }
    catch(error){
      console.error("Error mengubah data akun : ", error)

      return NextResponse.json({error:"Ada kesalahan ketika mengganti data akun"}, {status:500})
    }
  }
  catch(error){
    console.error("Error tidak dapat parsing request body", error)

    return NextResponse.json({error:"Bad Request"}, {status:400})
  }
}
