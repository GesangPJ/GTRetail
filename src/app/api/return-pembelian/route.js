// API return pembelian

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import prisma from '@/app/lib/prisma'

export const POST = async (req) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Return Pembelian')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  try{
    const {pembelianId, pembelianbermasalahId, produk, jumlahtotal} = await req.json()

    // Mengambil bulan dan tahun saat ini
    const currentDate = new Date()
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
    const currentMonth = monthNames[currentDate.getMonth()]
    const currentYear = currentDate.getFullYear()

    // Mengambil nomor urut terakhir dari Jurnal yang berawalan dengan 'GT/RETURN/' untuk bulan dan tahun ini
    const lastJurnal = await prisma.jurnal.findFirst({
      where: {
        kode: {
          startsWith: `GT/RETURN/${currentMonth}/${currentYear}/`,
        },
        createdAt: {
          gte: new Date(currentYear, currentDate.getMonth(), 1),
          lte: new Date(currentYear, currentDate.getMonth() + 1, 0),
        },
      },
      orderBy: {
        id: 'desc',
      },
    })

    let newNumber

    if (lastJurnal) {
      const lastNumber = parseInt(lastJurnal.kode.split('/').pop(), 10)

      newNumber = (lastNumber + 1).toString().padStart(5, '0')
    } else {
      newNumber = '00001'
    }

    // Membuat kode return untuk jurnal
    const newKode = `GT/RETURN/${currentMonth}/${currentYear}/${newNumber}`

    // Buat data di tabel return
    const buatreturn = await prisma.returnPembelian.create({
        data:{
          pembelianId: parseInt(pembelianId),
          returndetail:{
            create: produk.map(produk =>({
              produkId: parseInt(produk.produkId),
              jumlahreturn: parseInt(produk.jumlah),
            }))
          }
        }
    })

    // Ganti status pembelian bermasalah ke tutup
    const statusbermasalah = await prisma.pembelianBermasalah.update({
      where:{
        id:parseInt(pembelianbermasalahId),
      },
      data:{
        status: "TUTUP",
      },
    })

    // Ganti status pembelia ke BATAL
    const statuspembelian = await prisma.pembelian.update({
      where:{id:parseInt(pembelianId),},
      data:{
        status:"RETURN",
      },
    })

    // Buat Jurnal Return
    const buatjurnalreturn = await prisma.jurnal.create({
      data:{
        pembelianId:parseInt(pembelianId),
        akun:"BANK",
        kode: newKode,
        kredit: parseInt(jumlahtotal),
      }
    })

    console.log("Berhasil membuat return pembelian")

    return NextResponse.json(buatreturn, buatjurnalreturn, statusbermasalah, statuspembelian,{status:201})

  }
  catch(error){
    console.error("Terjadi kesalahan saat membuat return pembelian", error)

    return NextResponse.json({error:"Terjadi kesalahan saat membuat return pembelian"}, {status:500})

  }

}
