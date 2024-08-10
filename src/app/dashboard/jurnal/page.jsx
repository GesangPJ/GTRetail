
'use client'

import { useEffect, Suspense } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import TableJurnal from '@/views/jurnal/daftar-jurnal'

const HalamanJurnal = () =>{
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
      <h1 className="text-2xl font-bold">
        Halaman Jurnal
      </h1>
      <br />
      <Suspense fallback={<div>Memuat Data...</div>}>
      <div>
        <TableJurnal/>
      </div>
      </Suspense>
    </div>
  )
}

export default HalamanJurnal
