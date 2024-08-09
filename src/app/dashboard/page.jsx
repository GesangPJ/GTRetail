// Dashboard. Lokasi : /src/app/dashboard/page.jsx

'use client'

import { useEffect, Suspense } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import MesinKasir from '@/views/penjualan/buat-transaksi'

const DashboardAnalytics = () => {
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

  const isAdmin = session.user.userType === 'ADMIN'
  const isKaryawan = session.user.userType === 'KARYAWAN'

  return (
    <div style={{ width: '100%' }}>
        {isAdmin && (
          <div>
            <h1 className='text-2xl font-bold'>Dashboard Admin</h1>
            <br />
            <MesinKasir/>
            <br />
          </div>
        )}
        {isKaryawan && (
            <div>
              <h1 className='text-2xl font-bold'>Dashboard Karyawan</h1>
              <br />
              <MesinKasir/>
            </div>
        )}
    </div>
  )
}

export default DashboardAnalytics
