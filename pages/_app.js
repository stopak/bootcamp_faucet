import '../styles/globals.css'
import { ProvideState } from '../utils/state';
import { ProvideAuth } from '../utils/auth';
import { Toaster } from 'react-hot-toast';

import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: 'rgb(220, 0, 78)',
    },
    background: {
      default: '#fff',
      paper: '#fff',
    },
    neutral: {
      main: '#ffffff',
      contrastText: '#000',
    },
  },
});

function MyApp({ Component, pageProps }) {
  return <>
    <ProvideAuth>
      <ProvideState>
        <ThemeProvider theme={theme}>

          <Toaster />

          <Component {...pageProps} />
        </ThemeProvider>

      </ProvideState>
    </ProvideAuth>

  </>
}

export default MyApp
