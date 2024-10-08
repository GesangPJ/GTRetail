// API Detail produk. Lokasi : /src/app/api/detail-produk
// API untuk menampilkan detail dari produk

import { NextResponse } from "next/server"

import { getToken } from 'next-auth/jwt'

import prisma from "@/app/lib/prisma"

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  // Cek apakah API diakses dengan menggunakan token
  if (!token) {
    console.log('Unauthorized Access : API Ambil Detail produk')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  // Cek user Id yang mengakses API ini
  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  try {
    if (!id) {

      return NextResponse.json({ error: "Id produk kosong" }, { status: 400 })
    }

    // Ambil data produk
    const produk = await prisma.produk.findUnique({
      where: { id: parseInt(id) },

      // termasuk kategori dan user
      include: {
        kategori: { select: { nama: true } },
        userproduk: {select: { name:true}},
      }
    })

    if (!produk) {

      return NextResponse.json({ error: "produk tidak ditemukan" }, { status: 404 })
    }

    // format data produk : tanggal dibuat, tanggal update, tanggal kadaluarsa, nama user, kategori.
    const formattedproduk = {
      ...produk,
      createdAt: produk.createdAt.toISOString(),
      kadaluarsa: produk.kadaluarsa ? produk.kadaluarsa.toISOString() : "-",
      updatedAt: produk.updatedAt.toISOString(),
      namaKaryawan: produk.userproduk?.name || "-",
      kategori: produk.kategori?.nama || '-'
    }

    console.log("Detail produk", formattedproduk)

    // kirim data ke client
    return NextResponse.json(formattedproduk, { status: 200 })
  } catch (error) {
    console.error("Error mengambil data produk", error)

    return NextResponse.json({ error: "Terjadi kesalahan saat mengambil data produk" }, { status: 500 })
  }
}
