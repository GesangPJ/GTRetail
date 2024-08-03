// API edit data produk

import { NextResponse } from "next/server"

import { getToken } from "next-auth/jwt"

import prisma from "@/app/lib/prisma"

export const PUT = async (req) => {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET})

  console.log('Token :', token)

  if(!token){
    console.log('Unauthorized Access : API Edit Produk')

    return NextResponse.json({error:'Unauthorized Access'}, {status:401})
  }

  try{
    const {produkId, nama, barcode, harga, hargabeli, satuan,
          status, keterangan } = await req.json()

    if (!produkId || !nama || !harga || !hargabeli || !satuan || !status){
      return NextResponse.json({error:"Data tidak boleh kosong!"}, {status:400})
    }

    try{

      const updateproduk = await prisma.produk.update({
        where: {id:produkId},
        data:{
          nama,
          barcode,
          harga: parseInt(harga),
          hargabeli: parseInt(hargabeli),
          status,
          satuan,
          keterangan,
        },
      })

      return NextResponse.json({message:"Data Produk berhasil diperbarui", updateproduk}, {status:200})

    }
    catch(error){
      console.error("Error mengubah data admin : ", error)

      return NextResponse.json({error:"Ada kesalahan ketika mengganti data produk"}, {status:500})
    }
  }
  catch(error){
    console.error("Error tidak dapat parsing request body", error)

    return NextResponse.json({error:"Bad Request"}, {status:400})

  }
}
