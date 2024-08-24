'use client'

import { useEffect, useState, useRef } from 'react'

import { useParams, useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Button, Dialog, DialogActions,
  DialogContent, DialogContentText,
  DialogTitle, TextField, MenuItem} from '@mui/material'
import Box from '@mui/material/Box'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { jsPDF } from "jspdf"
import autoTable from 'jspdf-autotable'
import ExcelJS from 'exceljs'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import ModeEditIcon from '@mui/icons-material/ModeEdit'
import {idr} from 'matauang'
import formatTanggal from 'formattanggal'

const DetailPage = () => {
  const params = useParams()
  const id = params.id
  const {data: session, status} = useSession()
  const router = useRouter()

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    produkId: '',
    barcode:'',
    nama: '',
    harga: '',
    hargabeli: '',
    jenis:'',
    satuan:'',
    status:'',
    keterangan:'',
   })

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({ ...formData, [name]: value })
  }

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/error/401')
    }

    const fetchData = async () => {
      try {
        if (id) {
          const response = await fetch(`/api/detail-produk?id=${id}`)

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }

          const contentType = response.headers.get('content-type')

          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Received non-JSON response')
          }

          const result = await response.json()

          setData(result)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching detail data:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [id, session, status, router])

  if (!session) {
    return null
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!data) {
    return <div>Data tidak ditemukan</div>
  }

  const rows = [
    { label: 'ID Produk', value: data.id },
    { label: 'Barcode', value: data.barcode},
    { label: 'Nama Produk', value: data.nama },
    { label: 'Harga Produk', value: idr(data.harga) },
    { label: 'Harga Beli', value: idr(data.hargabeli)},
    { label: 'Satuan', value: data.satuan},
    { label: 'Stok', value: data.stok},
    { label: 'Kategori', value: data.kategori},
    { label: 'Jenis Produk', value: data.jenis},
    { label: 'Kadaluarsa', value: formatTanggal(data.kadaluarsa)},
    { label: 'Keterangan', value: data.keterangan },
    { label: 'Status', value: data.status},
    { label: 'Dibuat / Diedit oleh ', value: data.namaKaryawan },
    { label: 'Tanggal Produk Dibuat', value: formatTanggal(data.createdAt) },
    { label: 'Tanggal Produk Diperbarui', value: formatTanggal(data.updatedAt) },
  ]

  const handleClickOpen = (row) => {
    setFormData({ produkId: data.id,
    nama: data.nama,
    barcode: data.barcode,
    harga: data.harga,
    hargabeli: parseInt(data.hargabeli),
    jenis: data.jenis,
    satuan: data.satuan,
    keterangan: data.keterangan,
    status: data.status,
    })
    setOpen(true)
  }

  const handlePrint = () => {
    const doc = new jsPDF()

    autoTable(doc, { html: '#detail-table' })
    doc.save(`detail_produk-${data.id}.pdf`)
  }

  const handleExcelExport = async () => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Detail Produk')

    worksheet.columns = [
      { header: 'Label', key: 'label', width: 30 },
      { header: 'Value', key: 'value', width: 30 },
    ]

    rows.forEach((row) => {
      worksheet.addRow(row)
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const link = document.createElement('a')

    link.href = URL.createObjectURL(blob)
    link.download = `DetailProduk-${data.id}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/edit-produk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Data Produk Berhasil diubah')
        handleClose() // Tutup dialog jika sukses
      }
      else {
        alert(result.error || 'Ada kesalahan ketika mengganti data produk')
      }

      handleClose()
    } catch (error) {
      console.error('Error mengubah data produk:', error)
      alert('Ada kesalahan ketika mengganti data produk')
    }
  }

  return (
    <div>
      <h1>Detail Produk : {data.nama} | ID : {data.id} </h1>
      <br />
      <TableContainer component={Paper}>
        <Table id="detail-table" sx={{ minWidth: 200 }} aria-label="Detail Produk" className='border-none'>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row" className='text-xl max-w-[120px]'>
                  {row.label}
                </TableCell>
                <TableCell className='text-xl'>{row.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Box sx={{ display: 'flex', gap: 15, flexWrap: 'wrap' }}>
        <Button variant='contained' color="primary" sx={ { borderRadius: 30 } } href="/dashboard/produk" size="large" >
          &laquo; Daftar Produk
        </Button>
        <Button variant='outlined' color="warning" onClick={handleClickOpen} size="large" sx={ { borderRadius: 30 } } startIcon={<ModeEditIcon/>}>
          Edit Produk
        </Button>
        <Button variant='outlined' color="error" onClick={handlePrint} size="large" sx={ { borderRadius: 30 } } startIcon={<PictureAsPdfIcon/>}>
          PDF Export
        </Button>
        <Button variant='outlined' color="success" onClick={handleExcelExport} sx={ { borderRadius: 30 } } size="large" startIcon={<ListAltIcon/>}>
          Export XLSX
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Data Produk</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="barcode"
            label="Barcode Produk"
            type="text"
            fullWidth
            value={formData.barcode}
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            name="nama"
            label="Nama Produk"
            type="text"
            fullWidth
            value={formData.nama}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="harga"
            label="Harga Produk"
            type="number"
            fullWidth
            value={formData.harga}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="hargabeli"
            label="Harga Beli Produk"
            type="number"
            fullWidth
            value={formData.hargabeli}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="satuan"
            label="Satuan"
            type="text"
            fullWidth
            value={formData.satuan}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense" className=' py-[10px]'>
            <InputLabel>Jenis</InputLabel>
            <Select
              name="jenis"
              value={formData.jenis}
              onChange={handleChange}
            >
              <MenuItem value="BARANG">Barang</MenuItem>
              <MenuItem value="PANGAN">Pangan / Makanan</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" className=' py-[10px]'>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="AKTIF">AKTIF</MenuItem>
              <MenuItem value="NONAKTIF">NONAKTIF</MenuItem>
            </Select>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            name="keterangan"
            label="Keterangan"
            type="text"
            fullWidth
            value={formData.keterangan}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose} color="error" sx={ { borderRadius: 30 } }>
            Batal
          </Button>
          <Button variant="contained" onClick={handleSubmit} color="primary" sx={ { borderRadius: 30 } }>
            Ganti Data
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  )
}

export default DetailPage
