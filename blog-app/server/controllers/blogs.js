const Blog = require('../models/Blog')
const blogsRoutes = require('express').Router()
const { userExtractor } = require('../utils/middleware')


const baseURL = '/blogs'

blogsRoutes.get(baseURL, async (req, res) => {
    const blogs = await Blog.find({}).populate('user')
    res.json(blogs)
})

blogsRoutes.post(baseURL, userExtractor, async (req, res) => {

    const candidateUser = req.user
    const blogToCreate = req.body
    blogToCreate.user = candidateUser._id
    const blog = new Blog(blogToCreate)
    const result = await (await blog.save()).populate('user')

    candidateUser.blogs = [
        ...candidateUser.blogs,
        result._id
    ]
    await candidateUser.save()

    res.status(201).json(result)
})

blogsRoutes.delete(`${baseURL}/:id`, userExtractor, async (req, res) => {
    
    const candidateUser = req.user
    const blogToBeDeleted = await Blog.findById(req.params.id)
    if(!blogToBeDeleted) {
        res.status(400).json({ error: 'Blog not found.' })
    }
    const isAllowedToDelete = blogToBeDeleted.user.toString() === candidateUser._id.toString()

    if(!isAllowedToDelete) {
        res.status(401).json({ error: 'User does not have permission to delete this blog.' })
        return
    }

    await Blog.findByIdAndDelete(req.params.id)

    candidateUser.blogs = candidateUser.blogs.filter((blogId) => {
        return blogId.toString() !== req.params.id
    })

    await candidateUser.save()

    res.status(200).end()
})

blogsRoutes.put(`${baseURL}/:id`, userExtractor, async (req, res) => {
    const candidateUser = req.user
    const blogToUpdate = req.body
    blogToUpdate.user = candidateUser._id

    const updatedBlog = await Blog.findById(req.params.id)

    updatedBlog.title = blogToUpdate.title
    updatedBlog.author = blogToUpdate.author
    updatedBlog.url = blogToUpdate.url
    updatedBlog.likes = blogToUpdate.likes

    await updatedBlog.save()
    
    res.status(200).send(updatedBlog.toJSON())
})

module.exports = blogsRoutes
