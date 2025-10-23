import React, { useRef } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { CloudUpload } from '@mui/icons-material'

interface ImageUploaderProps {
  onImageUpload: (base64Data: string) => void
  disabled?: boolean
  accept?: string
  maxSizeInMB?: number
}

export default function ImageUploader({ 
  onImageUpload, 
  disabled = false,
  accept = "image/*",
  maxSizeInMB = 5
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file")
      return
    }

    // Validate file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      alert(`File size must be less than ${maxSizeInMB}MB`)
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === 'string') {
        onImageUpload(result) // base64 image data
      }
    }
    reader.readAsDataURL(file)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Box sx={{ width: '100%' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      
      <Button
        variant="outlined"
        component="span"
        onClick={handleButtonClick}
        disabled={disabled}
        startIcon={<CloudUpload />}
        sx={{
          width: '100%',
          py: 2,
          borderColor: '#88C9B3',
          color: '#88C9B3',
          '&:hover': {
            borderColor: '#71A697',
            backgroundColor: 'rgba(136, 201, 179, 0.04)',
          },
          '&:disabled': {
            borderColor: '#e0e0e0',
            color: '#bdbdbd',
          }
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Upload Image
        </Typography>
      </Button>
      
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          textAlign: 'center', 
          mt: 1, 
          color: '#666',
          fontSize: '0.75rem'
        }}
      >
        Max size: {maxSizeInMB}MB
      </Typography>
    </Box>
  )
}
