import { useState } from 'react'

// NewBlogForm component is exrcise 5.6
const NewBlogForm = (props) => {
  const { handleSave } = props
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const clearAllInputStates = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleTitleChange = (e) => setTitle(e.target.value)
  const handleAuthorChange = (e) => setAuthor(e.target.value)
  const handleUrlChange = (e) => setUrl(e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleSave(title, author, url)
    clearAllInputStates()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Create New</h2>
        <div>
          <label>
            title:
            <input value={title} onChange={handleTitleChange}/>
          </label>
        </div>
        <div>
          <label>
            author:
            <input value={author} onChange={handleAuthorChange}/>
          </label>
        </div>
        <div>
          <label>
            url:
            <input value={url} onChange={handleUrlChange}/>
          </label>
        </div>
      </div>
      <button type='submit'>Create</button>
    </form>
  )
}

export default NewBlogForm