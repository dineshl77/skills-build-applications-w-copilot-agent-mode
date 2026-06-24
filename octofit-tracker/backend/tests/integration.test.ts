import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../src/app'
import User from '../src/models/User'
import Team from '../src/models/Team'
import Activity from '../src/models/Activity'
import Workout from '../src/models/Workout'

let mongoServer: MongoMemoryServer | null = null

beforeAll(async () => {
  let uri: string | undefined
  try {
    mongoServer = await MongoMemoryServer.create()
    uri = mongoServer.getUri()
  } catch (err) {
    // Fallback to local MongoDB if in-memory server can't start in this environment
    uri = process.env.MONGO_URI || 'mongodb://localhost:27017/octofit_test'
    console.warn('mongodb-memory-server unavailable, falling back to', uri)
  }
  if (!uri) throw new Error('No MongoDB URI available for tests')
  await mongoose.connect(uri)
})

afterAll(async () => {
  await mongoose.disconnect()
  if (mongoServer) await mongoServer.stop()
})

beforeEach(async () => {
  await User.deleteMany({})
  await Team.deleteMany({})
  await Activity.deleteMany({})
  await Workout.deleteMany({})
})

test('create user -> create team -> add activity -> leaderboard', async () => {
  const { body: user } = await request(app).post('/api/users').send({ name: 'Test', email: 't@example.com' }).expect(201)

  const { body: team } = await request(app).post('/api/teams').send({ name: 'Winners' }).expect(201)

  await request(app).post(`/api/teams/${team._id}/members`).send({ userId: user._id }).expect(200)

  await request(app).post('/api/activities').send({ user: user._id, team: team._id, type: 'run', distance: 10 }).expect(201)

  const { body: topUsers } = await request(app).get('/api/leaderboards/top?scope=user&limit=5').expect(200)
  expect(topUsers.length).toBeGreaterThanOrEqual(1)
  const topId = topUsers[0]._id && topUsers[0]._id._id ? topUsers[0]._id._id : topUsers[0]._id
  expect(String(topId)).toEqual(String(user._id))
})

test('create workout and query by user', async () => {
  const { body: user } = await request(app).post('/api/users').send({ name: 'Athlete', email: 'athlete@example.com' }).expect(201)

  const futureDate = new Date(Date.now() + 86400000) // tomorrow
  const { body: workout } = await request(app).post('/api/workouts').send({
    user: user._id,
    title: 'Morning Run',
    type: 'run',
    targetDistance: 5,
    scheduledDate: futureDate
  }).expect(201)

  expect(workout.completed).toBe(false)

  const { body: userWorkouts } = await request(app).get(`/api/workouts?user=${user._id}`).expect(200)
  expect(userWorkouts.length).toBe(1)
  expect(userWorkouts[0].title).toEqual('Morning Run')
})

test('get API config with environment information', async () => {
  const { body: config } = await request(app).get('/api/config').expect(200)

  expect(config).toHaveProperty('apiUrl')
  expect(config).toHaveProperty('environment')
  expect(config).toHaveProperty('version')
  expect(config.version).toEqual('0.1.0')
})
