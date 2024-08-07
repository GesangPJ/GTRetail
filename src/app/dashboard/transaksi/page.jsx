'use client'

import { useEffect, Suspense } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import TableTransaksi from "@/views/penjualan/daftar-transaksi"

const HalamanTransaksi = () => {
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
      <h1 className="text-xl font-bold">
        Daftar Transaksi
      </h1>
      <br />
      <Suspense fallback={<div>Memuat Data...</div>}>
      <div>
        <TableTransaksi/>
      </div>
      </Suspense>

    </div>
  )
}

export default HalamanTransaksi
