// View Tabel Daftar Pelanggan

"use cient"

import React, { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import { DataGrid} from '@mui/x-data-grid'
import Box from '@mui/material/Box'

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text
  }

  return text.slice(0, maxLength) + '...'
}

const TabelPelanggan = () => {
  const { data: session } = useSession()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/data-pelanggan?userId=${session.user.id}`)
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
    { field: 'no',
      headerName: 'No.',
      headerClassName:'app-theme--header',
      width: 70 },
    { field: 'nama',
      headerName: 'Nama Pelanggan',
      headerClassName:'app-theme--header',
      width: 170 },
    { field: 'notelp',
      headerName: 'Nomor Telpon',
      headerClassName:'app-theme--header',
      width: 170,
    },
    { field: 'email',
       headerName: 'Email',
       headerClassName:'app-theme--header',
        width: 170},
    { field: 'alamat',
       headerName: 'Alamat',
        headerClassName:'app-theme--header',
        width: 150,
        renderCell: (params) => <div>{truncateText(params.value, 40)}</div>,
    },
  ]

  return(
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
  )
}

export default TabelPelanggan
