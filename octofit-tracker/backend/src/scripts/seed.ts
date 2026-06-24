import connectDB from '../database'
import mongoose from 'mongoose'
import User from '../models/User'
import Team from '../models/Team'
import Activity from '../models/Activity'
import Workout from '../models/Workout'
import Leaderboard from '../models/Leaderboard'

/**
 * Seed the octofit_db database with test data
 * 
 * This script populates the OctoFit Tracker database with realistic sample data:
 * - 2 users: Alice and Bob
 * - 1 team: Team Octo with both users as members
 * - 2 completed activities: Alice's run (5km) and Bob's ride (20km)
 * - 2 planned workouts: Alice's morning run and Bob's evening ride
 * - Leaderboard entries aggregated from activities
 * 
 * Usage:
 *   npm --prefix octofit-tracker/backend run seed
 * 
 * The script clears existing data before seeding to ensure a clean state.
 */
async function seed() {
  console.log('\n🌱 Starting database seed...')
  console.log('Seed the octofit_db database with test data\n')

  await connectDB()

  try {
    // Clear existing data
    console.log('📦 Clearing existing data...')
    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Workout.deleteMany({}),
      Leaderboard.deleteMany({})
    ])
    console.log('✓ Cleared all collections\n')

    // Create users
    console.log('👥 Creating users...')
    const alice = await User.create({ name: 'Alice', email: 'alice@example.com' })
    const bob = await User.create({ name: 'Bob', email: 'bob@example.com' })
    console.log(`✓ Created users: ${alice.name}, ${bob.name}\n`)

    // Create team
    console.log('🏆 Creating team...')
    const team = await Team.create({ name: 'Team Octo', members: [alice._id, bob._id] })
    alice.team = team._id
    bob.team = team._id
    await alice.save()
    await bob.save()
    console.log(`✓ Created team: ${team.name} with ${team.members.length} members\n`)

    // Create activities
    console.log('🏃 Creating activities...')
    const aliceActivity = await Activity.create({
      user: alice._id,
      team: team._id,
      type: 'run',
      distance: 5,
      duration: 30,
      calories: 300
    })
    const bobActivity = await Activity.create({
      user: bob._id,
      team: team._id,
      type: 'ride',
      distance: 20,
      duration: 60,
      calories: 600
    })
    console.log(`✓ Created activities: Alice's ${aliceActivity.type} (${aliceActivity.distance}km), Bob's ${bobActivity.type} (${bobActivity.distance}km)\n`)

    // Create workouts
    console.log('🗓️  Creating workouts...')
    const tomorrow = new Date(Date.now() + 86400000)
    const nextWeek = new Date(Date.now() + 7 * 86400000)
    const aliceWorkout = await Workout.create({
      user: alice._id,
      team: team._id,
      title: 'Morning Run',
      description: 'Easy pace 5km run to start the day',
      type: 'run',
      targetDistance: 5,
      targetDuration: 30,
      scheduledDate: tomorrow,
      completed: false
    })
    const bobWorkout = await Workout.create({
      user: bob._id,
      team: team._id,
      title: 'Evening Ride',
      description: 'Moderate intensity 20km bike ride',
      type: 'ride',
      targetDistance: 20,
      targetDuration: 60,
      scheduledDate: nextWeek,
      completed: false
    })
    console.log(`✓ Created workouts: ${aliceWorkout.title}, ${bobWorkout.title}\n`)

    // Create leaderboard entries
    console.log('📊 Creating leaderboard entries...')
    await Leaderboard.create({ scope: 'user', entity: alice._id, score: 5, period: 'all' })
    await Leaderboard.create({ scope: 'user', entity: bob._id, score: 20, period: 'all' })
    await Leaderboard.create({ scope: 'team', entity: team._id, score: 25, period: 'all' })
    console.log('✓ Created leaderboard entries\n')

    // Verify data
    console.log('✅ Verifying seeded data...\n')
    const userCount = await User.countDocuments()
    const teamCount = await Team.countDocuments()
    const activityCount = await Activity.countDocuments()
    const workoutCount = await Workout.countDocuments()
    const leaderboardCount = await Leaderboard.countDocuments()

    console.log('📈 Data Summary:')
    console.log(`   Users: ${userCount}`)
    console.log(`   Teams: ${teamCount}`)
    console.log(`   Activities: ${activityCount}`)
    console.log(`   Workouts: ${workoutCount}`)
    console.log(`   Leaderboard Entries: ${leaderboardCount}\n`)

    // Fetch and display sample data to verify API route compatibility
    console.log('🔍 Sample data verification:\n')

    const allUsers = await User.find().lean()
    console.log(`📍 Users retrieved: ${allUsers.length}`)
    allUsers.forEach((u: any) => console.log(`   - ${u.name} (${u.email})`))

    const allTeams = await Team.findOne().populate('members').lean()
    if (allTeams) {
      console.log(`\n📍 Team retrieved: ${allTeams.name}`)
      console.log(`   Members: ${(allTeams.members as any[]).length}`)
    }

    const leaderboardTop = await Leaderboard.find({ scope: 'user' }).sort({ score: -1 }).limit(2).lean()
    console.log(`\n📍 Top users on leaderboard: ${leaderboardTop.length}`)
    leaderboardTop.forEach((entry: any) => console.log(`   Score: ${entry.score}`))

    console.log('\n✨ Seed complete! Database ready for use.\n')

    await mongoose.disconnect()
  } catch (err) {
    console.error('❌ Seed failed:', err)
    await mongoose.disconnect()
    process.exit(1)
  }
}

seed().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
