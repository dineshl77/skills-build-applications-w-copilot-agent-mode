import mongoose, { Schema, Document } from 'mongoose'

export interface ILeaderboard extends Document {
  scope: 'user' | 'team'
  entity: mongoose.Types.ObjectId
  score: number
  period?: string
  generatedAt: Date
}

const LeaderboardSchema: Schema = new Schema({
  scope: { type: String, enum: ['user', 'team'], required: true },
  entity: { type: Schema.Types.ObjectId, required: true },
  score: { type: Number, required: true },
  period: { type: String, default: null },
  generatedAt: { type: Date, default: Date.now }
})

export default mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema)
