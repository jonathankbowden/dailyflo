import { Box, Typography, IconButton } from '@mui/material'
import pauseIcon from '../assets/pause.svg'

const Meditation = () => {
  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      pb: '120px'
    }}>
      {/* Header Section */}
      <Box sx={{ pt: '24px', pb: '16px' }}>
        {/* Top bar with icon and FLO */}
        <Box sx={{ px: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '16px' }}>
          <IconButton sx={{ ml: '-8px' }}>
            <img src={pauseIcon} alt="Meditation" style={{ width: 29, height: 28, filter: 'brightness(0)' }} />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
            FLO
          </Typography>
        </Box>

        {/* Hello, Brittany! */}
        <Box sx={{ px: '24px' }}>
          <Typography variant="h1" sx={{
            fontSize: '2.25rem',
            fontWeight: 400,
            mb: '24px',
            fontFamily: '"Playfair Display", serif',
            textAlign: 'left'
          }}>
            Hello, Brittany!
          </Typography>
        </Box>

        {/* Horizontal line above subtitle - full width */}
        <Box sx={{
          width: '100%',
          height: '1px',
          backgroundColor: '#EFEFEF',
          mb: '16px'
        }} />

        {/* Subtitle */}
        <Box sx={{ px: '24px' }}>
          <Typography variant="h6" sx={{
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            fontSize: '0.75rem',
            fontWeight: 700,
            mb: '16px',
            fontFamily: 'system-ui, sans-serif',
            textAlign: 'left',
            color: 'black'
          }}>
            TAKE A MOMENT TO PAUSE.
          </Typography>
        </Box>

        {/* Black horizontal line below subtitle - full width */}
        <Box sx={{
          width: '100%',
          height: '2px',
          backgroundColor: '#000',
          mb: '24px'
        }} />
      </Box>

      {/* Main Content - Large "Pause." text centered */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: '24px'
      }}>
        <Typography sx={{
          fontSize: '6rem',
          fontWeight: 400,
          fontFamily: '"Playfair Display", serif',
          color: 'black',
          textAlign: 'center',
          lineHeight: 1
        }}>
          Pause.
        </Typography>
      </Box>
    </Box>
  )
}

export default Meditation