import { useState } from 'react'
import blogService from '../services/blogs'
import { handleNotification } from '../utils'


const Blog = ({ blog, setBlogs, loggedInUser, setNotification, handleLike }) => {
  const [showDetails, setShowDetails] = useState(false)

  const handleVisibility = () => {
    setShowDetails(!showDetails)
  }

  const customLikeHandler = async () => {
    const updatedBlog = await blogService.updateBlog({ ...blog, likes: blog.likes + 1,  user: blog.user.id })
    setBlogs((prevBlogs) => {
      const newBlogs = [...prevBlogs]
      const newBlog = newBlogs.find(nBlog => nBlog.id === updatedBlog.id)
      newBlog.likes = updatedBlog.likes
      return newBlogs.sort((blog1, blog2) => {
        return blog2.likes - blog1.likes
      })
    })
  }

  const likeHandler = handleLike ?? customLikeHandler

  const blogStyle = {
    padding: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: '5px'
  }

  const visiblityButtonStyle = {
    marginLeft: '10px'
  }

  const showDeleteButton = loggedInUser.username === blog.user.username

  const handleDelete = async () => {
    if(window.confirm(`Do you want to delete ${blog.title}?`)) {
      try {
        await blogService.deleteBlog(blog)
        setBlogs((prevBlogs) => {
          return prevBlogs.filter((pBlog) => {
            return pBlog.id !== blog.id
          })
        })
      }
      // eslint-disable-next-line no-unused-vars
      catch(e) {
        const failedNotification = {
          success: false,
          msg: 'Blog deletion failed.'
        }
        handleNotification(failedNotification, setNotification)
      }
    }
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10px' }}>
        <div className='blog-title'>{blog.title}</div>
        <button style={visiblityButtonStyle} onClick={handleVisibility}>{showDetails ? 'Hide' : 'View'}</button>
      </div>
      {
        showDetails &&
        <div style={{ marginLeft: '10px' }}>
          <p className='blog-author'>{blog.author}</p>
          <p className='blog-url'>{blog.url}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-start'}}>
            <div className='blog-likes'>{blog.likes}</div>
            <button style={{ marginLeft: '10px' }} onClick={likeHandler}>Like</button>
          </div>
          <p>Added by {blog.user.username}</p>
          {
            showDeleteButton &&
            <div>
              <button onClick={handleDelete}>Delete</button>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default Blog