const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  assert.strictEqual(result, 1)
})

describe('total likes', () => {

  test('when list has only one blog, equals the likes of that', () => {
    const blogs = [
      {
        title: 'First',
        likes: 5
      }
    ]

    const result = listHelper.totalLikes(blogs)

    assert.strictEqual(result, 5)
  })

  test('when list has multiple blogs, calculates total likes', () => {
    const blogs = [
      {
        title: 'First',
        likes: 5
      },
      {
        title: 'Second',
        likes: 10
      },
      {
        title: 'Third',
        likes: 7
      }
    ]

    const result = listHelper.totalLikes(blogs)

    assert.strictEqual(result, 22)
  })

})

describe('favorite blog', () => {

  const blogs = [
    {
      title: 'First blog',
      author: 'Author 1',
      likes: 7
    },
    {
      title: 'Second blog',
      author: 'Author 2',
      likes: 20
    },
    {
      title: 'Third blog',
      author: 'Author 3',
      likes: 15
    }
  ]

  test('returns blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      title: 'Second blog',
      author: 'Author 2',
      likes: 20
    })
  })

})

describe('most blogs', () => {

  const blogs = [
    {
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    },
    {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10
    },
    {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 0
    },
    {
      title: 'Clean Code',
      author: 'Robert C. Martin',
      likes: 20
    }
  ]

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

})

describe('most likes', () => {

  const blogs = [
    {
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7
    },
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    },
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    },
    {
      title: 'First class tests',
      author: 'Robert C. Martin',
      likes: 10
    },
    {
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      likes: 0
    }
  ]

  test('returns author with most likes', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

})