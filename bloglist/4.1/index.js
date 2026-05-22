const express = require('express')
const mongoose = require('mongoose')

const app = express()

// Correct MongoDB Atlas URL
const mongoUrl =
  'mongodb://vaibhav_db_user:Vaibhav123@ac-an3mzsi-shard-00-00.ibculyk.mongodb.net:27017,ac-an3mzsi-shard-00-01.ibculyk.mongodb.net:27017,ac-an3mzsi-shard-00-02.ibculyk.mongodb.net:27017/?ssl=true&replicaSet=atlas-85u4vg-shard-0&authSource=admin&appName=Cluster0'
mongoose
  .connect(mongoUrl, {
    family: 4
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// Schema
const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

// Model
const Blog = mongoose.model('Blog', blogSchema)

app.use(express.json())

// GET all blogs
app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

// POST a new blog
app.post('/api/blogs', (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog.save().then((savedBlog) => {
    response.status(201).json(savedBlog)
  })
})

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})