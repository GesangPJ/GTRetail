'use client'

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';



const AdminDashboard = () => {

  return(
    <div>
      <div>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}
            direction="row"
            wrap="nowrap"
            columns={16}
      >
        <Grid item xs={8}>

        </Grid>
        <Grid item xs={8}>
        </Grid>
      </Grid>
    </Box>

      </div>
    </div>
  )
}

export default AdminDashboard


