
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const logger = require('./logger')

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('Authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }
    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token

    if(!token) {
        next({ name: 'JsonWebTokenError' })
        return
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if(!decodedToken.id) {
        next({ name: 'JsonWebTokenError' })
        return
    }

    const candidateUser = await User.findById(decodedToken.id)
    if (!candidateUser) {
        next({
            name: 'InvalidUser',
            message: 'User not found.'
        })
        return
    }
    request.user = candidateUser
    next()
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    else if(error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'Invalid token or token not provided.' })
    }
    else if(error.name === 'MongoServerError' && error.message.includes('duplicate key error collection')) {
        const duplicateField = Object.keys(error['keyValue'])[0]
        return response.status(400).json({ error: `Duplicate ${duplicateField} is not allowed.` })
    }
    else if(error.name === 'InvalidUser') {
        return response.status()
    }

    next(error)
}

const middlewares = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}

module.exports = middlewares