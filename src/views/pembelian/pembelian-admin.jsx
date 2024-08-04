'use client'

import React, { useEffect, useState, useRef } from 'react'

import { useSession } from 'next-auth/react'
import {
  Grid, Button, TextField, InputAdornment, Alert, FormControl, InputLabel
} from '@mui/material'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import { DataGrid } from '@mui/x-data-grid'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const FormPembelianProduk = () => {
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
  const formRef = useRef(null)

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
      const response = await fetch('/api/tambah-pembelian', {
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
    { field: 'jumlah', headerName: 'Jumlah', width: 150 },
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
      <Button variant="contained" color="primary" onClick={handleAddProduct}>
        Tambah
      </Button>
      <br />

      <Box sx={{ height: 400, width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </Box>
      <br />

      {alert && (
        <Alert severity={alert} style={{ marginBottom: '1rem' }}>
          {message}
        </Alert>
      )}

      <br />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ marginTop: 2 }}
      >
        Buat Pembelian
      </Button>
    </div>
  )
}

export default FormPembelianProduk
