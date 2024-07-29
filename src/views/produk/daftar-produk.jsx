'use client'

import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { useSession } from 'next-auth/react'
import { DataGrid} from '@mui/x-data-grid'
import { Button} from '@mui/material'
import Box from '@mui/material/Box'

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const DaftarProduk = () =>{
  const router = useRouter()
  const { data: session } = useSession()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/data-produk?userId=${session.user.id}`)
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
    { field: 'no', headerName: 'No', headerClassName:'app-theme--header', width: 90 },
    { field: 'nama', headerName: 'Produk', headerClassName:'app-theme--header', width: 170 },
    { field: 'stok', headerName: 'Stok', headerClassName:'app-theme--header', width: 100 },
    { field: 'satuan', headerName: 'Satuan', headerClassName:'app-theme--header', width: 100},
    { field: 'harga', headerName: 'Harga', headerClassName:'app-theme--header', width: 110},
    { field: 'kategori', headerName: 'Kategori', headerClassName:'app-theme--header', width: 150},
    {
      field: 'edit',
      disableExport: true,
      headerName: 'Edit',
      headerClassName:'app-theme--header',
      width: 100,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleEditClick(params.row)}>
          Edit &raquo;
        </Button>
      ),
    },
  ]

  const handleEditClick = (row) => {
    if (row && row.id) {
      router.push(`/dashboard/edit-produk/${row.id}`)
    } else {
      console.error('ID tidak valid:', row)
    }
  }

  return(
    <div>
      <div>
      <Box
          sx={{
            height: 400,
            width: '100%',
            '& .app-theme--header': {
              fontWeight: 'bold',
              fontSize: '1.1rem', // Adjust as needed
            },
          }}
        >
          <DataGrid
            rows={rows}

            // slots={{ toolbar: GridToolbar, printOptions:{
            //   pageStyle: '.MuiDataGrid-root .MuiDataGrid-main { color: rgba(0, 0, 0, 0.87); }',
            //   hideToolbar: true,
            //   hideFooter: true,
            // } }}
            columns={columns}
            pageSize={5}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            loading={loading}
            getRowId={(row) => row.id} // Tetap gunakan ID asli untuk identifikasi baris
          />
        </Box>
      </div>

    </div>
  )
}

export default DaftarProduk
