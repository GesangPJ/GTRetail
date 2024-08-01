'use client'

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import { useSession } from "next-auth/react"

import FormRegistrasiPelanggan from "@/views/pelanggan/registrasi-pelanggan"

const HalamanTambahPelanggan = () => {
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

  return(
    <div>
      <div>
        <h1 className="text-2xl font-bold">
          Form Registrasi Pelanggan
        </h1>
      </div>
      <br />
      <div>
        <FormRegistrasiPelanggan/>
      </div>
    </div>
  )
}

export default HalamanTambahPelanggan
