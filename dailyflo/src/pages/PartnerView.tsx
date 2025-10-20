import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  IconButton
} from '@mui/material'
import {
  Share,
  ContentCopy,
  FavoriteRounded
} from '@mui/icons-material'
import partnerIcon from '../assets/partner.svg'

interface CyclePhase {
  name: string
  color: string
  description: string
  partnerInfo: {
    whatToExpect: string
    howToSupport: string
    mindBodySoul: string
  }
}

const cyclePhases: { [key: string]: CyclePhase } = {
  menstrual: {
    name: 'Menstrual',
    color: '#d32f2f',
    description: 'Days 1-5: Menstruation',
    partnerInfo: {
      whatToExpect: 'She may experience cramps, fatigue, and need extra rest. Energy levels are naturally lower.',
      howToSupport: 'Offer comfort items like heating pads, prepare warm meals, give space for rest, and be extra gentle.',
      mindBodySoul: 'This is a time of release and renewal. She may be more introspective and need emotional support.'
    }
  },
  follicular: {
    name: 'Follicular',
    color: '#388e3c',
    description: 'Days 6-13: Building energy',
    partnerInfo: {
      whatToExpect: 'Energy is increasing, creativity is flowing, and she may be more optimistic and social.',
      howToSupport: 'Great time for new activities together, planning adventures, and supporting her creative projects.',
      mindBodySoul: 'She feels renewed and ready for growth. Perfect time for new beginnings and setting goals together.'
    }
  },
  ovulatory: {
    name: 'Ovulatory',
    color: '#ffa000',
    description: 'Days 14-16: Peak energy',
    partnerInfo: {
      whatToExpect: 'Peak confidence, social energy, and communication. She may feel most attractive and charismatic.',
      howToSupport: 'Enjoy social activities together, deep conversations, and appreciate her radiant energy.',
      mindBodySoul: 'Her feminine energy is at its peak. A beautiful time for connection, intimacy, and celebration.'
    }
  },
  luteal: {
    name: 'Luteal',
    color: '#7b1fa2',
    description: 'Days 17-28: Preparing for next cycle',
    partnerInfo: {
      whatToExpect: 'May experience PMS symptoms, need more alone time, and be more sensitive emotionally.',
      howToSupport: 'Be patient with mood changes, help with tasks, provide comfort foods, and offer extra emotional support.',
      mindBodySoul: 'A time for slowing down and reflection. She may need more understanding and gentle care.'
    }
  }
}

const PartnerView = () => {
  const [sharingEnabled, setSharingEnabled] = useState(false)
  const [partnerEmail, setPartnerEmail] = useState('')
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
  const [phaseDialogOpen, setPhaseDialogOpen] = useState(false)
  const [shareLink] = useState('https://dailyflo.app/partner/abc123') // Demo link

  // Simulated current cycle data
  const currentDay = 12
  const currentPhase = 'follicular'
  const nextPhase = 'ovulatory'
  const daysToNextPhase = 2

  const handleShareInvite = () => {
    // In a real app, this would send an actual invitation
    console.log('Sending invitation to:', partnerEmail)
    setShareDialogOpen(false)
    setSharingEnabled(true)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    // In a real app, you'd show a toast notification
  }

  const handlePhaseClick = (phase: string) => {
    setSelectedPhase(phase)
    setPhaseDialogOpen(true)
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
            <img src={partnerIcon} alt="Partner" style={{ width: 26, height: 28, filter: 'brightness(0)' }} />
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
            Partner Sharing
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
            HELP YOUR PARTNER UNDERSTAND AND SUPPORT YOU
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

      {/* Sharing Controls */}
      <Box sx={{ px: '24px', mb: '32px' }}>
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
              Share Your Cycle with Your Partner
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#666',
              mb: 3,
              lineHeight: 1.6
            }}>
              Help your significant other understand and support you better by sharing your cycle phases
              and what each phase means for your mind, body, and soul.
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={sharingEnabled}
                  onChange={(e) => setSharingEnabled(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#88C9B3',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#88C9B3',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Enable partner sharing
                </Typography>
              }
            />

            {!sharingEnabled && (
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Share />}
                  onClick={() => setShareDialogOpen(true)}
                  sx={{
                    backgroundColor: '#88C9B3',
                    color: 'white',
                    textTransform: 'none',
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    '&:hover': {
                      backgroundColor: '#71A697'
                    }
                  }}
                >
                  Invite Partner
                </Button>
              </Box>
            )}

            {sharingEnabled && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="success" sx={{ 
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: '#E8F5E8',
                  color: '#2E7D32'
                }}>
                  Partner sharing is active! Your partner can now see your cycle information.
                </Alert>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    onClick={handleCopyLink}
                    sx={{
                      borderColor: '#88C9B3',
                      color: '#88C9B3',
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#71A697',
                        backgroundColor: 'rgba(136, 201, 179, 0.04)'
                      }
                    }}
                  >
                    Copy Share Link
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setSharingEnabled(false)}
                    sx={{
                      borderColor: '#d32f2f',
                      color: '#d32f2f',
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#b71c1c',
                        backgroundColor: 'rgba(211, 47, 47, 0.04)'
                      }
                    }}
                  >
                    Disable Sharing
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {sharingEnabled && (
        <>
          {/* Current Cycle Status */}
          <Box sx={{ px: '24px', mb: '32px' }}>
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
                  Current Cycle Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip
                    label={`Day ${currentDay} - ${cyclePhases[currentPhase].name}`}
                    sx={{
                      backgroundColor: cyclePhases[currentPhase].color,
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      height: 32
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Next phase: {cyclePhases[nextPhase].name} in {daysToNextPhase} days
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Partner Guide */}
          <Box sx={{ px: '24px' }}>
            <Typography variant="h6" sx={{ 
              mb: '16px',
              fontFamily: '"Playfair Display", serif',
              fontWeight: 400,
              fontSize: '1.25rem'
            }}>
              Partner Guide: Understanding Each Phase
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
              {Object.entries(cyclePhases).map(([key, phase]) => (
                <Box key={key}>
                  <Paper
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      borderRadius: 2,
                      border: '1px solid #E0E0E0',
                      backgroundColor: '#FAFAFA',
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        backgroundColor: '#F5F5F5',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      },
                      height: '100%'
                    }}
                    onClick={() => handlePhaseClick(key)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={phase.name}
                        sx={{
                          backgroundColor: phase.color,
                          color: 'white',
                          mr: 1,
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      />
                      {key === currentPhase && (
                        <Chip
                          label="Current"
                          size="small"
                          sx={{
                            backgroundColor: '#88C9B3',
                            color: 'white',
                            fontSize: '0.7rem'
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ 
                      color: '#666',
                      mb: 1,
                      fontSize: '0.8rem'
                    }}>
                      {phase.description}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#333',
                      fontSize: '0.85rem',
                      lineHeight: 1.4,
                      mb: 2
                    }}>
                      {phase.partnerInfo.whatToExpect.substring(0, 80)}...
                    </Typography>
                    <Button
                      size="small"
                      sx={{ 
                        mt: 1,
                        color: '#88C9B3',
                        textTransform: 'none',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: 'rgba(136, 201, 179, 0.04)'
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePhaseClick(key)
                      }}
                    >
                      Learn More
                    </Button>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Your Partner</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Share your cycle information with your partner to help them understand and support you better.
          </Typography>
          <TextField
            fullWidth
            label="Partner's Email"
            type="email"
            value={partnerEmail}
            onChange={(e) => setPartnerEmail(e.target.value)}
            margin="normal"
            placeholder="partner@example.com"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Your partner will receive an invitation to view your cycle phases and guidance on how to support you.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleShareInvite}
            variant="contained"
            disabled={!partnerEmail}
          >
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>

      {/* Phase Information Dialog */}
      <Dialog open={phaseDialogOpen} onClose={() => setPhaseDialogOpen(false)} maxWidth="md" fullWidth>
        {selectedPhase && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
              <FavoriteRounded sx={{ mr: 1, color: cyclePhases[selectedPhase].color }} />
              {cyclePhases[selectedPhase].name} Phase - Partner Guide
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                {cyclePhases[selectedPhase].description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom color="primary">
                What to Expect 🔍
              </Typography>
              <Typography variant="body2" paragraph>
                {cyclePhases[selectedPhase].partnerInfo.whatToExpect}
              </Typography>

              <Typography variant="h6" gutterBottom color="primary">
                How to Support Her 💝
              </Typography>
              <Typography variant="body2" paragraph>
                {cyclePhases[selectedPhase].partnerInfo.howToSupport}
              </Typography>

              <Typography variant="h6" gutterBottom color="primary">
                Mind, Body & Soul ✨
              </Typography>
              <Typography variant="body2" paragraph>
                {cyclePhases[selectedPhase].partnerInfo.mindBodySoul}
              </Typography>

              <Alert severity="info" sx={{ mt: 2 }}>
                Remember: Every woman is unique. Use this as a guide, but always communicate openly about needs and feelings.
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPhaseDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default PartnerView