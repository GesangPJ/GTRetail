// Dashboard. Lokasi : /src/app/dashboard/page.jsx

'use client'

import { useEffect, Suspense } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import PointOfSale from '@/views/penjualan/pos2'

import DashboardBanner from '@/views/dashboard/detail-banner'

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
            <Suspense fallback={<div>Memuat Data...</div>}>
            <div className='mb-[10px]'>
              <DashboardBanner/>
            </div>
            <div>
              <PointOfSale/>
            </div>
            </Suspense>
            <br />
          </div>
        )}
        {isKaryawan && (
            <div>
              <Suspense fallback={<div>Memuat Data...</div>}>
                <div>
                  <PointOfSale/>
                </div>
              </Suspense>
            </div>
        )}
    </div>
  )
}

export default DashboardAnalytics
