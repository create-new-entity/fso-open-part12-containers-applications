
const router = require('express').Router()
const Models = require('../models')

router.post('/reset', async (request, response) => {
    await Models.Blog.deleteMany({})
    await Models.User.deleteMany({})
    response.status(204).end()
})

module.exports = router