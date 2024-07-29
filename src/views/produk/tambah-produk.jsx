"use client"

import { useState, useEffect, useRef } from 'react'

import { useSession } from 'next-auth/react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'

const FormTambahProduk = () =>{
  const { data: session} = useSession()
  const [alert, setAlert] = useState(null)
  const [message, setMessage] = useState('')
  const [KategoriProduk, setKategoriProduk] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const formRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kategoriResponse = await fetch('/api/daftar-kategori/')

        const kategoriData = await kategoriResponse.json()

        setKategoriProduk(kategoriData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null)
        setMessage('')
      }, 5000)

      return () => clearTimeout(timer)
    }

    fetchData()
  }, [alert])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.target)

    // Validasi form sebelum mengirimkan
  if (!data.get('kategoriproduk') || !data.get('nama') || !data.get('harga') || !data.get('stok')) {
    setAlert('error')
    setMessage('Semua bidang harus diisi.')

    return
  }

  const formData = {
    userId: session.user.id,
    kategoriId: parseInt(data.get('kategoriproduk')),
    barcode: data.get('barcode'),
    nama: data.get('nama'),
    harga: data.get('harga'),
    stok: data.get('stok'),
    satuan: data.get('satuan'),
    gambar: '', // Will be set after the image is uploaded
    status: data.get('status'),
    keterangan: data.get('keterangan'),
  }

    try {
      const response = await fetch('/api/tambah-produk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setAlert('success')
        setMessage('Permintaan Tambah Produk berhasil dikirim!')
        formRef.current.reset() // Kosongkan form setelah berhasil didaftarkan
      } else {
        setAlert('error')
        setMessage(result.error || 'Terjadi kesalahan saat mengirim data permintaan Tambah Produk.')
      }
    } catch (error) {
      setAlert('error')
      setMessage('Terjadi kesalahan saat mengirim data.')
    }
  }

  const handleReset = async ()=>{
    formRef.current.reset()
  }

  return(
    <div>
      <div>
        <Card>
          <CardHeader title='Form Tambah Transaksi' />
          <CardContent>
            {alert && (
              <Alert severity={alert} style={{ marginBottom: '1rem' }}>
                {message}
              </Alert>
            )}
            <form onSubmit={handleSubmit} ref={formRef}>
              <Grid container spacing={5}>
              <Grid item xs={12}>
                  <TextField
                    id='nama'
                    name='nama'
                    label='Nama Produk'
                    placeholder='Nama Produk'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className="ri-file-text-line"></i>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='harga'
                    name='harga'
                    label='Harga Produk'
                    type='number'
                    placeholder='Harga Produk'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className="ri-price-tag-3-line"></i>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="anggota">Pilih Kategori</InputLabel>
                    <Select
                      label="Pilih Kategori"
                      inputProps={{
                        name: 'kategoriproduk',
                        id: 'kategoriproduk'
                      }}
                    >
                      <MenuItem value="">
                        <em>-</em>
                      </MenuItem>
                      {KategoriProduk.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='stok'
                    name='stok'
                    label='Stok Awal Produk'
                    type='number'
                    placeholder='Stok Produk'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className="ri-archive-line"></i>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='satuan'
                    name='satuan'
                    label='Satuan Produk'
                    placeholder='Satuan Produk'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className="ri-archive-line"></i>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="keterangan"
                    name="keterangan"
                    fullWidth
                    label="Keterangan"
                    placeholder="Keterangan"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <i className="ri-message-2-line"></i>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} justifyContent="center" alignItems="center">
                <Button variant="contained" onClick="handleReset" color="error" sx={ { borderRadius: 30 } }>
                    Reset Form
                  </Button>
                  <Button variant="contained" type="submit" color="success" sx={ { borderRadius: 30 } }>
                    Tambah Transaksi
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

export default FormTambahProduk
