const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')

const supertest = require('supertest')
const app = require('../../app')
const api = supertest(app)

const mongoose = require('mongoose')
const { generateRandomNUsers } = require('./initialData')
const R = require('ramda')
const User = require('../../models/User')

const baseURL = '/api/users'


describe('User functionalities tests.', () => {

    beforeEach(async () => {
        await User.deleteMany({})
    })

    describe('CRUD REST API tests', () => {
        test('POST, Users: Create new user works.', async () => {
            let response

            response = await api.get(baseURL)
                .expect(200)
            const usersBeforeCreate = response.body

            const randomUsers = generateRandomNUsers(1, 0)
            const newUserToCreate = randomUsers[0]
            response = await api.post(baseURL)
                .send(newUserToCreate)
                .expect(201)
            const createdUser = response.body

            response = await api.get(baseURL)
                .expect(200)
            const usersAfterCreate = response.body

            assert.equal(usersAfterCreate.length, usersBeforeCreate.length + 1)
            const fieldsToPick = ['username', 'name']
            assert.deepStrictEqual(R.pick(fieldsToPick, newUserToCreate), R.pick(fieldsToPick, createdUser))
        })
    })

    after(async () => {
        await mongoose.connection.close()
        console.log('User tests done. DB connection closed.')
    })
})