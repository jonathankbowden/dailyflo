import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, IconButton, Typography, CircularProgress, Chip } from '@mui/material'
import { Search, Edit } from '@mui/icons-material'
import { format } from 'date-fns'
import journalIcon from '../assets/journal.svg'
import { useAuth } from '../contexts/AuthContext'
import { journalService, type JournalEntry as JournalEntryType } from '../services/firestore'

const Journal = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [entries, setEntries] = useState<JournalEntryType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEntries = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const userEntries = await journalService.getByUser(user.uid)
        setEntries(userEntries)
      } catch (err) {
        console.error('Error loading journal entries:', err)
        setError('Failed to load entries')
      } finally {
        setLoading(false)
      }
    }

    loadEntries()
  }, [user])

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries

    const lowerSearch = searchQuery.toLowerCase()
    return entries.filter(
      entry =>
        entry.title.toLowerCase().includes(lowerSearch) ||
        entry.content.toLowerCase().includes(lowerSearch) ||
        entry.emotions.some(e => e.toLowerCase().includes(lowerSearch))
    )
  }, [entries, searchQuery])

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

        {/* Hello, User! */}
        <Box sx={{ px: '24px' }}>
          <Typography variant="h1" sx={{
            fontSize: '2.25rem',
            fontWeight: 400,
            mb: '24px',
            fontFamily: '"Playfair Display", serif',
            textAlign: 'left'
          }}>
            Hello, {user?.displayName?.split(' ')[0] || 'there'}!
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
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#71A697' }} />
          </Box>
        )}

        {/* Error State */}
        {error && !loading && (
          <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
            <Typography>{error}</Typography>
          </Box>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEntries.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography sx={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.25rem',
              color: '#666',
              mb: 2
            }}>
              {searchQuery ? 'No entries found' : 'No journal entries yet'}
            </Typography>
            {!searchQuery && (
              <Typography sx={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.9rem',
                color: '#999'
              }}>
                Tap the + button to create your first entry
              </Typography>
            )}
          </Box>
        )}

        {/* Entries */}
        {!loading && filteredEntries.map((entry) => (
          <Box
            key={entry.id}
            onClick={() => navigate(`/journal/${entry.id}`)}
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
              backgroundImage: `url(${entry.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop'})`,
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
              <IconButton
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/journal/edit/${entry.id}`)
                }}
                sx={{
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
                }}
              >
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
                {entry.title.toUpperCase()}
              </Box>

              {/* Emotions */}
              {entry.emotions.length > 0 && (
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                  {entry.emotions.slice(0, 3).map((emotion) => (
                    <Chip
                      key={emotion}
                      label={emotion}
                      size="small"
                      sx={{
                        backgroundColor: '#C0D5CF',
                        fontSize: '0.7rem',
                        height: 22,
                        fontFamily: 'Inter, system-ui, sans-serif'
                      }}
                    />
                  ))}
                  {entry.emotions.length > 3 && (
                    <Chip
                      label={`+${entry.emotions.length - 3}`}
                      size="small"
                      sx={{
                        backgroundColor: '#E8E8E8',
                        fontSize: '0.7rem',
                        height: 22
                      }}
                    />
                  )}
                </Box>
              )}

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
                {format(entry.date, 'MMMM d, yyyy')}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default Journal