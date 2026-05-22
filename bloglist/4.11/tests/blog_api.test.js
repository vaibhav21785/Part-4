const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(Array.isArray(response.body), true)
})

test('blog posts have id property', async () => {
  const response = await api.get('/api/blogs')

  const blog = response.body[0]

  assert.strictEqual(blog.id !== undefined, true)
})

after(async () => {
  await mongoose.connection.close()
})
test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Test blog',
    author: 'Vaibhav',
    url: 'https://example.com',
    likes: 5
  }

  const blogsAtStart = await api.get('/api/blogs')

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(
    blogsAtEnd.body.length,
    blogsAtStart.body.length + 1
  )

  const titles = blogsAtEnd.body.map(blog => blog.title)

  assert(titles.includes('Test blog'))
})
test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog without likes',
    author: 'Vaibhav',
    url: 'https://example.com'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})