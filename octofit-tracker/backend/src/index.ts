import app from './app'
import connectDB from './database'

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error', err)
    app.listen(PORT, () => console.log(`Server listening on port ${PORT} (MongoDB connection failed)`))
  })
