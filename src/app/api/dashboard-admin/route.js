// API Dashboard Admin. Lokasi : /src/app/api/dashboard-admin/route.js

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Dashboard Admin')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID tidak ditemukan!' }, { status: 400 })
  }

  console.log(userId)

  try{
    const transaksis = await prisma.transaksi.findMany({
      select:{
        id:true,
        status:true,
        jumlahTotal:true,
        transaksidetail:{
          select:{
            produkId:true,
            jumlah:true,
            produk:{
              select:{
                nama:true,
              },
            },
          },
        },

      }
    })

    const produks = await prisma.produk.findMany({
      select:{
        id:true,
      }
    })

    // Hitung jumlah produk
    const jumlahProduk = produks.length

    // Menghitung jumlah transaksi
    const jumlahTransaksi = transaksis.length

    // Menghitung total pemasukan
    const totalPemasukan = transaksis.reduce((acc, transaksi) => acc + transaksi.jumlahTotal, 0)

    // Menghitung jumlah produk yang paling sering dibeli
    const produkMap = {}

    transaksis.forEach(transaksi => {
        transaksi.transaksidetail.forEach(detail => {
            const namaProduk = detail.produk.nama

            if (!produkMap[namaProduk]) {
                produkMap[namaProduk] = 0
            }

            produkMap[namaProduk] += detail.jumlah
        })
    })

    // Menemukan produk yang paling sering dibeli
    const produkSeringDibeli = Object.keys(produkMap).reduce((a, b) => produkMap[a] > produkMap[b] ? a : b)

    const result = {
        jumlahProduk,
        jumlahTransaksi,
        totalPemasukan,
        produkSeringDibeli,
    }

    return NextResponse.json(result, { status: 200 })

  }
  catch(error){
    console.error("Error mengolah data transaksi :", error)

    return NextResponse.json({error:"Error Mengolah data transaksi"}, {status:500})

  }
}
