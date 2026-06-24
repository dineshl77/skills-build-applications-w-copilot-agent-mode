import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  // Build API URL based on environment
  let apiUrl: string
  
  if (process.env.CODESPACE_NAME) {
    // Running in GitHub Codespaces
    apiUrl = `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  } else if (process.env.NODE_ENV === 'production') {
    // Production deployment (update with your actual domain)
    apiUrl = process.env.API_URL || 'https://api.example.com'
  } else {
    // Local development
    apiUrl = `http://localhost:${process.env.PORT || 8000}`
  }

  res.json({
    apiUrl,
    environment: process.env.NODE_ENV || 'development',
    version: '0.1.0'
  })
})

export default router
