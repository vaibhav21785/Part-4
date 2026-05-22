require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Blog = require('./models/blog')
const User = require('./models/user')

const middleware = require('./utils/middleware')

const loginRouter = require('./controllers/login')

const app = express()

app.use(express.json())

app.use(middleware.tokenExtractor)

console.log('connecting to MongoDB...')

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use('/api/login', loginRouter)

app.get('/api/blogs', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1
    })

  response.json(blogs)
})

app.post(
  '/api/blogs',
  middleware.userExtractor,
  async (request, response) => {

    const body = request.body
    const user = request.user

    if (!body.title || !body.url) {
      return response.status(400).json({
        error: 'title or url missing'
      })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()

    response.status(201).json(savedBlog)
  }
)

app.delete(
  '/api/blogs/:id',
  middleware.userExtractor,
  async (request, response) => {

    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({
        error: 'blog not found'
      })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({
        error: 'only creator can delete blog'
      })
    }

    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
  }
)

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

app.get('/api/users', async (request, response) => {

  const users = await User
    .find({})
    .populate('blogs', {
      title: 1,
      author: 1,
      url: 1,
      likes: 1
    })

  response.json(users)
})

app.post('/api/users', async (request, response) => {

  const body = request.body

  if (!body.password || body.password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

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

  try {
    const savedUser = await user.save()

    response.status(201).json(savedUser)
  } catch (error) {
    response.status(400).json({
      error: error.message
    })
  }
})

module.exports = app