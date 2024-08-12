'use client'

import React, { useEffect, useState, useRef } from 'react'

import { useSession } from 'next-auth/react'
import {
  Grid, Button, TextField, InputAdornment, Alert, FormControl, InputLabel, Select, MenuItem, Box, Typography, IconButton,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { DataGrid } from '@mui/x-data-grid'
import SaveIcon from '@mui/icons-material/Save'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import DeleteIcon from '@mui/icons-material/Delete'
import { styled } from '@mui/material/styles'
import BackspaceIcon from '@mui/icons-material/Backspace'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const NumpadButton = styled(Button)({
  width: '100%',
  padding: '10px',
  fontSize: '22px',
  marginBottom: '2px'
})

const PointOfSale = () => {
  const { data: session } = useSession()

  const [data, setData] = useState({
    produkId: '',
    jumlah: '',
    harga: '',
    pelangganId: '',
    pelangganNama: ''
  })

  const [products, setProducts] = useState([])
  const [pelanggans, setPelanggans] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedPelanggan, setSelectedPelanggan] = useState(null)
  const [rows, setRows] = useState([])
  const [alert, setAlert] = useState(null)
  const [message, setMessage] = useState('')
  const [metode, setMetode] = useState('')
  const [totalHarga, setTotalHarga] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleProductChange = (event, value) => {
    setSelectedProduct(value)

    if (value) {
      setData(prevData => ({ ...prevData, produkId: value.id, harga: value.harga }))
    } else {
      setData(prevData => ({ ...prevData, produkId: '', harga: '' }))
    }
  }

  const handlePelangganChange = (event, value) => {
    setSelectedPelanggan(value)

    if (value) {
      setData(prevData => ({ ...prevData, pelangganId: value.id, pelangganNama: value.nama }))
    } else {
      setData(prevData => ({ ...prevData, pelangganId: '', pelangganNama: '' }))
    }
  }

  const handlePelangganInputChange = (event, value) => {
    if (!selectedPelanggan) {
      setData(prevData => ({ ...prevData, pelangganNama: value }))
    }
  }

  const handleAddProduct = () => {
    if (!selectedProduct || !data.jumlah || !data.harga) {
      setAlert('warning')
      setMessage('Pastikan semua data produk telah diisi')

      return
    }

    const totalHarga = data.jumlah * data.harga

    const newRow = {
      id: selectedProduct.id,
      nama: selectedProduct.nama,
      jumlah: parseInt(data.jumlah),
      totalharga: parseInt(totalHarga),
      harga: parseInt(data.harga),
    }

    setRows(prevRows => [...prevRows, newRow])
    setSelectedProduct(null)
    setData(prevData => ({ ...prevData, produkId: '', jumlah: '', harga: '' }))
  }

  const handleRemoveClick = (row) => {
    setRows(prevRows => prevRows.filter(item => item.id !== row.id))
  }

  const handleMetodeChange = (event) => {
    setMetode(event.target.value)
  }

  const handleProcessRowUpdate = (updatedRow, originalRow) => {
    const updatedTotalHarga = updatedRow.jumlah * updatedRow.harga

    const updatedRows = rows.map((row) =>
      row.id === updatedRow.id ? { ...updatedRow, totalharga: updatedTotalHarga } : row
    )

    setRows(updatedRows)

    return { ...updatedRow, totalharga: updatedTotalHarga }
  }

  const handleProcessRowUpdateError = (error) => {
    console.error('Error updating row:', error)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rows.length === 0) {
      setAlert('warning')
      setMessage('Pastikan produk telah dipilih')

      return
    }

    if (!metode){
      setAlert('error')
      setMessage('Pilih Salah Satu Metode Pembayaran')

      return
    }

    const payload = {
      userId: session.user?.id,
      metode: metode,
      pelangganId: selectedPelanggan?.id || null,
      pelangganNama: selectedPelanggan?.nama || data.pelangganNama || '-',
      produk: rows
    }

    try {
      const response = await fetch('/api/tambah-transaksi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok) {
        setAlert('success')
        setMessage('Transaksi berhasil dibuat')
        setRows([])
        setSelectedPelanggan(null)
        setData(prevData => ({ ...prevData, pelangganNama: '' }))
      } else {
        setAlert('error')
        setMessage(result.error || 'Terjadi kesalahan saat membuat transaksi')
      }
    } catch (error) {
      console.error('Error membuat transaksi:', error)
      setAlert('error')
      setMessage('Terjadi kesalahan saat membuat transaksi')
    }
  }

  const handleNumpadClick = (value) => {
    setData(prevData => {
      if (value === 'backspace') {
        return { ...prevData, jumlah: prevData.jumlah.slice(0, -1) }
      }

      return { ...prevData, jumlah: prevData.jumlah + value }
    })
  }

  const handleDialogOpen = () =>{
    if (rows.length === 0) {
      setAlert('warning')
      setMessage('Pastikan produk telah dipilih')

      return
    }

    if (!metode){
      setAlert('error')
      setMessage('Pilih Salah Satu Metode Pembayaran')

      return
    }

    setDialogOpen(true)
  }

  const handleDialogClose = () => setDialogOpen(false)

  const columns = [
    { field: 'nama', headerName: 'Produk', width: 200, headerClassName:'app-theme--header', },
    { field: 'harga', headerName: 'Harga', width: 110, headerClassName:'app-theme--header', renderCell: (params) => <div>{formatCurrency(params.value)}</div> },
    { field: 'jumlah', headerName: 'Jumlah', width: 100, headerClassName:'app-theme--header', editable: true },
    { field: 'totalharga', headerName: 'Total Harga', width: 150, headerClassName:'app-theme--header', renderCell: (params) => <div>{formatCurrency(params.value)}</div> },
    {
      field: 'hapus',
      headerClassName:'app-theme--header',
      headerName: 'Hapus',
      width: 70,
      renderCell: (params) => (
        <IconButton
          size='large'
          variant="contained"
          color="error"
          onClick={() => handleRemoveClick(params.row)}
          > <DeleteIcon/>
        </IconButton>
      ),
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produkResponse, pelangganResponse] = await Promise.all([
          fetch(`/api/data-produk?userId=${session.user.id}`),
          fetch(`/api/data-pelanggan?userId=${session.user.id}`)
        ])

        const produkData = await produkResponse.json()
        const pelangganData = await pelangganResponse.json()

        setProducts(produkData)
        setPelanggans(pelangganData)
      } catch (error) {
        console.error('Error mengambil data produk dan pelanggan', error)
      }
    }

    fetchData()
    const total = rows.reduce((sum, row) => sum + row.totalharga, 0)

    setTotalHarga(total)

    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null)
        setMessage('')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [alert, session, rows])

  return (
    <Grid container spacing={2}>
      {alert && (
        <Grid item xs={12}>
          <Alert severity={alert} style={{ marginBottom: '1rem' }}>
            {message}
          </Alert>
        </Grid>
      )}
      <Grid item xs={12} md={6} container direction="column" spacing={3}>
        <Grid item>
          <Autocomplete
            id="pelanggan"
            fullWidth
            options={pelanggans}
            getOptionLabel={(option) => option.nama}
            onChange={handlePelangganChange}
            onInputChange={handlePelangganInputChange}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.nama}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pilih / Ketik Nama Pelanggan (Opsional)"
                inputProps={{ ...params.inputProps, autoComplete: 'new-password' }}
              />
            )}
          />
        </Grid>
        <Grid item className='mt-[10px]'>
          <Autocomplete
            id="produk"
            fullWidth
            options={products}
            getOptionLabel={(option) => option.nama}
            onChange={handleProductChange}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                {option.nama} | Stok:{option.stok} | Harga:{option.harga}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pilih / Ketik Nama Produk"
                inputProps={{ ...params.inputProps, autoComplete: 'new-password' }}
              />
            )}
          />
        </Grid>
        <Grid item className='mt-[10px] mb-[10px]'>
          <TextField
            id="jumlah"
            label="Jumlah"
            name="jumlah"
            value={data.jumlah}
            onChange={handleChange}
            fullWidth
            type="number"
            InputProps={{
              startAdornment: <InputAdornment position="start">Qty</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item container spacing={1} className='mt-[10px] mb-[10px]'>
            <Button
              onClick={handleAddProduct}
              startIcon={<AddShoppingCartIcon fontSize='large' />}
              sx={{ width: '100%'}}
              size='large'
              variant="contained"
              color="primary">
              Tambah &raquo;
            </Button>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item xs={4}>
            <NumpadButton onClick={() => handleNumpadClick('1')} variant="contained">1</NumpadButton>
          </Grid>
          <Grid item xs={4}>
            <NumpadButton onClick={() => handleNumpadClick('2')} variant="contained">2</NumpadButton>
          </Grid>
          <Grid item xs={4}>
            <NumpadButton onClick={() => handleNumpadClick('3')} variant="contained">3</NumpadButton>
          </Grid>
          <Grid item xs={4}>
            <NumpadButton onClick={() => handleNumpadClick('4')} variant="contained">4</NumpadButton>
          </Grid>
          <Grid item xs={4}>
            <NumpadButton onClick={() => handleNumpadClick('5')} variant="contained">5</NumpadButton>
          </Grid>
          <Grid item xs={4}>
            <NumpadButton onClick={() => handleNumpadClick('6')} variant="contained">6</NumpadButton>
          </Grid>
          <Grid item xs={4}>
            <NumpadButton onClick={() => handleNumpadClick('7')} variant="contained">7</NumpadButton>
          </Grid>
          <Grid item xs={4}>
            <NumpadButton onClick={() => handleNumpadClick('8')} variant="contained">8</NumpadButton>
          </Grid>
          <Grid item xs={4}>
            <NumpadButton onClick={() => handleNumpadClick('9')} variant="contained">9</NumpadButton>
          </Grid>
          <Grid item xs={4}>
            <NumpadButton onClick={() => handleNumpadClick('0')} variant="contained">0</NumpadButton>
          </Grid>
          <Grid item xs={8}>
            <NumpadButton onClick={() => handleNumpadClick('backspace')} variant="contained" color='error' size='large'><BackspaceIcon fontSize='large'/></NumpadButton>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6} container direction="column" spacing={2}>

        <Grid item>
          <FormControl fullWidth>
            <InputLabel id="metode">Metode Pembayaran</InputLabel>
            <Select
              labelId="metode"
              id="metode"
              value={metode}
              label="Metode Pembayaran"
              onChange={handleMetodeChange}>
              <MenuItem value={'CASH'}>Cash</MenuItem>
              <MenuItem value={'TRANSFER'}>Transfer</MenuItem>
              <MenuItem value={'DEBIT'}>Debit / QRIS</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs className='mt-[10px]' sx={{
            '& .app-theme--header': {
              fontWeight: 'bold',
              fontSize: '1.1rem', // Adjust as needed
            },
          }}>
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50, 100]}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              processRowUpdate={handleProcessRowUpdate}
              onProcessRowUpdateError={handleProcessRowUpdateError}
            />
          </div>
        </Grid>
        <Grid item>
          <Typography variant="h3" align="center">
            Jumlah Total : {formatCurrency(totalHarga)}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={handleDialogOpen}

            // onClick={handleSubmit}
            startIcon={<SaveIcon />}
            sx={{ width: '100%'}}
            size='large'
            variant="contained"
            color="success">
            Simpan Transaksi
          </Button>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <p className='text-md font-bold'>
              Apakah Anda yakin ingin menyimpan transaksi ini?
              </p>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} variant='contained' color="error">
              Batal
            </Button>
            <Button onClick={handleSubmit} variant='contained' color="success">
              Simpan
            </Button>
          </DialogActions>
        </Dialog>
        <br />
        {/* {alert && (
        <Grid item xs={12}>
          <Alert severity={alert} style={{ marginBottom: '1rem' }}>
            {message}
          </Alert>
        </Grid>
      )} */}
    </Grid>
  )
}

export default PointOfSale
