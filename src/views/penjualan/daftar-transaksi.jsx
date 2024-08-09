'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import Chip from '@mui/material/Chip'
import { useSession } from 'next-auth/react'
import { DataGrid} from '@mui/x-data-grid'
import { Button} from '@mui/material'
import Box from '@mui/material/Box'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import DoneAllIcon from '@mui/icons-material/DoneAll'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const getStatusChip = (status) => {
  switch (status) {
    case 'PENDING':
      return <Chip label="PENDING" color="warning" variant="outlined" icon= {<PauseCircleIcon/>} />
    case 'HUTANG':
      return <Chip label="HUTANG" color="warning" variant="outlined" icon= {<CheckCircleOutlineIcon/>} />
    case 'SELESAI':
      return <Chip label="SELESAI" color="success" variant="outlined" icon= {<DoneAllIcon/>} />
    case 'BATAL':
      return <Chip label="BATAL" color="error" variant="outlined"  icon= {<ErrorOutlineIcon/>} />
    default:
      return <Chip label="TIDAK DIKETAHUI" color="default" variant="outlined" />
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Invalid Date'
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}-${month}-${year} ${hours}:${minutes}`
}

const TableTransaksi = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/data-transaksi?userId=${session.user.id}`)
          const data = await response.json()

          // Tambahkan nomor urut
          const numberedData = data.map((row, index) => ({ ...row, no: index + 1 }))

          setRows(numberedData)

          setLoading(false)
        } catch (error) {
          console.error('Error mengambil data:', error)
        }
      }

      fetchData()
    }
  }, [session])

  const columns = [
    // { field: 'no', headerName: 'No', width: 50, headerClassName:'app-theme--header', },
    {
      field: 'updatedAt',
      headerName: 'Waktu',
      headerClassName:'app-theme--header',
      width: 130,
      renderCell: (params) => <div>{formatDate(params.value)}</div>,
    },
    { field: 'kode',
      headerName: 'Kode',
      headerClassName:'app-theme--header',
      width: 250 },

    {
      field: 'jumlahTotal',
      headerName: 'Total Harga',
      headerClassName:'app-theme--header',
      width: 120,
      renderCell: (params) => <div>{formatCurrency(params.value)}</div>,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName:'app-theme--header',
      width: 130,
      renderCell: (params) => getStatusChip(params.value),
    },
    { field: 'metode',
      headerName: 'Metode',
      headerClassName:'app-theme--header',
      width: 100 },
    {
      field: 'namaPelanggan',
      headerName: 'Pelanggan',
      headerClassName:'app-theme--header',
      width: 180,
    },
    {
      field: 'detail',
      disableExport: true,
      headerName: 'Detail',
      headerClassName:'app-theme--header',
      width: 100,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleDetailClick(params.row)}>
          Detail &raquo;
        </Button>
      ),
    },
  ]

  const handleDetailClick = (row) => {
    if (row && row.id) {
      router.push(`/dashboard/detail-transaksi/${row.id}`)
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
            pageSize={5}
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

export default TableTransaksi
