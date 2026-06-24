import app from './app'
import { connectDatabase } from './database'

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000

connectDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error', err)
    app.listen(PORT, () => console.log(`Server listening on port ${PORT} (MongoDB connection failed)`))
  })
