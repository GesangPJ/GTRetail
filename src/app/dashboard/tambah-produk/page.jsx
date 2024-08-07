'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import FormTambahProduk from '@/views/produk/tambah-produk'

const HalamanTambahProduk =()=>{
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
      <h1 className="text-ls font-bold">
        Tambah Produk
      </h1>

      <div>
        <FormTambahProduk/>
      </div>

    </div>
  )
}

export default HalamanTambahProduk
