// Import the express in typescript file
import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { engine } from 'express-handlebars'
import indexRouter from './routes/index'
import addressRouter from './routes/address'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Initialize the express engine
const app: express.Application = express()
// Take a port 3000 for running server.
const port: number = 3000
app.use(morgan('dev'))

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, '../views'))

// Add routers
app.use('/', indexRouter)
app.use('/address', addressRouter)
app.use(express.static(path.join(__dirname, '../static')))

// Server setup
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
