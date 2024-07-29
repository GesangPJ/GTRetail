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

const FormTambahKategori = () =>{
  const [alert, setAlert] = useState(null)
  const [message, setMessage] = useState('')
  const formRef = useRef(null)

  useEffect(() => {

    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null)
        setMessage('')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [alert])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.target)

    // Validasi form sebelum mengirimkan
  if (!data.get('nama') || !data.get('status')) {
    setAlert('error')
    setMessage('Semua bidang harus diisi.')

    return
  }

    const formData = {
      nama: data.get('nama'),
      status: data.get('status')
    }

    try {
      const response = await fetch('/api/tambah-kategori', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setAlert('success')
        setMessage('Data Kategori Produk berhasil disimpan!')
        formRef.current.reset() // Kosongkan form setelah berhasil didaftarkan
      } else {
        setAlert('error')
        setMessage(result.error || 'Terjadi kesalahan saat menyimpan data Kategori Produk.')
      }
    } catch (error) {
      setAlert('error')
      setMessage('Terjadi kesalahan saat menyimpan data.')
    }
  }

  return(
    <div>
      <div>
        <Card>
          <CardHeader title='Form Tambah Kategori' />
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
                    label='Nama Kategori'
                    placeholder='Nama Kategori'
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
                  <FormControl>
                    <InputLabel htmlFor='metode'>Status</InputLabel>
                    <Select
                      native
                      label='Status'
                      defaultValue=''
                      inputProps={{
                        name: 'status',
                        id: 'status'
                      }}
                    >
                      {/* <option aria-label='None' value='' /> */}
                      <option value={'AKTIF'}>AKTIF</option>
                      <option value={'NONAKTIF'}>NONAKTIF</option>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} justifyContent="center" alignItems="center">
                  <Button variant='contained' type='submit' sx={ { borderRadius: 30 } }>
                    Simpan
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

export default FormTambahKategori
