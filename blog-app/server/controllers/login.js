const jwt = require('jsonwebtoken')
const User = require('../models/User')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')

const baseURL = '/login'

loginRouter.post(baseURL, async (request, response) => {
    const { username, password } = request.body
    const user = await User.findOne({ username })
    const passwordIsValid = bcrypt.compare(password, user.passwordHash)

    if(!(user && passwordIsValid)) {
        return response.status(401).json({
            error: 'Invalid username or password.'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, process.env.JWT_SECRET)

    response.status(200)
        .send({
            username: user.username,
            name: user.name,
            token
        })
})

module.exports = loginRouter