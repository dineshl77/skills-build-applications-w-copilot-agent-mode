import mongoose from 'mongoose'
import app from './app'

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit'

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error', err)
    app.listen(PORT, () => console.log(`Server listening on port ${PORT} (MongoDB connection failed)`))
  })
