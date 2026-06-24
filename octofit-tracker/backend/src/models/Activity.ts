import mongoose, { Schema, Document } from 'mongoose'

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId
  team?: mongoose.Types.ObjectId
  type: string
  duration?: number
  distance?: number
  calories?: number
  date: Date
  createdAt: Date
}

const ActivitySchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  type: { type: String, required: true },
  duration: { type: Number },
  distance: { type: Number },
  calories: { type: Number },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IActivity>('Activity', ActivitySchema)
