import { Box, Typography, Button, Avatar } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { user, signIn, signOut, loading } = useAuth()

  const handleSignIn = async () => {
    try {
      await signIn()
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh', p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, fontFamily: '"Playfair Display", serif' }}>
        Profile
      </Typography>

      {user ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
          <Avatar
            src={user.photoURL || undefined}
            sx={{
              width: 120,
              height: 120,
              backgroundColor: '#88C9B3',
              fontSize: '3rem'
            }}
          >
            {user.displayName?.charAt(0) || 'U'}
          </Avatar>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
              {user.displayName || 'User'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.email}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={handleSignOut}
            disabled={loading}
            sx={{
              mt: 2,
              borderColor: '#d32f2f',
              color: '#d32f2f',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                borderColor: '#b71c1c',
                backgroundColor: 'rgba(211, 47, 47, 0.04)'
              }
            }}
          >
            Sign Out
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center', mt: 8 }}>
          <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
            Sign in to sync your data across devices
          </Typography>

          <Button
            variant="contained"
            onClick={handleSignIn}
            disabled={loading}
            sx={{
              backgroundColor: '#88C9B3',
              color: '#fff',
              borderRadius: 2,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': {
                backgroundColor: '#71A697'
              }
            }}
          >
            Sign In with Google
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Profile
