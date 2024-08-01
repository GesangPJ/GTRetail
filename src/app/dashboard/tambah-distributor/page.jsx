// Halaman Tambah Distributor

"use client"

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import FormTambahDistributor from '@/views/distributor/tambah-distributor'

const HalamanTambahDistributor = () =>{

  return(
    <div>
      <div>
        <h1 className='text-2xl font-bold'>
          Form Tambah Distrbutor
        </h1>
      </div>
      <br />
      <div>
        <FormTambahDistributor/>
      </div>
    </div>
  )
}

export default HalamanTambahDistributor
