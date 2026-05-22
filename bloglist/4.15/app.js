require('dotenv').config()

const bcrypt = require('bcryptjs')
const User = require('./models/user')

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
app.get('/api/users', async (request, response) => {
  const users = await User.find({})

  response.json(users)
})

app.post('/api/blogs', async (request, response) => {
  const body = request.body

  if (!body.title || !body.url) {
    return response.status(400).json({
      error: 'title or url missing'
    })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

app.delete('/api/blogs/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)

  response.status(204).end()
})
app.put('/api/blogs/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true }
  )

  response.json(updatedBlog)
})


app.post('/api/users', async (request, response) => {
  const body = request.body

  const saltRounds = 10

  const passwordHash = await bcrypt.hash(
    body.password,
    saltRounds
  )

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})
module.exports = app