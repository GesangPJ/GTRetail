/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useState, useEffect, useRef } from 'react'

import { useSession } from 'next-auth/react'
import {
  Card, Grid, Button, TextField, CardHeader, CardContent,
  InputAdornment, Alert, FormControl, InputLabel, Dialog,
  DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material'

const ViewPengaturan = () => {
  const { data: session } = useSession()

  const [data, setData] = useState({
    nama_toko: '',
    ppn: '',
    alamat_toko: '',
    notelp_toko: '',
    email_toko: '',
    npwp_toko: '',
    siup_toko: '',
    masterKey: ''
  })

  const [alert, setAlert] = useState(null)
  const [message, setMessage] = useState('')
  const [openDialog, setOpenDialog] = useState(false) // State untuk membuka/menutup dialog
  const formRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/data-pengaturan?userId=${session.user.id}`)
        const result = await response.json()

        setData(result)
      } catch (error) {
        console.error('Error mengambil data pengaturan:', error)
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

  const handleDialogOpen = () => {
    setOpenDialog(true)
  }

  const handleDialogClose = () => {
    setOpenDialog(false)
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
        formRef.current.reset()
      } else {
        setAlert('error')
        setMessage(result.error || 'Terjadi kesalahan saat mengubah Data Pengaturan.')
        formRef.current.reset()
      }
    } catch (error) {
      setAlert('error')
      setMessage('Terjadi kesalahan saat mengubah Data Pengaturan.')
    } finally {
      setOpenDialog(false) // Tutup dialog setelah submit
    }
  }

  return (
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
                { id: 'nama_toko', label: 'Nama Toko', value: 'nama_toko' },
                { id: 'alamat_toko', label: 'Alamat Toko', value: 'alamat_toko' },
                { id: 'notelp_toko', label: 'Nomor Telepon', value: 'notelp_toko' },
                { id: 'email_toko', label: 'Email Toko', value: 'email_toko' },
                { id: 'ppn', label: 'Tarif PPn (%)', value: 'ppn' },
                { id: 'npwp_toko', label: 'NPWP Toko', value: 'npwp_toko' },
                { id: 'siup_toko', label: 'No. Izin', value: 'siup_toko' },
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
                      className=''
                      id={id}
                      name={value}
                      fullWidth
                      value={data[value]}
                      placeholder={label}
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
                <Button variant='contained' onClick={handleDialogOpen} sx={{ borderRadius: 30 }}>
                  Edit Data
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Dialog Konfirmasi */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Konfirmasi</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin mengubah data pengaturan ini?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Ya, Ubah
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ViewPengaturan
