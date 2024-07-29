// API Upload Gambar. Lokasi : /src/app/api/upload-gambar/route.js
import fs from 'fs'

import path from 'path'

import { NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false, // Disable built-in body parser
  },
}

export const POST  = async (req) => {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log('Token:', token)

  if (!token) {
    console.log('Unauthorized Access : API Tambah Kategori Produk')

    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 })
  }

  const form = new formidable.IncomingForm()

  form.uploadDir = path.join(process.cwd(), 'public/images/produk')
  form.keepExtensions = true

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(NextResponse.json({ error: 'Error parsing the file' }, { status: 500 }))
      }

      const file = files.file

      if (!file) {
        return resolve(NextResponse.json({ error: 'Tidak ada file diupload.' }, { status: 400 }))
      }

      // Move the file to the desired directory
      const newFilePath = path.join(form.uploadDir, file.newFilename)

      fs.renameSync(file.filepath, newFilePath)

      return resolve(NextResponse.json({ filePath: `public/images/produk/${file.newFilename}` }))
    })
  })


}
