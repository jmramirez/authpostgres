import TestHelper from '../../tests-helper'
import models from '../../../src/models'
import request from 'supertest'

describe('register', ()=> {
    let app;
    let newUserResponse;

    beforeAll(async () => {
        await TestHelper.startDb()
        app = TestHelper.getApp()
    })

    afterAll(async () => {
        await TestHelper.stopDb()
    })

    beforeEach(async () => {
        await TestHelper.syncDb()
        newUserResponse = await TestHelper.registerNewUser({ email: 'test@example.com', password: 'Test123#'})
    })

    it('should login an user successfully', async () => {
        const response = await request(app).post('/v1/login').send({ email: 'test@example.com', password: 'Test123#'})
            .expect(200)
        const refreshToken = response.body.data.refreshToken
        expect(refreshToken).toEqual(newUserResponse.body.data.refreshToken)
    })

    it('should return 401 if we pass an email not associated with any user', async () => {
        const response = await request(app).post('/v1/login').send({ email: 'test@example.net', password: 'Test123#'})
            .expect(401)
        expect(response.body.success).toEqual(false)
        expect(response.body.message).toEqual('Invalid credentials')
    })

    it('should return 401 if we pass an invalid password', async () => {
        const response = await request(app).post('/v1/login').send({ email: 'test@example.com', password: 'invalidPassword'})
            .expect(401)
        expect(response.body.success).toEqual(false)
        expect(response.body.message).toEqual('Invalid credentials')
    })

    it('should create a new refresh token record if there is not one associated with the user', async () => {
        const { RefreshToken } = models
        await RefreshToken.destroy({ where: {}})
        let refreshTokenCount = await RefreshToken.count()
        expect(refreshTokenCount).toEqual(0)
        const response = await request(app).post('/v1/login').send({ email: 'test@example.com', password: 'Test123#'})
            .expect(200)
        refreshTokenCount = await RefreshToken.count()
        expect(refreshTokenCount).toEqual(1)
    })


    it('it should set the token field to a JWT if this field is empty', async () => {
        const { RefreshToken } = models
        const refreshToken = newUserResponse.body.data.refreshToken
        const savedRefreshToken = await RefreshToken.findOne({ where: { token: refreshToken }})
        savedRefreshToken.token = null
        await savedRefreshToken.save()
        const response = await request(app).post('/v1/login').send({ email: 'test@example.com', password: 'Test123#'})
            .expect(200)
        await savedRefreshToken.reload()
        expect(savedRefreshToken.token).not.toBeNull()
    })

})