import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material'
import { ArrowBack, TrendingUp, CalendarMonth, Psychology, FitnessCenter } from '@mui/icons-material'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts'
import { format, subDays, differenceInDays } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import { symptomService, cycleService, journalService, type SymptomLog, type CycleData } from '../services/firestore'

interface InsightStats {
  avgCycleLength: number
  avgPeriodLength: number
  totalJournalEntries: number
  mostCommonSymptoms: { name: string; count: number }[]
  moodDistribution: { mood: string; count: number }[]
  energyTrend: { date: string; value: number }[]
  symptomsByPhase: { phase: string; symptoms: string[] }[]
}

const Insights = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [symptoms, setSymptoms] = useState<SymptomLog[]>([])
  const [cycles, setCycles] = useState<CycleData[]>([])
  const [journalCount, setJournalCount] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const [symptomsData, cyclesData, journalsData] = await Promise.all([
          symptomService.getByUser(user.uid),
          cycleService.getByUser(user.uid),
          journalService.getByUser(user.uid)
        ])

        setSymptoms(symptomsData)
        setCycles(cyclesData)
        setJournalCount(journalsData.length)
      } catch (err) {
        console.error('Error loading insights data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  const stats: InsightStats = useMemo(() => {
    // Calculate average cycle length
    let avgCycleLength = 28
    let avgPeriodLength = 5
    if (cycles.length >= 2) {
      const cycleLengths = cycles.slice(0, -1).map((cycle, index) => {
        const nextCycle = cycles[index + 1]
        return differenceInDays(cycle.startDate, nextCycle.startDate)
      }).filter(len => len > 0 && len < 60)

      if (cycleLengths.length > 0) {
        avgCycleLength = Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
      }

      const periodLengths = cycles.map(c => c.periodLength).filter(Boolean)
      if (periodLengths.length > 0) {
        avgPeriodLength = Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
      }
    }

    // Calculate most common symptoms
    const symptomCounts: { [key: string]: number } = {}
    symptoms.forEach(log => {
      log.symptoms.forEach(s => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1
      })
    })
    const mostCommonSymptoms = Object.entries(symptomCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Calculate mood distribution
    const moodCounts: { [key: string]: number } = {}
    symptoms.forEach(log => {
      if (log.mood) {
        moodCounts[log.mood] = (moodCounts[log.mood] || 0) + 1
      }
    })
    const moodDistribution = Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood, count }))

    // Energy trend over last 14 days
    const energyTrend = []
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateStr = format(date, 'yyyy-MM-dd')
      const log = symptoms.find(s => format(s.date, 'yyyy-MM-dd') === dateStr)
      energyTrend.push({
        date: format(date, 'MMM d'),
        value: log?.energyLevel || 0
      })
    }

    return {
      avgCycleLength,
      avgPeriodLength,
      totalJournalEntries: journalCount,
      mostCommonSymptoms,
      moodDistribution,
      energyTrend,
      symptomsByPhase: []
    }
  }, [symptoms, cycles, journalCount])

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
      background: '#F8F8F8',
      pb: '120px'
    }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 2,
        backgroundColor: 'white',
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
          Insights
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Box sx={{ px: 2, py: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
          {/* Cycle Length Card */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CalendarMonth sx={{ fontSize: 32, color: '#71A697', mb: 1 }} />
              <Typography sx={{
                fontSize: '2rem',
                fontWeight: 700,
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#333'
              }}>
                {stats.avgCycleLength}
              </Typography>
              <Typography sx={{
                fontSize: '0.75rem',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Avg Cycle Days
              </Typography>
            </CardContent>
          </Card>

          {/* Period Length Card */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <TrendingUp sx={{ fontSize: 32, color: '#ADD1B7', mb: 1 }} />
              <Typography sx={{
                fontSize: '2rem',
                fontWeight: 700,
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#333'
              }}>
                {stats.avgPeriodLength}
              </Typography>
              <Typography sx={{
                fontSize: '0.75rem',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Avg Period Days
              </Typography>
            </CardContent>
          </Card>

          {/* Journal Entries Card */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Psychology sx={{ fontSize: 32, color: '#DFE8ED', mb: 1 }} />
              <Typography sx={{
                fontSize: '2rem',
                fontWeight: 700,
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#333'
              }}>
                {stats.totalJournalEntries}
              </Typography>
              <Typography sx={{
                fontSize: '0.75rem',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Journal Entries
              </Typography>
            </CardContent>
          </Card>

          {/* Symptoms Logged Card */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <FitnessCenter sx={{ fontSize: 32, color: '#EAF3EC', mb: 1 }} />
              <Typography sx={{
                fontSize: '2rem',
                fontWeight: 700,
                fontFamily: 'Inter, system-ui, sans-serif',
                color: '#333'
              }}>
                {symptoms.length}
              </Typography>
              <Typography sx={{
                fontSize: '0.75rem',
                color: '#666',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}>
                Days Tracked
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Energy Trend Chart */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mb: 3 }}>
          <CardContent>
            <Typography sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: 1,
              mb: 2
            }}>
              Energy Level (14 Days)
            </Typography>
            {stats.energyTrend.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={stats.energyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: '#eee' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={{ stroke: '#eee' }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#71A697"
                    strokeWidth={2}
                    dot={{ fill: '#71A697', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, color: '#999' }}>
                <Typography>No data yet. Start tracking symptoms!</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Top Symptoms */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', mb: 3 }}>
          <CardContent>
            <Typography sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: 1,
              mb: 2
            }}>
              Top Symptoms
            </Typography>
            {stats.mostCommonSymptoms.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.mostCommonSymptoms} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ADD1B7" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, color: '#999' }}>
                <Typography>No symptoms logged yet</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography sx={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: 1,
              mb: 2
            }}>
              Mood Distribution
            </Typography>
            {stats.moodDistribution.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {stats.moodDistribution.map(({ mood, count }) => (
                  <Box
                    key={mood}
                    sx={{
                      px: 2,
                      py: 1,
                      borderRadius: '20px',
                      backgroundColor: mood === 'great' ? '#88C9B3' :
                        mood === 'good' ? '#A3D9C6' :
                          mood === 'okay' ? '#EDF0E7' :
                            mood === 'low' ? '#DFE8ED' : '#EAF3EC',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Typography sx={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'capitalize'
                    }}>
                      {mood}
                    </Typography>
                    <Typography sx={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      px: 1,
                      py: 0.25,
                      borderRadius: '10px'
                    }}>
                      {count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, color: '#999' }}>
                <Typography>No mood data yet</Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Insights
