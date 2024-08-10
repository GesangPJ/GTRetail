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
  const [editedRows, setEditedRows] = useState({})
  const [totalHarga, setTotalHarga] = useState(0)
  const formRef = useRef(null)



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

  const handleProcessRowUpdate = (updatedRow, originalRow) => {
    // Hitung ulang total harga berdasarkan nilai jumlah yang baru
    const updatedTotalHarga = updatedRow.jumlah * updatedRow.harga

    // Update row dengan total harga baru
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
    { field: 'jumlah', headerName: 'Jumlah', width: 150, editable:true, },
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

    // Hitung total harga keseluruhan setiap kali `rows` diperbarui
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
      <Box sx={{ display: 'flex', gap: '15px', mb: 2, alignItems: 'center' }}>
        <Button
          variant='contained'
          color='primary'
          sx={{ borderRadius: 30 }}
          onClick={handleAddProduct}
          startIcon={<AddShoppingCartIcon />}
        >
          Tambah
        </Button>

        <Box>
          <span>Jumlah Total : {formatCurrency(totalHarga)}</span>
        </Box>

        <Button
          sx={{ borderRadius: 30 }}
          variant='contained'
          color='success'
          onClick={handleSubmit}
          endIcon={<SaveIcon />}
        >
          Simpan Transaksi
        </Button>
      </Box>

      <div className='w-[100%] max-h-[250px]'>
        <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5 },
          },
        }}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
         />
      </div>
    </div>
  )
}

export default MesinKasir
