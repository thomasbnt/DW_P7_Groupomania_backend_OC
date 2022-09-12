const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const path = require('path')
app.disable('x-powered-by')

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL || 'same-origin' }))

app.use('/images', express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader('Accept', 'application/json, multipart/form-data')
  next()
})

// Route Status
const status = require('./routes/status')
app.use('/status', status)

// Route Users
const users = require('./routes/users')
app.use('/users', users)

// Route Posts
const posts = require('./routes/posts')
app.use('/posts', posts)

module.exports = app
