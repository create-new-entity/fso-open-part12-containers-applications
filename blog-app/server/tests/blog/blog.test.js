const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const R = require('ramda')

const listHelper = require('../../utils/list_helper')
const testDataBlogs = require('./testData')
const initialData = require('./initialData')
const app = require('../../app')

const Blog = require('../../models/Blog')
const { areIdsUniq } = require('./testUtils')

const { generateRandomNUsers } = require('../user/initialData')
const User = require('../../models/User')
const api = supertest(app)

const blogsBaseUrl = '/api/blogs'
const loginBaseUrl = '/api/login'
const userBaseUrl = '/api/users'


describe('dummy test', () => {
    test('dummy returns one', () => {
        const blogs = []

        const result = listHelper.dummy(blogs)
        assert.strictEqual(result, 1)
    })
})

describe('Blogs test suite.', () => {
    let userWhoHasCreatedSomeBlogs, response, promises

    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        // Initialize with some users.
        const initialUsers = generateRandomNUsers(2, 0)
        const userCreationPromises = initialUsers.map((initialUser) => {
            return api.post(userBaseUrl)
                .send(initialUser)
        })
        const createdUsers = await Promise.all(userCreationPromises)


        userWhoHasCreatedSomeBlogs = createdUsers[0].body
        userWhoHasCreatedSomeBlogs.password = `${userWhoHasCreatedSomeBlogs.username}_password`
        response = await api.post(loginBaseUrl)
            .send(R.pick(['username', 'password'], userWhoHasCreatedSomeBlogs))
        const { token } = response.body

        // Initialize with some blogs.
        const blogsToCreate = initialData.initialBlogs
        promises = blogsToCreate.map((blogToCreate) => {
            return api.post(blogsBaseUrl)
                .set('Authorization', `Bearer ${token}`)
                .send(blogToCreate)
        })
        response = await Promise.all(promises)
        response = response.map(r => r.body)
    })

    test('GET request returns correct amount of blog items.', async () => {
        const response = await api.get(blogsBaseUrl)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        assert.strictEqual(response.body.length, initialData.initialBlogs.length)
    })

    test('Unique identifier property is "id", not something else.', async () => {
        const response = await api.get(blogsBaseUrl)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const blogs = response.body
        const keysInBlog = Object.keys(blogs[0]).sort()
        const expectedKeys = [ 'id', 'title', 'author', 'url', 'likes', 'user' ].sort()
        assert.deepStrictEqual(keysInBlog, expectedKeys)
        assert.ok(areIdsUniq(blogs))
    })

    describe('POST endpoint tests', () => {
        test('POST request works.', async () => {
            response = await api.get(blogsBaseUrl)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            const nBlogsBefore = response.body.length

            response = await api.post(loginBaseUrl)
                .send(R.pick(['username', 'password'], userWhoHasCreatedSomeBlogs))
            const { token } = response.body

            response = await api.post(blogsBaseUrl)
                .set('Authorization', `Bearer ${token}`)
                .send(initialData.dummyBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
            const createdBlog = response.body

            response = await api.get(blogsBaseUrl)
                .expect(200)
                .expect('Content-Type', /application\/json/)
            const nBlogsAfter = response.body.length

            assert.equal(nBlogsBefore + 1, nBlogsAfter)
            assert.deepStrictEqual({ ...initialData.dummyBlog, id: createdBlog.id, user: userWhoHasCreatedSomeBlogs.id }, createdBlog)
        }),

        test('POST request fails if token not provided.', async () => {
            await api.post(blogsBaseUrl)
                .send(initialData.dummyBlog)
                .expect(401)
        }),

        test('POST request, set likes to 0 if not provided.', async () => {
            response = await api.post(loginBaseUrl)
                .send(R.pick(['username', 'password'], userWhoHasCreatedSomeBlogs))
            const { token } = response.body

            const payload = { ...initialData.dummyBlog }
            delete payload.likes
            
            response = await api.post(blogsBaseUrl)
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const createdBlog = response.body

            assert.equal(createdBlog.likes, 0)
        }),

        test('POST request, title and author are required.', async () => {
            response = await api.post(loginBaseUrl)
                .send(R.pick(['username', 'password'], userWhoHasCreatedSomeBlogs))
            const { token } = response.body

            const payloadNoTitle = { ...initialData.dummyBlog }
            delete payloadNoTitle.title
            await api.post(blogsBaseUrl)
                .set('Authorization', `Bearer ${token}`)
                .send(payloadNoTitle)
                .expect(400)

            const payloadNoAuthor = { ...initialData.dummyBlog }
            delete payloadNoAuthor.author
            await api.post(blogsBaseUrl)
                .set('Authorization', `Bearer ${token}`)
                .send(payloadNoAuthor)
                .expect(400)
        })
    })
    
    test('DELETE blog works.', async () => {
        let response

        response = await api.post(loginBaseUrl)
            .send(R.pick(['username', 'password'], userWhoHasCreatedSomeBlogs))
        const { token } = response.body

        response = await api.get(blogsBaseUrl)
            .expect(200)
        const blogToDelete = response.body[0]
        await api.delete(`${blogsBaseUrl}/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
    })

    test('UPDATE blog works.', async () => {
        let response
        response = await api.get(blogsBaseUrl).expect(200)
        const blogToUpdate = response.body[0]
        const UPDATED_AUTHOR_NAME = 'Updated author name'
        const LIKES_CHANGE = 10
        const updatedBlog = {
            ...blogToUpdate,
            author: UPDATED_AUTHOR_NAME,
            likes: blogToUpdate.likes + LIKES_CHANGE,
            user: blogToUpdate.user.id
        }

        const loginPayload = R.pick(['username', 'password'], userWhoHasCreatedSomeBlogs)
        response = await api.post(loginBaseUrl)
            .send(loginPayload)
            .expect(200)
        const { token } = response.body

        response = await api.put(`${blogsBaseUrl}/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBlog)
            .expect(200)
        assert.equal(response.body.likes, blogToUpdate.likes + LIKES_CHANGE)
        assert.strictEqual(response.body.author, UPDATED_AUTHOR_NAME)
    })
})

describe('Utility functions test suite.', () => {
    test('totalLikes function works', () => {
        assert.strictEqual(listHelper.totalLikes(testDataBlogs), 77)
    })

    test('mostLikes function works', () => {
        assert.deepStrictEqual(listHelper.mostLikes(testDataBlogs), { author: 'Edgar Norton', likes: 29 })
    })

    test('favoriteBlog function works', () => {
        assert.deepStrictEqual(listHelper.favoriteBlog(testDataBlogs), testDataBlogs[2])
    })

    test('mostBlogs function works', () => {
        assert.deepStrictEqual(listHelper.mostBlogs(testDataBlogs), { author: 'Edgar Norton', blogs: 3 })
    })
})


after(async () => {
    await mongoose.connection.close()
    console.log('DB Connection closed.')
})
