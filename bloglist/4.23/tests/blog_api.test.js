const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

const helper = require('./test_helper')

let token = ''

beforeEach(async () => {

  await Blog.deleteMany({})
  await User.deleteMany({})

  // create user
  await api
    .post('/api/users')
    .send({
      username: 'root',
      name: 'Superuser',
      password: 'sekret'
    })

  // login
  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'sekret'
    })

  token = loginResponse.body.token

  // add initial blogs
  for (const blog of helper.initialBlogs) {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
  }
})

test('blogs are returned as json', async () => {

  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {

  const response = await api.get('/api/blogs')

  assert.strictEqual(
    response.body.length,
    helper.initialBlogs.length
  )
})

test('blog posts have id property', async () => {

  const response = await api.get('/api/blogs')

  const blog = response.body[0]

  assert(blog.id)
})

test('a valid blog can be added', async () => {

  const newBlog = {
    title: 'test blog',
    author: 'vaibhav',
    url: 'www.test.com',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(
    blogsAtEnd.length,
    helper.initialBlogs.length + 1
  )
})

test('if likes property is missing, it defaults to 0', async () => {

  const newBlog = {
    title: 'no likes',
    author: 'vaibhav',
    url: 'www.test.com'
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title is not added', async () => {

  const newBlog = {
    author: 'vaibhav',
    url: 'www.test.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without url is not added', async () => {

  const newBlog = {
    title: 'missing url',
    author: 'vaibhav',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog cannot be added without token', async () => {

  const newBlog = {
    title: 'no token',
    author: 'vaibhav',
    url: 'www.test.com',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})