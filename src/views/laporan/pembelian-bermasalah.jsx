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
import CancelIcon from '@mui/icons-material/Cancel'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import { idr } from 'matauang'

const getStatusChip = (status) => {
  switch (status) {
    case 'PENDING':
      return <Chip label="PENDING" color="warning" variant="outlined" icon= {<PauseCircleIcon/>} />
    case 'DIPESAN':
      return <Chip label="DIPESAN" color="success" variant="outlined" icon= {<CheckCircleOutlineIcon/>} />
    case 'SELESAI':
      return <Chip label="SELESAI" color="primary" variant="outlined" icon= {<DoneAllIcon/>} />
    case 'BATAL':
      return <Chip label="BATAL" color="error" variant="outlined"  icon= {<CancelIcon/>} />
    case 'BERMASALAH':
      return <Chip label="BERMASALAH" color='error' variant='outlined' icon={<ErrorOutlineIcon/>}/>
      case 'RETURN':
        return <Chip label="RETURN" color='error' variant='outlined' icon={<KeyboardDoubleArrowLeftIcon/>}/>
      default:
      return <Chip label="UNKNOWN" color="default" variant="outlined" />
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

const ViewPembelianBermasalah = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/ambil-status-bermasalah?userId=${session.user.id}`)
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
    {
      field: 'updatedAt',
      headerName: 'Tanggal/Jam',
      headerClassName:'app-theme--header',
      width: 130,
      renderCell: (params) => <div>{formatDate(params.value)}</div>,
    },
    { field: 'kode',
      headerName: 'Kode',
      headerClassName:'app-theme--header',
      width: 250 },

    {
      field: 'namaDistributor',
      headerName: 'Distributor',
      headerClassName:'app-theme--header',
      width: 180,
    },
    {
      field: 'jumlahtotalharga',
      headerName: 'Total Harga',
      headerClassName:'app-theme--header',
      width: 120,
      renderCell: (params) => <div>{idr(params.value)}</div>,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName:'app-theme--header',
      width: 160,
      renderCell: (params) => getStatusChip(params.value),
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
      router.push(`/dashboard/detail-pembelian-bermasalah/${row.id}`)
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

export default ViewPembelianBermasalah
