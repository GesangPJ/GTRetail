"use client"

import { useEffect, Suspense } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import ViewPengaturan from '@/views/pengaturan/view-pengaturan'

const HalamanPengaturan = () => {
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
        <h1 className='text-2xl font-bold'>
          Pengaturan Toko
        </h1>
        <br />
        <Suspense fallback={<div>Memuat Data...</div>}>
        <div>
          <ViewPengaturan/>
        </div>
        </Suspense>
      </div>
    </div>
  )
}

export default HalamanPengaturan
