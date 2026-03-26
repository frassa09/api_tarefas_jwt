import express from 'express'
import 'dotenv/config'
import { usersRouter } from './routes/users.routes.js'
import { tasksRouter } from './routes/tasks.routes.js'

const app = express()

app.use(express.json())

app.use('/users', usersRouter)
app.use('/tasks', tasksRouter)

app.listen(process.env.APP_PORT)