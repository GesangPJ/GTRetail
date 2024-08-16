/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import { DataGrid } from '@mui/x-data-grid'
import { Button, Box, TextField, Snackbar, Alert,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { idr } from 'matauang'
import formatTanggal from 'formattanggal'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export const ViewKedatangan = () => {
  const { data: session } = useSession()
  const [pembelian, setPembelian] = useState([]) // Perbaikan state pembelian
  const [data, setData] = useState(null) // State untuk menyimpan data pembelian yang dipilih
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('success')
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('')

  const handleKedatangan = async () => {
    try {
      const payload = {
        kode: data.kode,
        id: data.id,
        items: rows.map(row => ({
          produkId: row.produkId,
          jumlahpesanan: row.jumlahpesanan,
          jumlahdatang: row.jumlahdatang,
        })),
      }

      const response = await fetch('/api/konfirmasi-kedatangan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setAlertMessage('Kedatangan berhasil dikonfirmasi.')
        setAlertSeverity('success')
        setAlertOpen(true)
      }
    } catch (error) {
      setAlertMessage('Gagal mengonfirmasi kedatangan.')
      setAlertSeverity('error')
      setAlertOpen(true)
    }
  }

  const handleBermasalah = async () => {
    try {
      const payload = {
        kode: data.kode,
        id: data.id,
        items: rows.map(row => ({
          produkId: row.produkId,
          nama: row.nama,
          hargabeli: row.hargabeli,
          jumlahpesanan: row.jumlahpesanan,
          jumlahdatang: jumlahdatang,
        })),
      }

      const response = await fetch('/api/pembelian-bermasalah', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Kirim seluruh row yang ada di DataGrid
      })

      if (response.ok) {
        setAlertMessage('Pesanan bermasalah telah dilaporkan.')
        setAlertSeverity('warning')
        setAlertOpen(true)
      }
    } catch (error) {
      setAlertMessage('Gagal melaporkan pesanan bermasalah.')
      setAlertSeverity('error')
      setAlertOpen(true)
    }
  }

  const handlePembelianChange = (event, value) => {
    if (value) {
      setData(value)
      setRows(value.pembeliandetail) // Atur DataGrid berdasarkan detail pembelian
    } else {
      setData(null)
      setRows([]) // Kosongkan DataGrid jika tidak ada yang dipilih
    }
  }

  const fetchData = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/kedatangan?userId=${session?.user?.id}`)
      const data = await response.json()

      // Tambahkan nomor urut
      const numberedData = data.map((row, index) => ({ ...row, no: index + 1 }))

      setPembelian(numberedData)
      setLoading(false)
    } catch (error) {
      console.error('Error mengambil data:', error)
    }
  }

  const handleProcessRowUpdate = (updatedRow, originalRow) => {
    // Update rows state with the new value for jumlahdatang
    const updatedRows = rows.map(row =>
      row.id === updatedRow.id ? { ...row, jumlahdatang: updatedRow.jumlahdatang } : row
    )

    setRows(updatedRows)

    return { ...updatedRow, jumlahdatang: updatedRow.jumlahdatang }
  }

  const handleProcessRowUpdateError = (error) => {
    console.error('Error updating row:', error)
  }

  const rows_pembelian = data ? [
    { label: 'ID Pembelian', value: data.id },
    { label: 'Kode Pembelian', value: data.kode },
    { label: 'Nama Distributor', value: data.namaDistributor },
    { label: 'Jumlah Total', value: idr(data.jumlahtotalharga) },
    { label: 'Status Pembelian', value: data.status },
    { label: 'Dibuat', value: formatTanggal(data.createdAt) },
    { label: 'Diubah', value: formatTanggal(data.updatedAt) },
  ] : []

  const columns = [
    {
      field: 'produkId',
      headerName: 'ID',
      headerClassName: 'app-theme--header',
      width: 80,
    },
    {
      field: 'nama',
      headerName: 'Produk',
      headerClassName: 'app-theme--header',
      width: 250,
    },
    {
      field: 'hargabeli',
      headerName: 'Harga Beli',
      headerClassName: 'app-theme--header',
      width: 150,
      renderCell: (params) => <div>{idr(params.value)}</div>,
    },
    {
      field: 'jumlahpesanan',
      headerName: 'Jumlah Pesanan',
      headerClassName: 'app-theme--header',
      width: 170,
    },
    {
      field: 'jumlahdatang',
      headerName: 'Jumlah Datang',
      headerClassName: 'app-theme--header',
      width: 170,
      editable: true,
    },
  ]

  const handleKonfirmasi = () => {
    // Cek apakah semua jumlahdatang sama dengan jumlahpesanan
    const isComplete = rows.every(row => row.jumlahdatang == row.jumlahpesanan)

    if (isComplete) {
      setDialogType('complete')
    } else {
      setDialogType('incomplete')
    }

    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  useEffect(() => {
    if (session) {
      fetchData()
    }
  }, [session])

  return (
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
      <br />
      <Autocomplete
        id="pembelian"
        sx={{ width: 300 }}
        options={pembelian}
        getOptionLabel={(option) => option.kode}
        onChange={handlePembelianChange}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.kode} | Harga: {idr(option.jumlahtotalharga)}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Masukkan Kode Pembelian"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password'
            }}
          />
        )}
      />
      <br />
      {data && (
        <>
          <h1>Kode Pembelian : {data.kode}</h1>
          <br />
          <TableContainer component={Paper}>
            <Table id="detail-table" sx={{ minWidth: 200 }} aria-label="Detail Produk" className='border-none'>
              <TableBody>
                {rows_pembelian.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row" className='text-xl max-w-[120px]'>
                      {row.label}
                    </TableCell>
                    <TableCell align="left" className='text-xl'>
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows} // Sesuaikan dengan rows yang telah diatur
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection={false}
              loading={loading}
              processRowUpdate={handleProcessRowUpdate}
              onProcessRowUpdateError={handleProcessRowUpdateError}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Box>
          <br />
          <Button variant="contained" color='success' onClick={handleKonfirmasi} sx={ { borderRadius: 30 } }>
            Konfirmasi Kedatangan
          </Button>
        </>
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>{dialogType === 'complete' ? 'Konfirmasi Kedatangan' : 'Laporkan Masalah'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === 'complete'
              ? 'Semua produk telah dikonfirmasi datang dengan jumlah yang sesuai pesanan. Apakah Anda ingin melanjutkan?'
              : 'Ada ketidaksesuaian antara jumlah produk datang dan jumlah pesanan. Apakah Anda ingin melaporkan masalah ini?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          {dialogType === 'complete'
            ? <Button onClick={handleKedatangan}>Konfirmasi</Button>
            : <Button onClick={handleBermasalah}>Laporkan</Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  )
}
