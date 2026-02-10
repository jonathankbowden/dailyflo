import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, TextField, Button, IconButton, Snackbar, Alert, CircularProgress } from '@mui/material'
import { ArrowBack, Edit } from '@mui/icons-material'
import { format, parse } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { journalService } from '../services/firestore'

const emotions = ['Hurt', 'Sad', 'Lonely', 'Angry', 'Fear', 'Shame', 'Guilt', 'Glad', 'Love']

const NewJournalEntry = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState(format(new Date(), 'MMMM d, yyyy'))
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    )
  }

  const handleSaveEntry = async () => {
    if (!user) {
      setError('Please sign in to save journal entries')
      return
    }

    if (title.trim() || content.trim() || selectedEmotions.length > 0) {
      setSaving(true)
      setError(null)

      try {
        const entryDate = parse(date, 'MMMM d, yyyy', new Date())

        await journalService.create({
          userId: user.uid,
          title: title.trim() || 'Untitled Entry',
          content: content.trim(),
          date: entryDate,
          emotions: selectedEmotions,
          imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop'
        })

        navigate('/journal')
      } catch (err) {
        console.error('Error saving journal entry:', err)
        setError('Failed to save entry. Please try again.')
      } finally {
        setSaving(false)
      }
    }
  }

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      pb: '120px'
    }}>
      {/* Back Button */}
      <Box sx={{
        width: 44,
        height: 44,
        position: 'absolute',
        left: 24,
        top: 24,
        background: '#71A697',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10
      }}
      onClick={() => navigate('/journal')}
      >
        <ArrowBack sx={{ color: 'black', fontSize: 20 }} />
      </Box>

      {/* Horizontal line below back button */}
      <Box sx={{
        width: '100%',
        height: '1px',
        background: '#EFEFEF',
        position: 'absolute',
        top: 88,
        left: 0
      }} />

      {/* Date Section */}
      <Box sx={{ px: '40px', mt: '110px', pb: '15px', borderBottom: '1px solid #EFEFEF' }}>
        <Box sx={{
          color: 'black',
          fontSize: '0.75rem',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          mb: '2px'
        }}>
          DATE:
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditingDate ? (
            <TextField
              fullWidth
              autoFocus
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onBlur={() => setIsEditingDate(false)}
              variant="standard"
              sx={{
                '& .MuiInput-input': {
                  color: '#666',
                  fontSize: '0.95rem',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 400,
                  padding: 0
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
          ) : (
            <Box sx={{
              color: '#666',
              fontSize: '0.95rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 400,
              flex: 1
            }}>
              {date}
            </Box>
          )}
          <IconButton
            onClick={() => setIsEditingDate(true)}
            sx={{
              p: 0.5,
              '&:hover': { background: 'rgba(0,0,0,0.04)' }
            }}
          >
            <Edit sx={{ fontSize: 18, color: '#666' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Feeling Label */}
      <Box sx={{
        px: '40px',
        mt: '15px',
        mb: '10px'
      }}>
        <Box sx={{
          color: 'black',
          fontSize: 22,
          fontFamily: 'Playfair Display, serif',
          fontWeight: 400
        }}>
          Feeling:
        </Box>
      </Box>

      {/* Emotions Row */}
      <Box sx={{
        width: '100%',
        px: '40px',
        display: 'flex',
        gap: '12px',
        overflowX: 'auto',
        pb: '24px',
        borderBottom: '1px solid #EFEFEF',
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none'
      }}>
        {emotions.map((emotion) => {
          const isSelected = selectedEmotions.includes(emotion)
          return (
            <Button
              key={emotion}
              onClick={() => handleEmotionToggle(emotion)}
              sx={{
                minWidth: 110,
                height: 44,
                background: isSelected ? '#C0D5CF' : '#F8F8F8',
                border: '1.5px solid black',
                borderRadius: '6px',
                flexShrink: 0,
                textTransform: 'none',
                px: 2,
                '&:hover': {
                  background: isSelected ? '#B0C5BF' : '#E8E8E8'
                }
              }}
            >
              <Box sx={{
                textAlign: 'center',
                color: 'black',
                fontSize: 20,
                fontFamily: 'Playfair Display, serif',
                fontWeight: 400
              }}>
                {emotion}
              </Box>
            </Button>
          )
        })}
      </Box>

      {/* Entry Card */}
      <Box sx={{
        width: 'calc(100% - 80px)',
        maxWidth: 600,
        height: 420,
        mx: 'auto',
        mt: '25px',
        background: 'white',
        border: '1px solid #E0E0E0',
        borderRadius: '20px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header Image Preview */}
        <Box sx={{
          width: '100%',
          height: 48,
          position: 'relative',
          overflow: 'visible',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: '16px',
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 65%',
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

        {/* Title */}
        <Box sx={{ px: '30px', mt: '30px' }}>
          <TextField
            fullWidth
            placeholder="ENTER TITLE HERE"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="standard"
            sx={{
              '& .MuiInput-input': {
                color: '#888888',
                fontSize: 18,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 700,
                padding: 0,
                letterSpacing: '1px',
                '&::placeholder': {
                  color: '#888888',
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

        {/* Content */}
        <Box sx={{ px: '30px', mt: '30px' }}>
          <TextField
            fullWidth
            multiline
            rows={8}
            placeholder="Start typing here…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="standard"
            sx={{
              '& .MuiInput-input': {
                color: '#B8B8B8',
                fontSize: 16,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 400,
                padding: 0,
                lineHeight: '1.8',
                '&::placeholder': {
                  color: '#B8B8B8',
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

      {/* Bottom Buttons */}
      <Box sx={{
        width: 'calc(100% - 80px)',
        maxWidth: 600,
        mx: 'auto',
        mt: '28px',
        mb: '20px',
        display: 'flex',
        gap: '16px',
        justifyContent: 'center'
      }}>
        {/* Log Cycle Button */}
        <Button
          sx={{
            minWidth: 160,
            height: 55,
            background: 'white',
            border: '2px solid black',
            borderRadius: '6px',
            textTransform: 'none',
            '&:hover': {
              background: '#f8f8f8'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <Box sx={{
              width: 22,
              height: 22,
              border: '2px solid #365C62',
              borderRadius: '50%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{
                width: 10,
                height: 7,
                borderLeft: '2px solid #365C62',
                borderBottom: '2px solid #365C62',
                transform: 'rotate(-45deg) translateY(-1px)'
              }} />
            </Box>
            <Box sx={{
              color: 'black',
              fontSize: 14,
              fontFamily: 'Inter',
              fontWeight: 700,
              letterSpacing: '0.3px'
            }}>
              LOG CYCLE
            </Box>
          </Box>
        </Button>

        {/* Save Button */}
        <Button
          onClick={handleSaveEntry}
          disabled={saving}
          sx={{
            minWidth: 140,
            height: 55,
            background: 'white',
            border: '2px solid black',
            borderRadius: '6px',
            textTransform: 'none',
            '&:hover': {
              background: '#f8f8f8'
            },
            '&:disabled': {
              background: '#f0f0f0',
              borderColor: '#ccc'
            }
          }}
        >
          {saving ? (
            <CircularProgress size={24} sx={{ color: '#365C62' }} />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box sx={{
                width: 18,
                height: 18,
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}>
                <Box sx={{
                  width: 14,
                  height: 9,
                  border: '2px solid #365C62',
                  borderTop: 'none',
                  borderRadius: '0 0 3px 3px'
                }} />
                <Box sx={{
                  width: 7,
                  height: 11,
                  border: '2px solid #365C62',
                  borderBottom: 'none',
                  position: 'absolute',
                  top: 0,
                  borderRadius: '3px 3px 0 0'
                }} />
              </Box>
              <Box sx={{
                color: 'black',
                fontSize: 14,
                fontFamily: 'Inter',
                fontWeight: 700,
                letterSpacing: '0.3px'
              }}>
                SAVE
              </Box>
            </Box>
          )}
        </Button>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default NewJournalEntry
