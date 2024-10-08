"use client"

import { useState, useEffect, useRef } from 'react'

import { useSession } from 'next-auth/react'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
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
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'

const FormTambahProduk = () =>{
  const { data: session} = useSession()
  const [alert, setAlert] = useState(null)
  const [message, setMessage] = useState('')
  const [KategoriProduk, setKategoriProduk] = useState([])
  const formRef = useRef(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedKategori, setSelectedKategori] = useState(null)

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kategoriResponse = await fetch(`/api/daftar-kategori?userId=${session.user.id}`)

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
  }, [alert, session])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.target)

    console.log({
      kategoriId: selectedKategori.id,
      harga: data.get('harga'),
      hargabeli: data.get('hargabeli'),
      jenis: data.get('jenis'),
      nama: data.get('nama'),
    })

  if (!selectedKategori.id || !data.get('nama') || !data.get('harga') || !data.get('hargabeli') || !data.get('stok')) {
    setAlert('error')
    setMessage('Semua bidang harus diisi.')

    return
  }

  const formData = {
    userId: session.user.id,
    kategoriId: selectedKategori.id,
    barcode: data.get('barcode'),
    nama: data.get('nama'),
    harga: parseInt(data.get('harga')),
    jenis: data.get('jenis'),
    hargabeli: parseInt(data.get('hargabeli')),
    kadaluarsa: selectedDate ? selectedDate.toISOString() : null,
    stok: parseInt(data.get('stok')),
    satuan: data.get('satuan'),
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
        setMessage(`Produk  ${formData.nama} berhasil ditambahkan!`)
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

  const handleReset = async () => {
    formRef.current.reset()
    setSelectedDate(null)
  }

  return(
    <div>
      <div>
        <Card>
          <CardHeader title='' />
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
                    fullWidth
                    required
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
                    fullWidth
                    id='barcode'
                    name='barcode'
                    label='Barcode Produk'
                    placeholder='Barcode Produk'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className="ri-barcode-box-line"></i>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
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
                  <TextField
                    fullWidth
                    required
                    id='hargabeli'
                    name='hargabeli'
                    label='Harga Beli'
                    type='number'
                    placeholder='Harga Beli Produk'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <i className="ri-price-tag-2-line"></i>
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                <Autocomplete
                  id="kategoriproduk"
                  fullWidth
                  options={KategoriProduk}
                  getOptionLabel={(option) => option.nama}
                  value={selectedKategori}
                  onChange={(event, newValue) => setSelectedKategori(newValue)}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.id}>
                      {option.nama}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Pilih Kategori"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password'
                      }}
                    />
                  )}
                />
                </Grid>
                <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor='jenis'>Jenis Produk</InputLabel>
                  <Select
                    native
                    label='Pilih Jenis'
                    defaultValue=''
                    inputProps={{
                      name: 'jenis',
                      id: 'jenis'
                    }}
                  >
                    <option value={'BARANG'}>Barang</option>
                    <option value={'PANGAN'}>Pangan / Makanan</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label='Tanggal Kadaluarsa (jika ada)'
                      views={['year', 'month', 'day']}
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
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
                    fullWidth
                    required
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
                <Grid item xs={12}>
                {alert && (
                  <Alert severity={alert} style={{ marginBottom: '1rem' }}>
                    {message}
                  </Alert>
                )}
                </Grid>
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button variant="contained" onClick={handleReset} color="error" sx={{ borderRadius: 30 }}>
                    Reset Form
                  </Button>
                  <Button variant="contained" type="submit" color="success" sx={{ borderRadius: 30 }}>
                    Tambah Produk
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
