import TestHelper from '../../tests-helper'
import models from '../../../src/models'
import request from 'supertest'

describe('register', ()=> {
    let app;

    beforeAll(async () => {
        await TestHelper.startDb()
        app = TestHelper.getApp()
    })

    afterAll(async () => {
        await TestHelper.stopDb()
    })

    beforeEach(async () => {
        await TestHelper.syncDb()
    })

    it('should register a new user successfully', async () => {
        const data = {
            email: 'test@example.com',
            password: 'Test123#',
            username: 'test',
            firstName: 'Jose',
            lastName: 'Ramirez',
            roles: ['admin', 'customer']
        }
        const response = await request(app).post('/v1/register').send(data).expect(200)
        expect(response.body.success).toEqual(true)
        expect(response.body.message).toEqual('User registered successfully')
        const { User, Role, RefreshToken } = models;
        const users = await User.findAll({ include: [Role, RefreshToken]  })
        expect(users.length).toEqual(1)
        const newUser = users[0]
        expect(newUser.email).toEqual(data.email)
        expect(newUser.username).toEqual(data.username)
        expect(newUser.firstName).toEqual(data.firstName)
        expect(newUser.lastName).toEqual(data.lastName)
        expect(newUser.password).toBeUndefined()
        expect(newUser.Roles.length).toEqual(data.roles.length)
        expect(newUser.RefreshToken.token).toEqual(expect.any(String))
    })

    it('should not create a new user if it already exists', async () => {
        await request(app).post('/v1/register')
            .send({ email: 'test@example.com', password: 'Test123#'})
            .expect(200)
        const response = await request(app).post('/v1/register')
            .send({ email: 'test@example.com', password: 'Test123#'})
            .expect(200)
        expect(response.body.success).toEqual(false)
        expect(response.body.message).toEqual('User already exists')
    })
})