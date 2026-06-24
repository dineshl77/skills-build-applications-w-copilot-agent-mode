import express from 'express'
import usersRouter from './routes/users'
import activitiesRouter from './routes/activities'
import teamsRouter from './routes/teams'
import leaderboardsRouter from './routes/leaderboards'
import workoutsRouter from './routes/workouts'
import configRouter from './routes/config'

const app = express()

app.use(express.json())

app.get('/', (req, res) => res.send('OctoFit Tracker API'))

app.use('/api/users', usersRouter)
app.use('/api/activities', activitiesRouter)
app.use('/api/teams', teamsRouter)
app.use('/api/leaderboards', leaderboardsRouter)
app.use('/api/workouts', workoutsRouter)
app.use('/api/config', configRouter)

export default app
