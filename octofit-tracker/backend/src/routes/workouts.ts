import { Router } from 'express'
import Workout from '../models/Workout'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const workout = await Workout.create(req.body)
    res.status(201).json(workout)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  const { user, team, completed } = req.query
  const filter: any = {}
  if (user) filter.user = user
  if (team) filter.team = team
  if (completed !== undefined) filter.completed = completed === 'true'
  const workouts = await Workout.find(filter).populate('user team').lean()
  res.json(workouts)
})

router.get('/:id', async (req, res) => {
  const workout = await Workout.findById(req.params.id).populate('user team').lean()
  if (!workout) return res.status(404).json({ error: 'Not found' })
  res.json(workout)
})

router.put('/:id', async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!workout) return res.status(404).json({ error: 'Not found' })
    res.json(workout)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  const workout = await Workout.findByIdAndDelete(req.params.id)
  if (!workout) return res.status(404).json({ error: 'Not found' })
  res.json({ success: true })
})

export default router
