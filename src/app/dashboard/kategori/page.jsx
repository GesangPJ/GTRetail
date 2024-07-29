'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import TabelKategori from '@/views/produk/daftar-kategori'

import FormTambahKategori from '@/views/produk/tambah-kategori'

const HalamanKategori = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Jangan lakukan apa pun saat sesi sedang dimuat

    if (!session) {
      router.push('/error/401')
    }
  }, [session, status, router])

  if (!session) {
    return null
  }

  return(
    <div>
      <div>
      <h1 className="text-3xl font-extrabold">
        Halaman Kategori Produk
      </h1>
      </div>
        <br />
      <div>
        <TabelKategori/>
      </div>
      <br />

      <div>
        <FormTambahKategori/>
      </div>

    </div>
  )
}

export default HalamanKategori
