const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  const authorCount = {}

  blogs.forEach(blog => {
    if (authorCount[blog.author]) {
      authorCount[blog.author] += 1
    } else {
      authorCount[blog.author] = 1
    }
  })

  let maxAuthor = ''
  let maxBlogs = 0

  for (const author in authorCount) {
    if (authorCount[author] > maxBlogs) {
      maxBlogs = authorCount[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}