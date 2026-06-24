import { Router } from 'express'
import Activity from '../models/Activity'
import Team from '../models/Team'
import User from '../models/User'

const router = Router()

// GET /api/leaderboards/top?scope=user|team&limit=10
router.get('/top', async (req, res) => {
  const scope = (req.query.scope as string) || 'user'
  const limit = Number(req.query.limit || 10)

  if (scope === 'team') {
    // aggregate by team: sum distance (or calories) per team
    const agg = await Activity.aggregate([
      { $match: { team: { $ne: null } } },
      { $group: { _id: '$team', score: { $sum: { $ifNull: ['$distance', 0] } } } },
      { $sort: { score: -1 } },
      { $limit: limit }
    ])
    const results = await Team.populate(agg, { path: '_id' })
    res.json(results)
    return
  }

  // default: aggregate by user
  const agg = await Activity.aggregate([
    { $group: { _id: '$user', score: { $sum: { $ifNull: ['$distance', 0] } } } },
    { $sort: { score: -1 } },
    { $limit: limit }
  ])
  const results = await User.populate(agg, { path: '_id' })
  res.json(results)
})

export default router
