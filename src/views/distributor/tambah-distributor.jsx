'use client'

import { useState, useRef } from 'react'

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'


const FormTambahDistributor = () => {
  const [alert, setAlert] = useState(null)
  const [message, setMessage] = useState('')
  const formRef = useRef(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.target)

    const formData = {
      nama: data.get('nama'),
      email: data.get('email'),
      notelp: data.get('notelp'),
      alamat: data.get('alamat')
    }

    try {
      const response = await fetch('/api/tambah-distributor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setAlert('success')
        setMessage('Distributor berhasil ditambahkan!')
        formRef.current.reset() // Kosongkan form setelah berhasil didaftarkan
      } else {
        setAlert('error')
        setMessage(result.error || 'Terjadi kesalahan saat menambahkan Distributor.')
      }
    } catch (error) {
      setAlert('error')
      setMessage('Terjadi kesalahan saat menambahkan Distributor.')
    }
  }

  return(
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
                  id='nama'
                  name='nama'
                  fullWidth
                  label='Nama Distributor'
                  placeholder='Nama Distributor'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className="ri-building-line"></i>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='email'
                  name='email'
                  fullWidth
                  type='email'
                  label='Email'
                  placeholder='Email Distributor'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className='ri-mail-line' />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='notelp'
                  name='notelp'
                  fullWidth
                  type='phone'
                  label='Nomor Telepon'
                  placeholder='Nomor Telepon Distributor'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className="ri-phone-line"></i>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id='alamat'
                  name='alamat'
                  fullWidth
                  type='text'
                  label='Alamat'
                  placeholder='Alamat'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <i className="ri-map-pin-line"></i>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} justifyContent="center" alignItems="center">
                <Button variant='contained' color='primary' type='submit' sx={{ borderRadius:30}}>
                  Tambah Distrubutor
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default FormTambahDistributor
