// API ubah stok produk

import { NextResponse } from "next/server"

import { getToken } from "next-auth/jwt"

import prisma from "@/app/lib/prisma"

export const PUT = async (req) =>{

  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})

  console.log('Token :', token)

  if(!token){
    console.log('Unauthorized Access : API Edit Karyawan')

    return NextResponse.json({error:'Unauthorized Access'}, {status:401})
  }

  try{
    const {id, stok} = await req.json()

    try{
      const gantistok = await prisma.produk.update({
        where: {id:parseInt(id)},
        data:{
          stok: parseInt(stok),
        }
      })

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
