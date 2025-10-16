const User = require('../models/User')
const usersRoutes = require('express').Router()
const bcrypt = require('bcrypt')

const baseURL = '/users'

usersRoutes.get(baseURL, async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

usersRoutes.post(baseURL, async (request, response) => {
    const { username, name, password } = request.body

    if(!password) {
        response.status(400).send({ error: 'Password is required.' })
        return
    }
    if(password.length < 3) {
        response.status(400).send({ error: 'Password should be at least 3 characters long.' })
        return
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
        blogs: []
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

usersRoutes.delete(`${baseURL}/:id`, async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).end()
})

usersRoutes.put(`${baseURL}/:id`, async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).send(updatedUser)
})

module.exports = usersRoutes
