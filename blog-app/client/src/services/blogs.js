import axios from 'axios'

const server = 'http://localhost:8080'
const blogsBaseUrl = '/api/blogs'
const loginBaseUrl = '/api/login'

let token

const setToken = (newToken) => {
  token = newToken
}

const getToken = () => token

const getAll = () => {
  const request = axios.get(blogsBaseUrl)
  return request.then(response => response.data)
}

const login = async (payload) => {
  const response = await axios.post(`${server}${loginBaseUrl}`, payload)
  setToken(response.data.token)
  return response.data
}

const createNewBlog = async ({ title, author, url }) => {
  const newBlog = {
    title, author, url,
    likes: 0
  }

  const headers = {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  }
  const createBlogUrl = `${server}${blogsBaseUrl}`

  const response = await axios.post(
    createBlogUrl,
    newBlog,
    headers
  )
  return response.data // newly created blog
}

const updateBlog = async (blog) => {
  const updateBlogUrl = `${server}${blogsBaseUrl}/${blog.id}`
  const headers = {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  }

  const response = await axios.put(
    updateBlogUrl,
    blog,
    headers
  )
  return response.data
}

const deleteBlog = async (blog) => {
  const deleteBlogUrl = `${server}${blogsBaseUrl}/${blog.id}`

  const headers = {
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  }

  await axios.delete(
    deleteBlogUrl,
    headers
  )
}

export default {
  getAll,
  login,
  createNewBlog,
  setToken,
  updateBlog,
  deleteBlog
}