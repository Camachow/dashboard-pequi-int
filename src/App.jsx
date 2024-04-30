import { useState } from 'react'
import DashboardMain from './screens/DashboardMain'
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  typography: {
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    fontFamily: [
      'Rajdhani',
      'Arial',
      'sans-serif'
    ].join(','),
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <DashboardMain />
    </ThemeProvider>
  )
}

export default App
