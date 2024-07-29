'use client'

import React, { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'


const TabelKategori = () => {
  const { data: session } = useSession()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ id: '', nama: '', status: '', masterKey: '' })

  const handleClickOpen = (row) => {
    setFormData({ id: row.id, nama: row.nama, status: row.status, masterKey: '' })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (e) => {
    const { nama, value } = e.target

    setFormData({ ...formData, [nama]: value })
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/edit-kategori', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Data Kategori Berhasil diubah')
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === formData.id
              ? { ...row, nama: formData.nama, email: formData.status }
              : row
          )
        )
      } else {
        alert(result.error || 'Ada kesalahan ketika mengganti data kategori')
      }

      handleClose()
    } catch (error) {
      console.error('Error mengubah data kategori:', error)
      alert('Ada kesalahan ketika mengganti data kategori')
    }
  }

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/kategori`)
          const data = await response.json()

          // Tambahkan nomor urut
          const numberedData = data.map((row, index) => ({ ...row, no: index + 1 }))

          setRows(numberedData)
          setLoading(false)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }

      fetchData()
    }
  }, [session])

  const columns = [
    { field: 'no', headerName: 'No', width: 90 },
    { field: 'nama', headerName: 'Nama Kategori', width: 170 },
    { field: 'status', headerName: 'Status Kategori', width: 100 },
    { field: 'edit', headerName:'Edit', width: 100,
      renderCell: (params)=>(
        <Button
        variant='contained'
        color='primary'
        onClick={() => handleClickOpen(params.row)}
        sx={{borderRadius:30}}
        >
          Edit
        </Button>
      )
    },
  ]

  return (
    <div className='max-w-[100%]'>
      <br />
      <DataGrid
        rows={rows}
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
        columns={columns}
        pageSize={5}
        pageSizeOptions={[5, 10, 25]}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        loading={loading}
        getRowId={(row) => row.id} // Tetap gunakan ID asli untuk identifikasi baris
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Data Kategori</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Masukkan data yang ingin diubah.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            nama="nama"
            label="Nama Kategori"
            type="text"
            fullWidth
            value={formData.nama}
            onChange={handleChange}
          />
          <FormControl fullWidth>
            <InputLabel htmlFor='metode'>Status</InputLabel>
            <Select
              native
              label='Status'
              defaultValue={formData.status}
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
          <TextField
            margin="dense"
            nama="masterKey"
            label="MasterKey"
            type="password"
            fullWidth
            value={formData.masterKey}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="error" sx={ { borderRadius: 30 } }>
            Batal
          </Button>
          <Button variant="contained" onClick={handleSubmit} color="primary" sx={ { borderRadius: 30 } }>
            Kirim
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default TabelKategori
