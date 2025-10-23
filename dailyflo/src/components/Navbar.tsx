import {
  Box,
  IconButton
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import calendarIcon from '../assets/calendar.svg'
import journalIcon from '../assets/journal.svg'
import partnerIcon from '../assets/partner.svg'
import pauseIcon from '../assets/pause.svg'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box
      sx={{
        backgroundColor: '#000',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '88px',
        px: 4,
        borderRadius: {
          xs: 0,
          sm: '0 0 24px 24px'
        },
        flexShrink: 0
      }}
    >
      {/* Calendar Icon */}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}>
        <IconButton
          onClick={() => navigate('/')}
          sx={{
            '&:hover': { opacity: 0.7 }
          }}
        >
          <img src={calendarIcon} alt="Calendar" style={{ width: 26, height: 30 }} />
        </IconButton>
        {location.pathname === '/' && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 40,
            height: '4px',
            backgroundColor: '#88C9B3',
            borderRadius: '4px 4px 0 0'
          }} />
        )}
      </Box>

      {/* Journal Icon */}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}>
        <IconButton
          onClick={() => navigate('/journal')}
          sx={{
            '&:hover': { opacity: 0.7 }
          }}
        >
          <img src={journalIcon} alt="Journal" style={{ width: 22, height: 27 }} />
        </IconButton>
        {location.pathname === '/journal' && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 40,
            height: '4px',
            backgroundColor: '#88C9B3',
            borderRadius: '4px 4px 0 0'
          }} />
        )}
      </Box>

      {/* Spacer for center FAB */}
      <Box sx={{ width: 56 }} />

      {/* Partner Icon */}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}>
        <IconButton
          onClick={() => navigate('/partner')}
          sx={{
            '&:hover': { opacity: 0.7 }
          }}
        >
          <img src={partnerIcon} alt="Partner" style={{ width: 26, height: 28 }} />
        </IconButton>
        {location.pathname === '/partner' && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 40,
            height: '4px',
            backgroundColor: '#88C9B3',
            borderRadius: '4px 4px 0 0'
          }} />
        )}
      </Box>

      {/* Meditation Icon */}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', height: '100%' }}>
        <IconButton
          onClick={() => navigate('/meditation')}
          sx={{
            '&:hover': { opacity: 0.7 }
          }}
        >
          <img src={pauseIcon} alt="Pause" style={{ width: 29, height: 28 }} />
        </IconButton>
        {location.pathname === '/meditation' && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 40,
            height: '4px',
            backgroundColor: '#88C9B3',
            borderRadius: '4px 4px 0 0'
          }} />
        )}
      </Box>
    </Box>
  )
}

export default Navbar