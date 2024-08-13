'use client'

import React, { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import { Grid, Typography, Paper } from '@mui/material'
import { idr } from 'matauang'

const DashboardBanner = () => {
  const { data: session, status } = useSession()
  const [transaksi, setTransaksi] = useState(null) // Menggunakan null sebagai nilai awal

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session) { // Cek jika session sudah siap
        try {
          const response = await fetch(`/api/dashboard-admin?userId=${session.user.id}`)
          const data = await response.json()

          setTransaksi(data)
        } catch (error) {
          console.error('Failed to fetch data:', error)
        }
      }
    }

    fetchData()
  }, [session, status]) // Tambahkan status sebagai dependency

  if (!transaksi) {
    return <Typography>Loading...</Typography> // Menampilkan loading jika data belum siap
  }

  return (
    <div>
      <Grid container spacing={3} direction="row">
        <Grid item xs={2} >
          <Paper elevation={12}
          className='bg-blue-500 px-[12px] pt-[12px] pb-[10px]'
          >
          <Typography variant='body1' align='left'>
            Jumlah Total Penjualan :
          </Typography>
          <Typography variant='h3' align='left'>
            {transaksi.jumlahTransaksi}
          </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
        <Paper elevation={12} className='bg-amber-500 px-[12px] pt-[12px] pb-[10px]'
          >
            <Typography variant='body1' align='left'>
            Total Seluruh Pemasukan :
          </Typography>
          <Typography variant='h3'>
            {idr(transaksi.totalPemasukan)}
          </Typography>
        </Paper>

        </Grid>
        <Grid item xs={4}>
        <Paper elevation={12}
          className='bg-blue-500 px-[12px] pt-[12px] pb-[10px]'
          >
          <Typography variant='body1' align='left'>
            Produk Sering Dibeli :
          </Typography>
          <Typography variant='h3'>
            {transaksi.produkSeringDibeli}
          </Typography>
          </Paper>
        </Grid>
        <Grid item xs={2} >
          <Paper elevation={12}
          className='bg-blue-500 px-[12px] pt-[12px] pb-[10px]'
          >
          <Typography variant='body1' align='left'>
            Jumlah Produk :
          </Typography>
          <Typography variant='h3' align='left'>
            {transaksi.jumlahProduk}
          </Typography>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default DashboardBanner
