
'use client'

import { useEffect, Suspense } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'


const LaporanProduk = () => {
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
        <h1 className="text-2xl font-bold">
          Laporan Produk
        </h1>
      </div>
      <br />
      <Suspense fallback={<div>Memuat Data...</div>}>
      <div>

      </div>
      </Suspense>
    </div>
  )
}

export default LaporanProduk
