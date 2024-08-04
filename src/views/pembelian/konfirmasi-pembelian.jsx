'use client'

import React, { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, ButtonGroup, Snackbar, Alert } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import Chip from '@mui/material/Chip'

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
    case 'DIPESAN':
      return <Chip label="DIPESAN" color="success" variant="outlined" icon= {<CheckCircleOutlineIcon/>} />
    case 'SELESAI':
      return <Chip label="SELESAI" color="primary" variant="outlined" icon= {<DoneAllIcon/>} />
    case 'BATAL':
      return <Chip label="BATAL" color="error" variant="outlined"  icon= {<ErrorOutlineIcon/>} />
    default:
      return <Chip label="UNKNOWN" color="default" variant="outlined" />
  }
}

export const FormKonfirmasiPembelian = () => {
  const { data: session } = useSession()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch('/api/ganti-status-pembelian', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pembelianId: id, status: status }),
      })

      if (response.ok) {
        setAlertMessage(`Status berhasil diubah menjadi ${status}`)
        setAlertSeverity('success')
        fetchData()
      } else {
        const data = await response.json()

        setAlertMessage(`Gagal mengubah status: ${data.error}`)
        setAlertSeverity('error')
      }
    } catch (error) {
      setAlertMessage(`Terjadi kesalahan: ${error.message}`)
      setAlertSeverity('error')
    } finally {
      setAlertOpen(true)
    }
  }

  const fetchData = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/ambil-status-pembelian?userId=${session?.user?.id}`)
      const data = await response.json()

      // Tambahkan nomor urut
      const numberedData = data.map((row, index) => ({ ...row, no: index + 1 }))

      setRows(numberedData)
      setLoading(false)
    } catch (error) {
      console.error('Error mengambil data:', error)
    }
  }

  useEffect(() => {
    if (session) {

      fetchData()

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      width: 150,
    },
    {
      field: 'jumlahtotalharga',
      headerName: 'Total Harga',
      headerClassName:'app-theme--header',
      width: 120,
      renderCell: (params) => <div>{formatCurrency(params.value)}</div>,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName:'app-theme--header',
      width: 160,
      renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: 'edit',
      disableExport: true,
      headerName: '',
      headerClassName:'app-theme--header',
      width: 270,
      renderCell: (params) => (
        <ButtonGroup disableElevation variant="contained" aria-label="Button group">
          <Button
            id="DIPESAN"
            variant="outlined"
            color="success"
            startIcon={<CheckCircleOutlineIcon />}
            onClick={() => handleStatusChange(params.row.id, 'DIPESAN')}
          >
            DIPESAN
          </Button>
          <Button
            id="BATAL"
            color="error"
            variant="outlined"
            startIcon={<ErrorOutlineIcon />}
            onClick={() => handleStatusChange(params.row.id, 'BATAL')}
          >
            BATAL
          </Button>
        </ButtonGroup>
      ),
    },
  ]

  return(
    <div>
      <div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
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

export default FormKonfirmasiPembelian
