import mongoose, { Schema, Document } from 'mongoose'

export interface IWorkout extends Document {
  user: mongoose.Types.ObjectId
  team?: mongoose.Types.ObjectId
  title: string
  description?: string
  type: string
  targetDuration?: number
  targetDistance?: number
  scheduledDate: Date
  completed: boolean
  createdAt: Date
}

const WorkoutSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, required: true },
  targetDuration: { type: Number },
  targetDistance: { type: Number },
  scheduledDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IWorkout>('Workout', WorkoutSchema)
