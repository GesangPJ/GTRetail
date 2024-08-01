'use client'

import React, { useEffect, useState, useRef } from 'react'

import { Grid, Button, TextField, InputAdornment, Alert, FormControl, InputLabel } from '@mui/material'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'

const FormAturStok = () => {
  const [data, setData] = useState({
    produkId: '',
    stok: ''
  })

  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [alert, setAlert] = useState(null)
  const [message, setMessage] = useState('')
  const formRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target

    setData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleProductChange = (event, value) => {
    setSelectedProduct(value)

    if (value) {
      setData(prevData => ({ ...prevData, produkId: value.id, stok: value.stok }))
    } else {
      setData(prevData => ({ ...prevData, produkId: '', stok: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/ubah-stok', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        setAlert('success')
        setMessage('Stok produk berhasil diubah')
      } else {
        setAlert('error')
        setMessage(result.error || 'Terjadi kesalahan saat mengubah stok')
      }
    } catch (error) {
      console.error('Error updating product stock:', error)
      setAlert('error')
      setMessage('Terjadi kesalahan saat mengubah stok')
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/ambil-stok')
        const result = await response.json()

        setProducts(result)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()

    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null)
        setMessage('')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [alert])

  return (
    <div>
      <Autocomplete
        id="produk"
        sx={{ width: 300 }}
        options={products}
        getOptionLabel={(option) => option.nama}
        onChange={handleProductChange}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            {option.nama} | Stok: {option.stok} | ID: {option.id}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Cari Produk"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password'
            }}
          />
        )}
      />
      <br />
      {alert && (
        <Alert severity={alert} style={{ marginBottom: '1rem' }}>
          {message}
        </Alert>
      )}
      <br />
      {selectedProduct && (
        <form onSubmit={handleSubmit} ref={formRef}>
          <Grid container spacing={5}>
            <Grid item xs={12} container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel className='text-lg font-bold'>
                    {selectedProduct.nama}
                  </InputLabel>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={9}>
                <TextField
                  className='max-w-[105px]'
                  id='stok'
                  name='stok'
                  fullWidth
                  type='number'
                  value={data.stok}
                  placeholder='Stok Produk'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className="ri-archive-stack-line"></i>
                      </InputAdornment>
                    )
                  }}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" sx={ { borderRadius: 30 } } >Ubah Stok</Button>
            </Grid>
          </Grid>
        </form>
      )}
    </div>
  )
}

export default FormAturStok
