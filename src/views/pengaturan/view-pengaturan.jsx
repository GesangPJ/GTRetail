/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useState, useEffect, useRef, useSession } from 'react'

import {
  Card, Grid, Button, TextField, CardHeader, CardContent,
  InputAdornment, Alert, FormControl, InputLabel
} from '@mui/material'

const ViewPengaturan = () =>{
  const { data: session } = useSession()

  const [data, setData] = useState({
    userId:session.user.id,
    nama: '',
    ppn: '',
    alamat: '',
    notelp: '',
    email: '',
    npwp: '',
    no_izin: '',
    masterKey: ''
  })

  const [alert, setAlert] = useState(null)
  const [message, setMessage] = useState('')
  const formRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/data-pengaturan?userId=${session.user.id}`)
        const result = await response.json()

        console.log(result)

        setData(result.bpjs[0])
      } catch (error) {
        console.error('Error fetching detail data:', error)
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
  }, [alert])

  const handleChange = (e) => {
    const { name, value } = e.target

    setData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const payload = { ...data }

    try {
      const response = await fetch('/api/edit-pengaturan', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok) {
        setAlert('success')
        setMessage('Data Pengaturan berhasil diganti!')
        formRef.current.reset() // Kosongkan form setelah berhasil didaftarkan
      } else {
        setAlert('error')
        setMessage(result.error || 'Terjadi kesalahan saat mengubah Data Pengaturan.')
      }
    } catch (error) {
      setAlert('error')
      setMessage('Terjadi kesalahan saat mengubah Data Pengaturan.')
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
              {[
                { id: 'nama', label: 'Nama Toko', value: 'nama' },
                { id: 'alamat', label: 'Alamat Toko', value: 'alamat' },
                { id: 'notelp', label: 'Nomor Telepon', value: 'notelp' },
                { id: 'email', label: 'Email Toko', value: 'email' },
                { id: 'ppn', label: 'Tarif PPn', value: 'ppn' },
                { id: 'npwp', label: 'NPWP Toko', value: 'npwp' },
                { id: 'no_izin', label: 'No. Izin', value: 'no_izin' },
              ].map(({ id, label, value }) => (
                <Grid item xs={12} container alignItems="center" spacing={2} key={id}>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth>
                      <InputLabel shrink htmlFor={id} className='text-lg font-bold'>
                        {label}
                      </InputLabel>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    <TextField
                      className='max-w-[105px]'
                      id={id}
                      name={value}
                      fullWidth
                      type='number'
                      min='0'
                      max='100'
                      value={data[value]}
                      placeholder={label}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <i className="ri-percent-line"></i>
                          </InputAdornment>
                        )
                      }}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={12} container alignItems="center" spacing={2}>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel shrink htmlFor='masterKey' className='text-lg font-bold'>
                      Master Key
                    </InputLabel>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={9}>
                  <TextField
                    className='max-w-[355px]'
                    id='masterKey'
                    name='masterKey'
                    fullWidth
                    type='text'
                    value={data.masterKey}
                    placeholder='Master Key'
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} justifyContent="center" alignItems="center">
                <Button variant='contained' type='submit' sx={ { borderRadius: 30 } }>
                  Edit Data
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ViewPengaturan
