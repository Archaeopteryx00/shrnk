const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const linkRoutes = require('./routes/links')
const redirectHandler = require('./controllers/redirectController')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/links', linkRoutes)
app.get('/:shortCode', redirectHandler)

app.use(errorHandler)

module.exports = app
