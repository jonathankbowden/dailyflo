import { useState } from 'react'
import { Box, TextField, IconButton, Typography } from '@mui/material'
import { Search, Edit } from '@mui/icons-material'
import journalIcon from '../assets/journal.svg'

interface JournalEntry {
  id: string
  title: string
  date: string
  image?: string
  hasImage: boolean
}

// Mock data matching Figma design
const mockEntries: JournalEntry[] = [
  {
    id: '1',
    title: 'TITLE W/ PHOTO',
    date: 'Janurary 14, 2023',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
    hasImage: true
  },
  {
    id: '2',
    title: 'TITLE W/ NO PHOTO ENTERED',
    date: 'Janurary 14, 2023',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&auto=format&fit=crop',
    hasImage: true
  },
  {
    id: '3',
    title: 'TITLE W/ NO PHOTO ENTERED',
    date: 'Janurary 14, 2023',
    image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&auto=format&fit=crop',
    hasImage: true
  },
  {
    id: '4',
    title: 'TITLE W/ NO PHOTO ENTERED',
    date: 'Janurary 14, 2023',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop',
    hasImage: true
  },
  {
    id: '5',
    title: 'TITLE W/ NO PHOTO ENTERED',
    date: 'Janurary 14, 2023',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
    hasImage: true
  },
  {
    id: '6',
    title: 'TITLE W/ NO PHOTO ENTERED',
    date: 'Janurary 14, 2023',
    image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop',
    hasImage: true
  },
  {
    id: '7',
    title: 'TITLE W/ PHOTO',
    date: 'Janurary 14, 2023',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop',
    hasImage: true
  }
]

const Journal = () => {
  const [searchQuery, setSearchQuery] = useState('')

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
            <img src={journalIcon} alt="Journal" style={{ width: 22, height: 27, filter: 'brightness(0)' }} />
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
            WAY TO TAKE TIME TO WRITE IT DOWN.
          </Typography>
        </Box>

        {/* Black horizontal line below subtitle - full width */}
        <Box sx={{
          width: '100%',
          height: '1px',
          backgroundColor: 'black',
          mb: '12px'
        }} />
      </Box>

      {/* Search Bar */}
      <Box sx={{ px: '32px', mb: '28px' }}>
        <Box sx={{
          width: '100%',
          height: 48,
          background: '#F8F8F8',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          px: '16px',
          gap: '12px'
        }}>
          <Search sx={{ fontSize: 20, color: '#999' }} />
          <TextField
            fullWidth
            placeholder="Search keyword"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="standard"
            sx={{
              '& .MuiInput-input': {
                color: '#999',
                fontSize: 14,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 400,
                padding: 0,
                '&::placeholder': {
                  color: '#999',
                  opacity: 1
                }
              },
              '& .MuiInput-root:before': {
                borderBottom: 'none'
              },
              '& .MuiInput-root:after': {
                borderBottom: 'none'
              },
              '& .MuiInput-root:hover:not(.Mui-disabled):before': {
                borderBottom: 'none'
              }
            }}
          />
        </Box>
      </Box>

      {/* Journal Entries List */}
      <Box sx={{
        width: '100%',
        px: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        {mockEntries.map((entry) => (
          <Box
            key={entry.id}
            sx={{
              width: '100%',
              background: 'white',
              border: '1px solid #E0E0E0',
              borderRadius: '20px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              cursor: 'pointer',
              '&:hover': {
                boxShadow: '0px 6px 24px rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            {/* Image Header */}
            <Box sx={{
              width: '100%',
              height: 218,
              position: 'relative',
              overflow: 'visible',
              backgroundImage: `url(${entry.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: '16px',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.05)'
              }
            }}>
              {/* Edit Icon */}
              <IconButton sx={{
                width: 36,
                height: 36,
                background: 'white',
                borderRadius: '50%',
                zIndex: 1,
                position: 'absolute',
                bottom: -18,
                right: 16,
                '&:hover': {
                  background: '#f5f5f5'
                }
              }}>
                <Edit sx={{ fontSize: 18, color: '#507479' }} />
              </IconButton>
            </Box>

            {/* Entry Content */}
            <Box sx={{
              px: '24px',
              py: '30px',
              position: 'relative'
            }}>
              {/* Title */}
              <Box sx={{
                color: 'black',
                fontSize: 16,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                mb: '8px'
              }}>
                {entry.title}
              </Box>

              {/* Date Posted */}
              <Box sx={{
                fontSize: 12,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                color: 'black',
                mb: '4px'
              }}>
                DATE POSTED:
              </Box>
              <Box sx={{
                color: 'black',
                fontSize: 16,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 400
              }}>
                {entry.date}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Journal