import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Box, Fab } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import CycleCalendar from './pages/CycleCalendar'
import Journal from './pages/Journal'
import Meditation from './pages/Meditation'
import PartnerView from './pages/PartnerView'
import NewJournalEntry from './pages/NewJournalEntry'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#88C9B3',
    },
    secondary: {
      main: '#A3D9C6',
    },
    background: {
      default: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Playfair Display", "Georgia", serif',
    h1: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 400,
    },
    h2: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 400,
    },
    h3: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 400,
    },
    h4: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 400,
    },
  },
})

const AppContent = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleFabClick = () => {
    if (location.pathname === '/' || location.pathname === '/journal') {
      // Navigate to new journal entry from calendar or journal page
      navigate('/journal/new')
    } else {
      // Navigate to meditation for other pages
      navigate('/meditation')
    }
  }

  const hideNavbar = location.pathname === '/journal/new'

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: {
          xs: '#ffffff',
          sm: '#e5e5e5'
        },
        minHeight: '100vh',
        minWidth: '100vw',
        p: {
          xs: 0,
          sm: 2
        }
      }}
    >
      {/* Mobile viewport container */}
      <Box
        sx={{
          width: '100%',
          maxWidth: '393px', // iPhone 16 width
          height: {
            xs: '100vh',
            sm: '852px' // iPhone 16 height
          },
          maxHeight: {
            xs: '100vh',
            sm: '852px'
          },
          backgroundColor: '#ffffff',
          boxShadow: {
            xs: 'none',
            sm: '0 0 30px rgba(0,0,0,0.2)'
          },
          borderRadius: {
            xs: 0,
            sm: '24px' // Rounded corners like a phone
          },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<CycleCalendar />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/new" element={<NewJournalEntry />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/partner" element={<PartnerView />} />
          </Routes>
        </Box>

        {/* Center FAB - positioned half above navbar */}
        {!hideNavbar && (
          <Fab
            sx={{
              position: 'absolute',
              bottom: 'calc(88px - 36px)', // navbar height minus half of FAB height
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#71A697',
              color: 'white',
              width: 72,
              height: 72,
              zIndex: 1001,
              '&:hover': {
                backgroundColor: '#5e8a7e'
              }
            }}
            onClick={handleFabClick}
          >
            <Box sx={{
              fontSize: '3rem',
              fontWeight: 300,
              fontFamily: 'sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              marginTop: '-8px'
            }}>+</Box>
          </Fab>
        )}

        {!hideNavbar && <Navbar />}
      </Box>
    </Box>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router basename="/dailyflo">
          <AppContent />
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
