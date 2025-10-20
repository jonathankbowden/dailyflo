import { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material'
import { Google } from '@mui/icons-material'
import { useAuth } from '../contexts/AuthContext'

const Login = () => {
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      await signIn()
    } catch (error) {
      console.error('Sign in error:', error)
      setError('Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        p: 3
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 400,
                color: '#88C9B3',
                mb: 2
              }}
            >
              Welcome to FLO
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Sign in to access your cycle tracking, journal, and meditation features.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Google />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{
              backgroundColor: '#88C9B3',
              color: 'white',
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#71A697'
              },
              '&:disabled': {
                backgroundColor: '#ccc'
              }
            }}
          >
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 3 }}
          >
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login
