'use client'

import React, { useEffect, useState, useRef } from 'react'

import { useSession } from 'next-auth/react'
import {
  Grid, Button, TextField, InputAdornment, Alert, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { DataGrid } from '@mui/x-data-grid'
import SaveIcon from '@mui/icons-material/Save'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import DeleteIcon from '@mui/icons-material/Delete'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const MesinKasir = () => {
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
  const formRef = useRef(null)

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

    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null)
        setMessage('')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [alert, session])

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
    setData(prevData => ({ ...prevData, produkId: '', jumlah: '', harga: '', totalharga: '' }))
  }

  const handleRemoveClick = (row) => {
    setRows(prevRows => prevRows.filter(item => item.id !== row.id))
  }

  const handleMetodeChange = (event) => {
    setMetode(event.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (rows.length === 0) {
      setAlert('warning')
      setMessage('Pastikan produk telah dipilih')

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
        headers: {
          'Content-Type': 'application/json',
        },
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

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'nama', headerName: 'Nama Produk', width: 200 },
    { field: 'harga', headerName: 'Harga Jual', width: 150, renderCell: (params) => <div>{formatCurrency(params.value)}</div>, },
    { field: 'jumlah', headerName: 'Jumlah', width: 150 },
    { field: 'totalharga', headerName: 'Total Harga', width: 150, renderCell: (params) => <div>{formatCurrency(params.value)}</div>, },
    {
      field: 'hapus',
      headerName: 'Hapus',
      width: 150,
      renderCell: (params) => (
        <Button
        variant="contained"
        color="error"
        sx={ { borderRadius: 30 } }
        onClick={() => handleRemoveClick(params.row)}
        startIcon={<DeleteIcon/>}>
          Hapus
        </Button>
      ),
    },
  ]

  return (
    <div>
      {alert && (
        <Alert severity={alert} style={{ marginBottom: '1rem' }}>
          {message}
        </Alert>
      )}

      <Autocomplete
        id="pelanggan"
        fullWidth
        sx={{ width: 300 }}
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
            label="Pilih / Ketik Pelanggan"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password'
            }}
          />
        )}
      />
      <br />

      <Autocomplete
        id="produk"
        sx={{ width: 300 }}
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
            label="Pilih Produk"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password'
            }}
          />
        )}
      />
      <br />

      <FormControl fullWidth className=' pb-[8px] '>
        <InputLabel htmlFor='metode'>Metode Pembayaran</InputLabel>
        <Select
          labelId='metode'
          placeholder='Metode Pembayaran'
          id='metode'
          value={metode} // Gunakan nilai state metode
          onChange={handleMetodeChange} // Panggil fungsi handleMetodeChange
        >
          <MenuItem value={'CASH'}>Cash</MenuItem>
          <MenuItem value={'TRANSFER'}>Transfer</MenuItem>
          <MenuItem value={'QRIS'}>QRIS</MenuItem>
        </Select>
      </FormControl>
      <br />

      <TextField
        id='jumlah'
        name='jumlah'
        label='Jumlah'
        type='number'
        value={data.jumlah}
        onChange={handleChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <TextField
        id='harga'
        name='harga'
        label='Harga Jual'
        type='number'
        value={data.harga}
        onChange={handleChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <br />
      <Button
      variant="contained"
      color="primary"
      onClick={handleAddProduct}
      sx={{ borderRadius: 30 }}
      startIcon={<AddShoppingCartIcon/>}
      >
        Tambah
      </Button>
      <br />

      <Box sx={{ height: 300, width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
        <br />
        <Button
        type="submit"
        variant="contained"
        color="success"
        size='large'
        onClick={handleSubmit}
        sx={{ borderRadius: 30 }}
        startIcon={<SaveIcon/>}
      >
        Simpan Transaksi
      </Button>
      </Box>
    </div>
  )
}

export default MesinKasir
