'use client'

import React, { useEffect, useState, useRef } from 'react'

import { useSession } from 'next-auth/react'
import {
  Grid, Button, TextField, InputAdornment, Alert, FormControl, InputLabel
} from '@mui/material'
import Box from '@mui/material/Box'
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

const FormPembelianKaryawan = () => {
  const {data: session} = useSession()

  const [data, setData] = useState({
    produkId: '',
    jumlah: '',
    hargabeli: '',
    distributorId: '',
  })

  const [products, setProducts] = useState([])
  const [distributors, setDistributors] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedDistributor, setSelectedDistributor] = useState(null)
  const [rows, setRows] = useState([])
  const [alert, setAlert] = useState(null)
  const [message, setMessage] = useState('')
  const [totalHarga, setTotalHarga] = useState(0)
  const formRef = useRef(null)



  const handleChange = (e) => {
    const { name, value } = e.target

    setData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleProductChange = (event, value) => {
    setSelectedProduct(value)

    if (value) {
      setData(prevData => ({ ...prevData, produkId: value.id, hargabeli: value.hargabeli }))
    } else {
      setData(prevData => ({ ...prevData, produkId: '', hargabeli: '' }))
    }
  }

  const handleDistributorChange = (event, value) => {
    setSelectedDistributor(value)

    if (value) {
      setData(prevData => ({ ...prevData, distributorId: value.id }))
    } else {
      setData(prevData => ({ ...prevData, distributorId: '' }))
    }
  }

  const handleAddProduct = () => {
    if (!selectedProduct || !data.jumlah || !data.hargabeli) {
      setAlert('warning')
      setMessage('Pastikan semua data produk telah diisi')

      return
    }

    const totalHarga = data.jumlah * data.hargabeli

    const newRow = {
      id: selectedProduct.id,
      nama: selectedProduct.nama,
      jumlah: parseInt(data.jumlah),
      totalharga: parseInt(totalHarga),
      hargabeli: parseInt(data.hargabeli),
    }

    setRows(prevRows => [...prevRows, newRow])
    setSelectedProduct(null)
    setData(prevData => ({ ...prevData, produkId: '', jumlah: '', hargabeli: '', totalharga:'', }))
  }

  const handleRemoveClick = (row) => {
    setRows(prevRows => prevRows.filter(item => item.id !== row.id))
  }

  const handleProcessRowUpdate = (updatedRow, originalRow) => {
    // Hitung ulang total harga berdasarkan nilai jumlah yang baru
    const updatedTotalHarga = updatedRow.jumlah * updatedRow.hargabeli

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

    if (!selectedDistributor || rows.length === 0) {
      setAlert('warning')
      setMessage('Pastikan distributor dan produk telah dipilih')

      return
    }

    const payload = {
      distributorId: selectedDistributor.id,
      produk: rows
    }

    console.log('Payload:', payload)

    try {
      const response = await fetch('/api/tambah-pembelian-k', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          distributorId: selectedDistributor.id,
          produk: rows
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setAlert('success')
        setMessage('Pembelian berhasil dibuat')
        setRows([])
        setSelectedDistributor(null)
      } else {
        setAlert('error')
        setMessage(result.error || 'Terjadi kesalahan saat membuat pembelian')
      }
    } catch (error) {
      console.error('Error membuat pembelian:', error)
      setAlert('error')
      setMessage('Terjadi kesalahan saat membuat pembelian')
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'nama', headerName: 'Nama Produk', width: 200 },
    { field: 'hargabeli', headerName: 'Harga Beli', width: 150, renderCell: (params) => <div>{formatCurrency(params.value)}</div>, },
    { field: 'jumlah', headerName: 'Jumlah', width: 150, editable:true, },
    { field: 'totalharga', headerName: 'Total Harga', width: 150, renderCell: (params) => <div>{formatCurrency(params.value)}</div>,},
    {
      field: 'hapus',
      headerName: 'Hapus',
      width: 150,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleRemoveClick(params.row)}>
          Hapus
        </Button>
      ),
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produkResponse, distributorResponse] = await Promise.all([
          fetch(`/api/data-produk?userId=${session.user.id}`),
          fetch(`/api/data-distributor?userId=${session.user.id}`)
        ])

        const produkData = await produkResponse.json()
        const distributorData = await distributorResponse.json()

        setProducts(produkData)
        setDistributors(distributorData)
      } catch (error) {
        console.error('Error mengambil data produk dan distributor', error)
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
      <Autocomplete
        id="distributor"
        fullWidth
        sx={{ width: 300 }}
        options={distributors}
        getOptionLabel={(option) => option.nama}
        onChange={handleDistributorChange}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.nama}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Pilih Distributor"
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
            {option.nama} | Stok: {option.stok} | Harga: {option.hargabeli}
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
        id='hargabeli'
        name='hargabeli'
        label='Harga Beli'
        type='number'
        value={data.hargabeli}
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
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ borderRadius: 30 }}
            startIcon={<SaveIcon />}
          >
            Buat Pembelian
        </Button>
      </Box>
      <br />

      <Box className='w-[100%] max-h-[250px] mt-[2px]'>
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
      </Box>
      <br />

      {alert && (
        <Alert severity={alert} style={{ marginBottom: '1rem' }}>
          {message}
        </Alert>
      )}

      <br />


    </div>
  )
}

export default FormPembelianKaryawan
