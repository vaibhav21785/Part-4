const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')

const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  await user.save()
})

test('creation succeeds with a fresh username', async () => {

  const usersAtStart = await User.find({})

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})

  assert.strictEqual(
    usersAtEnd.length,
    usersAtStart.length + 1
  )

  const usernames = usersAtEnd.map(u => u.username)

  assert(usernames.includes(newUser.username))
})

test('creation fails with proper status code if username already exists', async () => {

  const usersAtStart = await User.find({})

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error)

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails if password is too short', async () => {

  const usersAtStart = await User.find({})

  const newUser = {
    username: 'newuser',
    name: 'Test User',
    password: '12'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes(
    'password must be at least 3 characters long'
  ))

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
})