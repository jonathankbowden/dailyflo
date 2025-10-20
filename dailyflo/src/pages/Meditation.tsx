import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Paper,
  LinearProgress,
  IconButton
} from '@mui/material'
import {
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeOff
} from '@mui/icons-material'
import pauseIcon from '../assets/pause.svg'

interface MeditationSession {
  duration: number
  label: string
  description: string
}

const meditationSessions: MeditationSession[] = [
  { duration: 5, label: '5 Minutes', description: 'Quick centering' },
  { duration: 10, label: '10 Minutes', description: 'Morning mindfulness' },
  { duration: 15, label: '15 Minutes', description: 'Deep relaxation' },
  { duration: 30, label: '30 Minutes', description: 'Extended practice' },
  { duration: 60, label: '60 Minutes', description: 'Full immersion' }
]

const Meditation = () => {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const intervalRef = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create a simple background audio context for ambient sounds
    audioRef.current = new Audio()
    // In a real app, you'd load an actual audio file here
    // For demo purposes, we'll simulate the ambient sound experience

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const startMeditation = (duration: number) => {
    setSelectedDuration(duration)
    setTimeRemaining(duration * 60) // Convert minutes to seconds
    setTotalTime(duration * 60)
    setIsPlaying(true)

    // Start the timer
    intervalRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Meditation complete
          setIsPlaying(false)
          setSelectedDuration(null)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Start ambient sound (simulated)
    if (!isMuted && audioRef.current) {
      // In a real app, you'd play the actual audio file here
      console.log('Playing ambient meditation music...')
    }
  }

  const pauseMeditation = () => {
    setIsPlaying(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (audioRef.current && !isMuted) {
      audioRef.current.pause()
    }
  }

  const resumeMeditation = () => {
    setIsPlaying(true)
    intervalRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsPlaying(false)
          setSelectedDuration(null)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const stopMeditation = () => {
    setIsPlaying(false)
    setSelectedDuration(null)
    setTimeRemaining(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = (): number => {
    if (totalTime === 0) return 0
    return ((totalTime - timeRemaining) / totalTime) * 100
  }

  if (selectedDuration !== null) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          background: 'linear-gradient(135deg, #88C9B3 0%, #A3D9C6 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          p: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <IconButton sx={{ ml: '-8px' }}>
            <img src={pauseIcon} alt="Meditation" style={{ width: 29, height: 28, filter: 'brightness(0) invert(1)' }} />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
            FLO
          </Typography>
        </Box>

        {/* Main Content */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" sx={{ 
            fontSize: '3rem', 
            fontWeight: 300, 
            mb: 2,
            fontFamily: '"Playfair Display", serif'
          }}>
            Breathe & Be Present
          </Typography>
          
          <Typography variant="h1" sx={{ 
            fontSize: '5rem', 
            fontWeight: 200, 
            mb: 2,
            fontFamily: '"Playfair Display", serif',
            letterSpacing: '-0.02em'
          }}>
            {formatTime(timeRemaining)}
          </Typography>
          
          <Typography variant="h6" sx={{ 
            opacity: 0.9,
            fontWeight: 400,
            fontSize: '1.1rem'
          }}>
            {selectedDuration} minute session
          </Typography>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ width: '80%', maxWidth: 300, mb: 6 }}>
          <LinearProgress
            variant="determinate"
            value={getProgress()}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: 3
              }
            }}
          />
        </Box>

        {/* Control Buttons */}
        <Box sx={{ display: 'flex', gap: 3, mb: 6 }}>
          {isPlaying ? (
            <IconButton
              onClick={pauseMeditation}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                width: 64,
                height: 64,
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Pause sx={{ fontSize: 32 }} />
            </IconButton>
          ) : (
            <IconButton
              onClick={resumeMeditation}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                width: 64,
                height: 64,
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.05)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <PlayArrow sx={{ fontSize: 32 }} />
            </IconButton>
          )}

          <IconButton
            onClick={stopMeditation}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              width: 64,
              height: 64,
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.3)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <Stop sx={{ fontSize: 32 }} />
          </IconButton>

          <IconButton
            onClick={toggleMute}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              width: 64,
              height: 64,
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.3)',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            {isMuted ? <VolumeOff sx={{ fontSize: 32 }} /> : <VolumeUp sx={{ fontSize: 32 }} />}
          </IconButton>
        </Box>

        {/* Meditation Quote */}
        <Typography variant="body1" sx={{ 
          textAlign: 'center', 
          opacity: 0.9, 
          maxWidth: 400,
          fontSize: '1rem',
          lineHeight: 1.6,
          px: 3
        }}>
          Focus on your breath. Allow thoughts to come and go like clouds in the sky.
          You are exactly where you need to be in this moment. 🌸
        </Typography>

        {/* End Session Button */}
        <Box sx={{ position: 'absolute', bottom: 40 }}>
          <Button
            variant="text"
            onClick={stopMeditation}
            sx={{ 
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.9rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            End Session
          </Button>
        </Box>
      </Box>
    )
  }

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
            Find Your Center
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
            TAKE A MOMENT TO CONNECT WITH YOURSELF
          </Typography>
        </Box>

        {/* Black horizontal line below subtitle - full width */}
        <Box sx={{
          width: '100%',
          height: '1px',
          backgroundColor: '#000',
          mb: '24px'
        }} />
      </Box>

      {/* Session Selection */}
      <Box sx={{ px: '24px' }}>
        <Typography variant="h6" sx={{ 
          mb: '16px',
          fontFamily: '"Playfair Display", serif',
          fontWeight: 400,
          fontSize: '1.25rem'
        }}>
          Choose Your Session Length
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
          {meditationSessions.map((session) => (
            <Box key={session.duration}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: 2,
                  border: '1px solid #E0E0E0',
                  backgroundColor: '#FAFAFA',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: '#F5F5F5'
                  }
                }}
                onClick={() => startMeditation(session.duration)}
              >
                <Typography variant="h3" sx={{ 
                  color: '#88C9B3',
                  fontWeight: 300,
                  mb: 1,
                  fontFamily: '"Playfair Display", serif'
                }}>
                  {session.duration}
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontWeight: 600,
                  mb: 0.5,
                  fontSize: '0.9rem'
                }}>
                  {session.label}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#666',
                  fontSize: '0.8rem',
                  mb: 1
                }}>
                  {session.description}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PlayArrow sx={{ fontSize: '1rem' }} />}
                  sx={{ 
                    mt: 1,
                    backgroundColor: '#88C9B3',
                    color: 'white',
                    fontSize: '0.8rem',
                    py: 0.5,
                    px: 2,
                    borderRadius: 1,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#71A697'
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    startMeditation(session.duration)
                  }}
                >
                  Begin
                </Button>
              </Paper>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Meditation Tips */}
      <Box sx={{ px: '24px', mt: '32px' }}>
        <Card sx={{ 
          borderRadius: 2,
          border: '1px solid #E0E0E0',
          backgroundColor: '#FAFAFA'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ 
              mb: 2,
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400
            }}>
              Meditation Tips ✨
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 600,
                  mb: 1,
                  color: '#333'
                }}>
                  Getting Started:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#666',
                  lineHeight: 1.6
                }}>
                  • Find a comfortable, quiet space<br />
                  • Sit with your spine straight but relaxed<br />
                  • Close your eyes or soften your gaze<br />
                  • Focus on your natural breath
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ 
                  fontWeight: 600,
                  mb: 1,
                  color: '#333'
                }}>
                  During Practice:
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#666',
                  lineHeight: 1.6
                }}>
                  • It's normal for your mind to wander<br />
                  • Gently return focus to your breath<br />
                  • Be kind and patient with yourself<br />
                  • Rest in the present moment
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Meditation