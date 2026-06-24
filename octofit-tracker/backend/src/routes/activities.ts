import { Router } from 'express'
import Activity from '../models/Activity'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const activity = await Activity.create(req.body)
    res.status(201).json(activity)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  const { user, team } = req.query
  const filter: any = {}
  if (user) filter.user = user
  if (team) filter.team = team
  const activities = await Activity.find(filter).populate('user team').lean()
  res.json(activities)
})

router.get('/:id', async (req, res) => {
  const activity = await Activity.findById(req.params.id).populate('user team').lean()
  if (!activity) return res.status(404).json({ error: 'Not found' })
  res.json(activity)
})

export default router
