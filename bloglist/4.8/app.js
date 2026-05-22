require('dotenv').config()

console.log('ENV VALUE:', process.env.MONGODB_URI)

const express = require('express')
const mongoose = require('mongoose')

const app = express()

const Blog = require('./models/blog')

console.log('connecting to MongoDB...')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.json())

app.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

module.exports = app