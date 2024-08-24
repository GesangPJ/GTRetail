'use client'

import { useEffect, Suspense } from "react"

import { useRouter } from "next/navigation"

import { useSession } from "next-auth/react"

import TabelAkunAdmin from '@/views/tabel-akun/TabelAdmin'

import TabelAkun from "@/views/tabel-akun/TabelAkun"

const DaftarAkun = () => {
  const {data: session, status} = useSession()
  const router = useRouter()

  useEffect(()=>{
    if (status === 'loading') return

    if(!session){
      router.push('/error/401')
    }
  }, [session, status, router])

  if(!session){
    return null
  }

  return (
<div>
      <h1>Tabel Daftar Akun</h1>
      <br />
      <Suspense fallback={<div>Memuat Data...</div>}>
      <div>
        <TabelAkun/>
      </div>
      <br />
      <div>
        <TabelAkunAdmin/>
      </div>
      </Suspense>
      <br />
    </div>
  )
}

export default DaftarAkun
