import mongoose from "mongoose"

// MongoDB connection configuration
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit_db'

/**
 * Connect to MongoDB using Mongoose
 * Database name: octofit_db
 */
export async function connectDatabase(): Promise<typeof mongoose> {
  try {
    await mongoose.connect(MONGO_URI)
    console.log(`Connected to MongoDB at ${MONGO_URI}`)
    return mongoose
  } catch (err) {
    console.error('MongoDB connection error:', err)
    throw err
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect()
  console.log('Disconnected from MongoDB')
}

// Export mongoose for direct use if needed
export default mongoose
