import mongoose from 'mongoose'
import User from './models/User'
import Team from './models/Team'
import Activity from './models/Activity'
import Workout from './models/Workout'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit'

async function seed() {
  await mongoose.connect(MONGO_URI)
  await Promise.all([User.deleteMany({}), Team.deleteMany({}), Activity.deleteMany({}), Workout.deleteMany({})])

  const alice = await User.create({ name: 'Alice', email: 'alice@example.com' })
  const bob = await User.create({ name: 'Bob', email: 'bob@example.com' })

  const team = await Team.create({ name: 'Team Octo', members: [alice._id, bob._id] })
  alice.team = team._id
  bob.team = team._id
  await alice.save()
  await bob.save()

  await Activity.create({ user: alice._id, team: team._id, type: 'run', distance: 5 })
  await Activity.create({ user: bob._id, team: team._id, type: 'ride', distance: 20 })

  // Add sample workouts
  const tomorrow = new Date(Date.now() + 86400000)
  const nextWeek = new Date(Date.now() + 7 * 86400000)
  await Workout.create({ user: alice._id, team: team._id, title: 'Morning Run', type: 'run', targetDistance: 5, scheduledDate: tomorrow })
  await Workout.create({ user: bob._id, team: team._id, title: 'Evening Ride', type: 'ride', targetDistance: 20, scheduledDate: nextWeek })

  console.log('Seed complete')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
