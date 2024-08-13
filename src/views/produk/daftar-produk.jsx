'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'
import { DataGrid} from '@mui/x-data-grid'
import { Button} from '@mui/material'
import Box from '@mui/material/Box'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString || dateString === '-') return '-'

  const date = new Date(dateString)

  // cek apakah tanggal valid
  if (isNaN(date.getTime())) return '-'

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

const TabelDaftarProduk = () =>{
  const router = useRouter()
  const { data: session } = useSession()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/data-produk?userId=${session.user.id}`)
          const data = await response.json()

          // Tambahkan nomor urut
          const numberedData = data.map((row, index) => ({ ...row, no: index + 1 }))

          setRows(numberedData)
          setLoading(false)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }

      fetchData()
    }
  }, [session])

  const columns = [
    { field: 'no',
      headerName: 'No.',
      headerClassName:'app-theme--header',
      width: 70 },
    { field: 'nama',
      headerName: 'Nama Produk',
      headerClassName:'app-theme--header',
      width: 170 },
    { field: 'harga',
      headerName: 'Harga',
      headerClassName:'app-theme--header',
      width: 110,
      renderCell: (params) => <div>{formatCurrency(params.value)}</div>,
    },
    { field: 'hargabeli',
      headerName: 'Harga Beli',
      headerClassName:'app-theme--header',
      width: 110,
      renderCell: (params) => <div>{formatCurrency(params.value)}</div>,
    },
    { field: 'satuan',
       headerName: 'Satuan',
       headerClassName:'app-theme--header',
        width: 100},
    { field: 'stok',
       headerName: 'Stok',
        headerClassName:'app-theme--header',
         width: 50 },
    { field: 'namaKategori',
       headerName: 'Kategori',
        headerClassName:'app-theme--header',
         width: 150},
    { field: 'jenis',
    headerName: 'Jenis',
    headerClassName:'app-theme--header',
      width: 100},
    {
      field: 'kadaluarsa',
      headerName: 'Kadaluarsa',
      headerClassName:'app-theme--header',
      width: 150,
      renderCell: (params) => <div>{formatDate(params.value)}</div>,
    },
    { field: 'status',
       headerName: 'Status',
        headerClassName:'app-theme--header',
         width: 110},
    {
      field: 'detail',
      disableExport: true,
      headerName: '',
      headerClassName:'app-theme--header',
      width: 110,
      renderCell: (params) => (
        <Button variant="contained" size='small' color="primary" onClick={() => handleDetailClick(params.row)}>
          Detail &raquo;
        </Button>
      ),
    },
  ]

  const handleDetailClick = (row) => {
    if (row && row.id) {
      router.push(`/dashboard/detail-produk/${row.id}`)
    } else {
      console.error('ID tidak valid:', row)
    }
  }

  return(
    <div>
      <div>
      <Box
          sx={{
            height: 400,
            width: '100%',
            '& .app-theme--header': {
              fontWeight: 'bold',
              fontSize: '1.1rem', // Adjust as needed
            },
          }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            loading={loading}
            getRowId={(row) => row.id} // Tetap gunakan ID asli untuk identifikasi baris
          />
        </Box>
      </div>

    </div>
  )
}

export default TabelDaftarProduk
