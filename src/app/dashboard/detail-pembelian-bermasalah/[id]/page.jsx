'use client'

import { useEffect, useState} from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import { DataGrid } from '@mui/x-data-grid'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { Button } from '@mui/material'
import {idr} from 'matauang'
import formatTanggal from 'formattanggal'

const DetailPembelianBermasalah = () => {
  const params = useParams()
  const id = params.id
  const {data: session, status} = useSession()
  const router = useRouter()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/error/401')
    }

    const fetchData = async () => {
      try {
        if (id) {
          const response = await fetch(`/api/ambil-pembelianbermasalah?id=${id}`)

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const contentType = response.headers.get('content-type')

          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Received non-JSON response')
          }

          const result = await response.json()

          setData(result)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching detail data:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [id, session, status, router])

  if (!session) {
    return null
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!data) {
    return <div>Data tidak ditemukan</div>
  }

  const rows_pembelian = [
    { label: 'ID Pembelian', value: id},
    { label: 'Kode Pembelian', value: data.kodepembelian },
    { label: 'Distributor', value: data.namaDistributor },
    { label: 'Jumlah Total Harga', value: idr(data.jumlahTotal)},
    { label: 'Status', value: data.status },
    { label: 'Tanggal Laporan Dibuat', value: formatTanggal(data.createdAt) },
    { label: 'Tanggal Laporan Diperbarui', value: formatTanggal(data.updatedAt) },
  ]

  const columns = [
    {
      field:'produkId',
      headerName: 'ID',
      headerClassName: 'app-theme--header',
      width:80,
    },
    {
      field: 'namaProduk',
      headerName: 'Produk',
      headerClassName: 'app-theme--header',
      width: 250,
    },
    {
      field: 'jumlahpesanan',
      headerName: 'Jumlah Pesanan',
      headerClassName: 'app-theme--header',
      width: 120,
    },
    {
      field: 'jumlahkedatangan',
      headerName: 'Jumlah Kedatangan',
      headerClassName: 'app-theme--header',
      width: 120,
    },
  ]

  return (
    <div>
      <h1 className='text-xl font-bold'>
        Kode Pembelian : {data.kodepembelian}
      </h1>
      <br />
      <TableContainer component={Paper}>
        <Table id="detail-table" sx={{ minWidth: 200 }} aria-label="Detail Produk" className='border-none'>
          <TableBody>
            {rows_pembelian.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" className='text-xl max-w-[120px]'>
                  {row.label}
                </TableCell>
                <TableCell className='text-xl'>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <h1 className='text-xl font-bold'>
        Daftar Produk
      </h1>
      <br />
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
        rows={data.detailbermasalah}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row.id}
        />
      </Box>
      <br />
      <Box sx={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
        <Button variant='contained' color="primary" sx={{ borderRadius: 30 }} href="/dashboard/laporan/pembelian-bermasalah" size="large">
          &laquo; Daftar Pembelian Bermasalah
        </Button>
      </Box>
    </div>
  )
}

export default DetailPembelianBermasalah
