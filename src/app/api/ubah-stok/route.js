// API ubah stok produk

import { NextResponse } from "next/server"

import { getToken } from "next-auth/jwt"

import prisma from "@/app/lib/prisma"

export const PUT = async (req) =>{

  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})

  console.log('Token :', token)

  // cek apakah API diakses dengan menggunakan token
  if(!token){
    console.log('Unauthorized Access : API Edit Karyawan')

    return NextResponse.json({error:'Unauthorized Access'}, {status:401})
  }

  // parsing data yang dikirim ke API
  try{
    const {produkId, stok} = await req.json()

    // memasukkan data ke database
    try{
      const gantistok = await prisma.produk.update({
        where: {id:parseInt(produkId)},
        data:{
          stok: parseInt(stok),
        }
      })

      // kirim response berhasil
      return NextResponse.json(gantistok, {status:200})
    }
    catch(error){
      console.error('Gagal mengubah stok produk', error)

      return NextResponse.json({error:"Gagal mengubah stok produk"}, {status: 500})
    }

  }
  catch(error){
    console.error('Bad Request : ', error)

    return NextResponse.json({error: 'Bad Request'}, {status:400})
  }

}
