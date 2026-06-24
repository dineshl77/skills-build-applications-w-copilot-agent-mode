import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  team?: mongoose.Types.ObjectId
  createdAt: Date
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model<IUser>('User', UserSchema)
