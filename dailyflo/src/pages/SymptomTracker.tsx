import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Slider,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material'
import { ArrowBack, Check } from '@mui/icons-material'
import { format } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { symptomService, type SymptomLog } from '../services/firestore'

const symptomCategories = {
  physical: [
    { id: 'cramps', label: 'Cramps', icon: '🔥' },
    { id: 'headache', label: 'Headache', icon: '🤕' },
    { id: 'bloating', label: 'Bloating', icon: '🎈' },
    { id: 'fatigue', label: 'Fatigue', icon: '😴' },
    { id: 'backPain', label: 'Back Pain', icon: '💆' },
    { id: 'breastTenderness', label: 'Breast Tenderness', icon: '💗' }
  ],
  emotional: [
    { id: 'moodSwings', label: 'Mood Swings', icon: '🎭' },
    { id: 'anxiety', label: 'Anxiety', icon: '😰' },
    { id: 'irritability', label: 'Irritability', icon: '😤' },
    { id: 'sadness', label: 'Sadness', icon: '😢' },
    { id: 'happy', label: 'Happy', icon: '😊' },
    { id: 'calm', label: 'Calm', icon: '😌' }
  ],
  other: [
    { id: 'acne', label: 'Acne', icon: '🔴' },
    { id: 'cravings', label: 'Cravings', icon: '🍫' },
    { id: 'insomnia', label: 'Insomnia', icon: '🌙' },
    { id: 'nausea', label: 'Nausea', icon: '🤢' },
    { id: 'spotting', label: 'Spotting', icon: '💧' },
    { id: 'heavyFlow', label: 'Heavy Flow', icon: '💦' }
  ]
}

const moodOptions = [
  { value: 'great', label: 'Great', color: '#88C9B3' },
  { value: 'good', label: 'Good', color: '#A3D9C6' },
  { value: 'okay', label: 'Okay', color: '#EDF0E7' },
  { value: 'low', label: 'Low', color: '#DFE8ED' },
  { value: 'bad', label: 'Bad', color: '#EAF3EC' }
]

const SymptomTracker = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedDate] = useState(new Date())
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [severity, setSeverity] = useState<{ [key: string]: number }>({})
  const [mood, setMood] = useState<string>('')
  const [energyLevel, setEnergyLevel] = useState<number>(50)
  const [sleepQuality, setSleepQuality] = useState<number>(50)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [existingLog, setExistingLog] = useState<SymptomLog | null>(null)

  // Load existing log for today
  useEffect(() => {
    const loadExistingLog = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const log = await symptomService.getForDate(user.uid, selectedDate)
        if (log) {
          setExistingLog(log)
          setSelectedSymptoms(log.symptoms)
          setSeverity(log.severity)
          setMood(log.mood || '')
          setEnergyLevel(log.energyLevel || 50)
          setSleepQuality(log.sleepQuality || 50)
          setNotes(log.notes || '')
        }
      } catch (err) {
        console.error('Error loading symptom log:', err)
      } finally {
        setLoading(false)
      }
    }

    loadExistingLog()
  }, [user, selectedDate])

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptomId)) {
        const newSeverity = { ...severity }
        delete newSeverity[symptomId]
        setSeverity(newSeverity)
        return prev.filter(s => s !== symptomId)
      } else {
        setSeverity(prev => ({ ...prev, [symptomId]: 5 }))
        return [...prev, symptomId]
      }
    })
  }

  const handleSeverityChange = (symptomId: string, value: number) => {
    setSeverity(prev => ({ ...prev, [symptomId]: value }))
  }

  const handleSave = async () => {
    if (!user) {
      setError('Please sign in to log symptoms')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const logData = {
        userId: user.uid,
        date: selectedDate,
        symptoms: selectedSymptoms,
        severity,
        mood: mood || undefined,
        energyLevel,
        sleepQuality,
        notes: notes || undefined
      }

      if (existingLog?.id) {
        await symptomService.update(existingLog.id, logData)
      } else {
        await symptomService.log(logData)
      }

      setSuccess(true)
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      console.error('Error saving symptoms:', err)
      setError('Failed to save symptoms. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: '#71A697' }} />
      </Box>
    )
  }

  return (
    <Box sx={{
      width: '100%',
      minHeight: '100vh',
      background: 'white',
      pb: '120px'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 2,
        borderBottom: '1px solid #EFEFEF'
      }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{
          fontFamily: 'Playfair Display, serif',
          fontWeight: 400,
          flex: 1
        }}>
          Track Symptoms
        </Typography>
        <Typography sx={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          color: '#666'
        }}>
          {format(selectedDate, 'MMM d, yyyy')}
        </Typography>
      </Box>

      {/* Mood Section */}
      <Box sx={{ px: 3, py: 3, borderBottom: '1px solid #EFEFEF' }}>
        <Typography sx={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          mb: 2
        }}>
          How are you feeling today?
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {moodOptions.map(option => (
            <Button
              key={option.value}
              onClick={() => setMood(option.value)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: '20px',
                border: '2px solid',
                borderColor: mood === option.value ? '#000' : '#E0E0E0',
                backgroundColor: mood === option.value ? option.color : 'white',
                color: '#000',
                textTransform: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: option.color,
                  borderColor: '#000'
                }
              }}
            >
              {option.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Energy & Sleep Sliders */}
      <Box sx={{ px: 3, py: 3, borderBottom: '1px solid #EFEFEF' }}>
        <Box sx={{ mb: 3 }}>
          <Typography sx={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            mb: 1
          }}>
            Energy Level
          </Typography>
          <Slider
            value={energyLevel}
            onChange={(_, value) => setEnergyLevel(value as number)}
            sx={{
              color: '#71A697',
              '& .MuiSlider-thumb': { backgroundColor: '#71A697' }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
            <span>Low</span>
            <span>High</span>
          </Box>
        </Box>

        <Box>
          <Typography sx={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 600,
            fontSize: '0.875rem',
            mb: 1
          }}>
            Sleep Quality
          </Typography>
          <Slider
            value={sleepQuality}
            onChange={(_, value) => setSleepQuality(value as number)}
            sx={{
              color: '#71A697',
              '& .MuiSlider-thumb': { backgroundColor: '#71A697' }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
            <span>Poor</span>
            <span>Great</span>
          </Box>
        </Box>
      </Box>

      {/* Physical Symptoms */}
      <Box sx={{ px: 3, py: 3, borderBottom: '1px solid #EFEFEF' }}>
        <Typography sx={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          mb: 2
        }}>
          Physical Symptoms
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {symptomCategories.physical.map(symptom => (
            <Button
              key={symptom.id}
              onClick={() => handleSymptomToggle(symptom.id)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: '20px',
                border: '2px solid',
                borderColor: selectedSymptoms.includes(symptom.id) ? '#000' : '#E0E0E0',
                backgroundColor: selectedSymptoms.includes(symptom.id) ? '#C0D5CF' : 'white',
                color: '#000',
                textTransform: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: '#C0D5CF',
                  borderColor: '#000'
                }
              }}
            >
              {symptom.icon} {symptom.label}
            </Button>
          ))}
        </Box>

        {/* Severity sliders for selected physical symptoms */}
        {selectedSymptoms.filter(s => symptomCategories.physical.some(p => p.id === s)).map(symptomId => {
          const symptom = symptomCategories.physical.find(p => p.id === symptomId)
          return (
            <Box key={symptomId} sx={{ mt: 2 }}>
              <Typography sx={{ fontSize: '0.8rem', mb: 0.5 }}>
                {symptom?.label} Severity: {severity[symptomId] || 5}/10
              </Typography>
              <Slider
                value={severity[symptomId] || 5}
                min={1}
                max={10}
                onChange={(_, value) => handleSeverityChange(symptomId, value as number)}
                sx={{ color: '#71A697' }}
              />
            </Box>
          )
        })}
      </Box>

      {/* Emotional Symptoms */}
      <Box sx={{ px: 3, py: 3, borderBottom: '1px solid #EFEFEF' }}>
        <Typography sx={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          mb: 2
        }}>
          Emotional State
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {symptomCategories.emotional.map(symptom => (
            <Button
              key={symptom.id}
              onClick={() => handleSymptomToggle(symptom.id)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: '20px',
                border: '2px solid',
                borderColor: selectedSymptoms.includes(symptom.id) ? '#000' : '#E0E0E0',
                backgroundColor: selectedSymptoms.includes(symptom.id) ? '#C0D5CF' : 'white',
                color: '#000',
                textTransform: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: '#C0D5CF',
                  borderColor: '#000'
                }
              }}
            >
              {symptom.icon} {symptom.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Other Symptoms */}
      <Box sx={{ px: 3, py: 3, borderBottom: '1px solid #EFEFEF' }}>
        <Typography sx={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          mb: 2
        }}>
          Other
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {symptomCategories.other.map(symptom => (
            <Button
              key={symptom.id}
              onClick={() => handleSymptomToggle(symptom.id)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: '20px',
                border: '2px solid',
                borderColor: selectedSymptoms.includes(symptom.id) ? '#000' : '#E0E0E0',
                backgroundColor: selectedSymptoms.includes(symptom.id) ? '#C0D5CF' : 'white',
                color: '#000',
                textTransform: 'none',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: 500,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: '#C0D5CF',
                  borderColor: '#000'
                }
              }}
            >
              {symptom.icon} {symptom.label}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Save Button */}
      <Box sx={{ px: 3, py: 4 }}>
        <Button
          fullWidth
          onClick={handleSave}
          disabled={saving}
          startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Check />}
          sx={{
            py: 2,
            borderRadius: '12px',
            backgroundColor: '#71A697',
            color: 'white',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#5e8a7e'
            },
            '&:disabled': {
              backgroundColor: '#ccc'
            }
          }}
        >
          {saving ? 'Saving...' : existingLog ? 'Update Symptoms' : 'Log Symptoms'}
        </Button>
      </Box>

      {/* Snackbars */}
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

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Symptoms logged successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default SymptomTracker
