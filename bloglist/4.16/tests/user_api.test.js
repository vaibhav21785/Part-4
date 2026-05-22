const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash: 'password'
  })

  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'vaibhav',
    name: 'Vaibhav',
    password: 'secret'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
})

test('creation fails with proper statuscode if username already exists', async () => {
  const newUser = {
    username: 'root',
    name: 'Another Root',
    password: 'secret'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('duplicate'))
})

test('creation fails if password is too short', async () => {
  const newUser = {
    username: 'abhi',
    name: 'Abhi',
    password: '12'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('password'))
})

after(async () => {
  await mongoose.connection.close()
})