import { connectDatabase, disconnectDatabase } from './database'
import User from './models/User'
import Team from './models/Team'
import Activity from './models/Activity'
import Workout from './models/Workout'

/**
 * Seed test data for OctoFit Tracker
 * 
 * Creates:
 * - 2 users: Alice and Bob
 * - 1 team: Team Octo with both users as members
 * - 2 completed activities: Alice's run and Bob's ride
 * - 2 planned workouts: Alice's morning run and Bob's evening ride
 * 
 * This test data is used for development and integration testing.
 */
async function seed() {
  await connectDatabase()
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
  await disconnectDatabase()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
