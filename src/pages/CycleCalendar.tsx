import { useState } from 'react'
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material'
import { CalendarToday, Close, Check } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addDays,
  addMonths,
  differenceInDays,
  isToday,
  isPast
} from 'date-fns'

interface CyclePhase {
  name: string
  color: string
  description: string
  mindBody: {
    mind: string
    body: string
    soul: string
  }
}

const cyclePhases: { [key: string]: CyclePhase } = {
  menstrual: {
    name: 'Menstrual',
    color: '#ADD1B7',
    description: 'Days 1-5: Your period',
    mindBody: {
      mind: 'You may feel more introspective and reflective. This is a time for rest and contemplation.',
      body: 'Your body is shedding the uterine lining. You may experience cramps, fatigue, and need extra rest.',
      soul: 'A time of release and renewal. Honor this natural cleansing process and be gentle with yourself.'
    }
  },
  follicular: {
    name: 'Follicular',
    color: '#EDF0E7',
    description: 'Days 6-13: Preparing to ovulate',
    mindBody: {
      mind: 'Energy is building. You may feel more creative, optimistic, and ready to take on new challenges.',
      body: 'Estrogen is rising, giving you more energy. Your skin may look clearer and you feel stronger.',
      soul: 'A time of growth and new beginnings. Perfect for setting intentions and starting new projects.'
    }
  },
  ovulatory: {
    name: 'Ovulatory',
    color: '#DFE8ED',
    description: 'Days 14-16: Peak fertility',
    mindBody: {
      mind: 'You feel confident, social, and charismatic. Communication flows easily.',
      body: 'Peak fertility with heightened senses. You may feel most attractive and energetic.',
      soul: 'Your radiant energy is at its peak. A time for connection, creativity, and self-expression.'
    }
  },
  luteal: {
    name: 'Luteal',
    color: '#EAF3EC',
    description: 'Days 17-28: Preparing for next cycle',
    mindBody: {
      mind: 'You may feel more focused on details and organization. Some mood sensitivity is normal.',
      body: 'Progesterone rises then falls. You might experience PMS symptoms and crave certain foods.',
      soul: 'A time for reflection and completion. Honor your need for slower pace and self-care.'
    }
  }
}

const CycleCalendar = () => {
  const [lastPeriod, setLastPeriod] = useState<Date>(new Date(2025, 0, 1)) // Jan 1, 2025
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [logCycleOpen, setLogCycleOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  const getCurrentPhase = (dayInCycle: number): string => {
    if (dayInCycle >= 1 && dayInCycle <= 5) return 'menstrual'
    if (dayInCycle >= 6 && dayInCycle <= 13) return 'follicular'
    if (dayInCycle >= 14 && dayInCycle <= 16) return 'ovulatory'
    if (dayInCycle >= 17 && dayInCycle <= 28) return 'luteal'
    return 'follicular'
  }

  const getDayInCycle = (date: Date): number => {
    const daysSinceLastPeriod = differenceInDays(date, lastPeriod) + 1
    return ((daysSinceLastPeriod - 1) % 28) + 1
  }

  const currentDayInCycle = getDayInCycle(new Date())
  const currentPhase = getCurrentPhase(currentDayInCycle)

  const getNextPeriodDate = (): string => {
    const nextPeriod = addDays(lastPeriod, Math.ceil(differenceInDays(new Date(), lastPeriod) / 28) * 28)
    return format(nextPeriod, 'MMM d')
  }

  const handlePhaseClick = (phase: string) => {
    setSelectedPhase(phase)
    setDialogOpen(true)
  }

  const handleLogCycle = () => {
    setLastPeriod(selectedDate)
    setLogCycleOpen(false)
  }

  // Export function to be called from App
  ;(window as any).openLogCycleModal = () => {
    setLogCycleOpen(true)
  }

  const getCalendarMonths = () => {
    const months = []
    for (let i = 0; i < 6; i++) { // Show 6 months
      const monthDate = addMonths(new Date(), i)
      const monthStart = startOfMonth(monthDate)
      const monthEnd = endOfMonth(monthDate)
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

      // Add empty cells for proper week alignment (Sunday = 0, Saturday = 6)
      const startDay = getDay(monthStart)
      const emptyDays = Array(startDay).fill(null)

      months.push({
        date: monthDate,
        days: [...emptyDays, ...days]
      })
    }
    return months
  }

  const getDayBackgroundColor = (date: Date | null) => {
    if (!date) return 'transparent'

    const dayInCycle = getDayInCycle(date)
    const isPeriodDay = dayInCycle >= 1 && dayInCycle <= 5
    const isOvulationDay = dayInCycle >= 14 && dayInCycle <= 16
    const isFollicularDay = dayInCycle >= 6 && dayInCycle <= 13
    const isLutealDay = dayInCycle >= 17 && dayInCycle <= 28

    if (isPeriodDay) {
      return '#ADD1B7'
    } else if (isFollicularDay) {
      return '#EDF0E7'
    } else if (isOvulationDay) {
      return '#DFE8ED'
    } else if (isLutealDay) {
      return '#EAF3EC'
    }

    return 'transparent'
  }

  const isPhaseTransition = (date: Date | null, position: 'start' | 'end') => {
    if (!date) return false

    const currentPhase = getCurrentPhase(getDayInCycle(date))
    const dayOfWeek = getDay(date)
    const dayOfMonth = parseInt(format(date, 'd'))
    const lastDayOfMonth = parseInt(format(endOfMonth(date), 'd'))

    if (position === 'start') {
      // Round left edge if Sunday (start of week), first day of month, or phase change
      if (dayOfWeek === 0 || dayOfMonth === 1) return true

      const prevDate = addDays(date, -1)
      const prevPhase = getCurrentPhase(getDayInCycle(prevDate))
      return currentPhase !== prevPhase
    } else {
      // Round right edge if Saturday (end of week), last day of month, or phase change
      if (dayOfWeek === 6 || dayOfMonth === lastDayOfMonth) return true

      const nextDate = addDays(date, 1)
      const nextPhase = getCurrentPhase(getDayInCycle(nextDate))
      return currentPhase !== nextPhase
    }
  }

  const getDayStyle = (date: Date | null) => {
    if (!date) return {}

    return {
      position: 'relative' as const,
      opacity: isPast(date) && !isToday(date) ? 0.5 : 1
    }
  }

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* Fixed Header */}
      <Box sx={{ position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 10, pb: 2 }}>
        <Box sx={{ px: 3, pt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <IconButton sx={{ ml: -1 }}>
              <CalendarToday />
            </IconButton>
            <Typography variant="h4" sx={{ fontWeight: 700, fontSize: '1.2rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
              FLO
            </Typography>
          </Box>

          <Typography variant="h1" sx={{ fontSize: '2.25rem', fontWeight: 400, mb: 2, fontFamily: '"Playfair Display", serif', textAlign: 'left' }}>
            Hello, Brittany!
          </Typography>

          <Typography variant="h6" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem', fontWeight: 700, mb: 0, fontFamily: 'system-ui, sans-serif', textAlign: 'left' }}>
            {currentPhase.toUpperCase()} PHASE
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: '#666', fontSize: '0.95rem', fontFamily: 'Inter, system-ui, sans-serif', textAlign: 'left' }}>
            Next Period: {getNextPeriodDate()}
          </Typography>
        </Box>

        {/* Day Headers with full-width lines */}
        <Box sx={{ position: 'relative', py: 1.5 }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              backgroundColor: '#ddd'
            }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', px: 3, gap: 0.5 }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: '#666',
                  fontFamily: 'Inter, system-ui, sans-serif'
                }}
              >
                {day}
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              backgroundColor: '#000'
            }}
          />
        </Box>
      </Box>

      {/* Scrollable Calendar Months */}
      <Box sx={{ px: 3, pt: 2 }}>
        {getCalendarMonths().map((month) => {
          const firstDayOfMonth = month.days.find(day => day !== null)

          return (
            <Box key={month.date.toString()} sx={{ mb: 6 }}>
              {/* Month label */}
              {firstDayOfMonth && (
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#999',
                    letterSpacing: '0.8px',
                    fontFamily: 'system-ui, sans-serif',
                    mb: 2
                  }}
                >
                  {format(firstDayOfMonth, 'MMM').toUpperCase()}
                </Typography>
              )}

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px 4px', rowGap: '2px' }}>
                {month.days.map((date, index) => {
                  if (!date) {
                    return <Box key={index} sx={{ height: '45px' }} />
                  }

                  const dayInCycle = getDayInCycle(date)
                  const isOvulationDay = dayInCycle >= 14 && dayInCycle <= 16

                  return (
                    <Box
                      key={date.toString()}
                      onClick={() => handlePhaseClick(getCurrentPhase(dayInCycle))}
                      sx={{
                        height: '45px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        fontSize: '1rem',
                        fontWeight: 700,
                        fontFamily: 'Inter, system-ui, sans-serif',
                        ...getDayStyle(date)
                      }}
                    >
                      {/* Phase background */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: isPhaseTransition(date, 'start') ? '2px' : '-2px',
                          right: isPhaseTransition(date, 'end') ? '2px' : '-2px',
                          height: '22px',
                          transform: 'translateY(-50%)',
                          backgroundColor: getDayBackgroundColor(date),
                          borderTopLeftRadius: isPhaseTransition(date, 'start') ? '6px' : 0,
                          borderBottomLeftRadius: isPhaseTransition(date, 'start') ? '6px' : 0,
                          borderTopRightRadius: isPhaseTransition(date, 'end') ? '6px' : 0,
                          borderBottomRightRadius: isPhaseTransition(date, 'end') ? '6px' : 0,
                          zIndex: 0
                        }}
                      />

                      {/* Date number */}
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {format(date, 'd')}
                      </Box>

                      {/* Today indicator */}
                      {isToday(date) && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '48px',
                            height: '48px',
                            border: '2px solid #000',
                            borderRadius: '50%',
                            zIndex: 2,
                            pointerEvents: 'none'
                          }}
                        />
                      )}

                      {/* Ovulation indicator */}
                      {isOvulationDay && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '3px',
                            height: '3px',
                            backgroundColor: '#555',
                            borderRadius: '50%',
                            zIndex: 1
                          }}
                        />
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )
        })}
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2, p: 1 }
        }}
      >
        {selectedPhase && (
          <>
            <DialogTitle sx={{ fontFamily: '"Playfair Display", serif', fontSize: '1.75rem', fontWeight: 500 }}>
              {cyclePhases[selectedPhase].name} Phase
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom sx={{ color: '#666', mb: 3 }}>
                {cyclePhases[selectedPhase].description}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.5, fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Mind
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                    {cyclePhases[selectedPhase].mindBody.mind}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.5, fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Body
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                    {cyclePhases[selectedPhase].mindBody.body}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.5, fontFamily: 'Inter, system-ui, sans-serif' }}>
                    Soul
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.6 }}>
                    {cyclePhases[selectedPhase].mindBody.soul}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={() => setDialogOpen(false)}
                variant="contained"
                sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Log Cycle Modal */}
      <Dialog
        open={logCycleOpen}
        onClose={() => setLogCycleOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            p: 0,
            m: 2
          }
        }}
      >
        <Box sx={{ position: 'relative', backgroundColor: '#E8E8E8', height: '80px' }}>
          <IconButton
            onClick={() => setLogCycleOpen(false)}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#f5f5f5' }
            }}
          >
            <Close />
          </IconButton>
        </Box>

        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.5px',
              mb: 4,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '1.1rem'
            }}
          >
            SELECT A START DATE:
          </Typography>

          <Box sx={{ mb: 4 }}>
            <DatePicker
              value={selectedDate}
              onChange={(newDate) => newDate && setSelectedDate(newDate)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined'
                }
              }}
            />
          </Box>

          <Button
            onClick={handleLogCycle}
            variant="outlined"
            startIcon={<Check />}
            sx={{
              borderColor: '#000',
              color: '#000',
              borderRadius: '12px',
              py: 1.5,
              px: 6,
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#000',
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            LOG CYCLE
          </Button>
        </Box>
      </Dialog>
    </Box>
  )
}

export default CycleCalendar