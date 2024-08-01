'use client'

import { useEffect } from "react"

import { useRouter } from "next/navigation"

import { useSession } from "next-auth/react"

import FormAturStok from "@/views/produk/atur-stok"

const HalamanAturStok =() => {
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
          Pembaruan Stok Produk
        </h1>
      </div>
      <br />
      <div>
        <FormAturStok/>
      </div>

    </div>
  )
}

export default HalamanAturStok
