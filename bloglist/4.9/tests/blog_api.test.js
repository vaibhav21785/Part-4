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