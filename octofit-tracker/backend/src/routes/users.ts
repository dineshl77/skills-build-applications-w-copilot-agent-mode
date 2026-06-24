import { Router } from 'express'
import User from '../models/User'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json(user)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/', async (req, res) => {
  const users = await User.find().lean()
  res.json(users)
})

router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).lean()
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json(user)
})

router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!user) return res.status(404).json({ error: 'Not found' })
    res.json(user)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id)
  if (!user) return res.status(404).json({ error: 'Not found' })
  res.json({ success: true })
})

export default router
