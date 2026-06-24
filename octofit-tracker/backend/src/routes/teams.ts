import { Router } from 'express'
import Team from '../models/Team'
import User from '../models/User'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const team = await Team.create(req.body)
    res.status(201).json(team)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  const teams = await Team.find().populate('members').lean()
  res.json(teams)
})

router.post('/:id/members', async (req, res) => {
  const { userId } = req.body
  const team = await Team.findById(req.params.id)
  if (!team) return res.status(404).json({ error: 'Not found' })
  const user = await User.findById(userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (!team.members.includes(user._id)) team.members.push(user._id)
  await team.save()
  user.team = team._id
  await user.save()
  res.json(team)
})

export default router
