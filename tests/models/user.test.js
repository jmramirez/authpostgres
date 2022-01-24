import TestHelper from '../tests-helper'
import models from '../../src/models'

describe('User', () => {
    beforeAll(async () => {
        await TestHelper.startDb()
    })

    afterAll(async () => {
        await TestHelper.stopDb()
    })

    beforeEach(async () => {
        await TestHelper.syncDb()
    })



    describe('static methods', () => {
        describe('hashPassword', () => {
            it('should hash the password in teh arguments', async () => {
                const { User } = models
                const password = 'Test123#'
                const hashedPassword = await User.hashPassword(password)
                expect(password).not.toEqual(hashedPassword)
            })
        });
        describe('createNewUser', () => {
            it('should create a new user successfully', async () => {
                const { User } = models
                const data = {
                    email: 'test@example.com',
                    password: 'Test123#',
                    roles: ['admin','customer'],
                    username: 'test',
                    firstName: 'Jose',
                    lastName : 'Ramirez',
                    refreshToken : 'test-refresh-token'
                }
                const newUser = await User.createNewUser(data)
                const userCount = await  User.count()
                expect(userCount).toEqual(1)
                expect(newUser.email).toEqual(data.email)
                expect(newUser.password).toBeUndefined()
                expect(newUser.username).toEqual(data.username)
                expect(newUser.firstName).toEqual(data.firstName)
                expect(newUser.lastName).toEqual(data.lastName)
                expect(newUser.RefreshToken.token).toEqual(data.refreshToken)
                expect(newUser.Roles.length).toEqual(2)
                const savedRoles = newUser.Roles.map((savedRole) => savedRole.role).sort()
                expect(savedRoles).toEqual(data.roles.sort())
            })
        })

        it('should break is we create a new user with an invalid email', async () => {
            const { User } = models
            const data = {
                email: 'test',
                password: 'Test123#'
            }
            let error
            try {
                await User.createNewUser(data)
            } catch (err) {
                error = err
            }
            expect(error).toBeDefined()
            expect(error.errors.length).toEqual(1)
            expect(error.errors[0].message).toEqual('Not a valid email address')
        })

        it('should break is email is null', async () => {
            const { User } = models
            const data = {
                password: 'Test123#'
            }
            let error
            try {
                await User.createNewUser(data)
            } catch (err) {
                error = err
            }
            expect(error).toBeDefined()
            expect(error.errors.length).toEqual(1)
            expect(error.errors[0].message).toEqual('Email is required')
        })

        it('should break is we create a new user with an invalid username', async () => {
            const { User } = models
            const data = {
                email: 'test@example.com',
                username: 'u',
                password: 'Test123#'
            }
            let error
            try {
                await User.createNewUser(data)
            } catch (err) {
                error = err
            }
            expect(error).toBeDefined()
            expect(error.errors.length).toEqual(1)
            expect(error.errors[0].message).toEqual('Username must contain between 2 and 50 characters')
        })
    })

    describe('scopes', () => {
        let user

        beforeEach(async () => {
            user = await TestHelper.createNewUser()
        })

        describe('defaultScope', () => {
            it('should return an user without a password', async () => {
                const { User } = models
                const userFound = await User.findByPk(user.id)
                expect(userFound.password).toBeUndefined()
            })
        })

        describe('withPassword', () => {
            it('should return an user with a password', async () => {
                const { User } = models
                const userFound = await User.scope('withPassword').findByPk(user.id)
                expect(userFound.password).toEqual(expect.any(String))
            })
        })
    })

    describe('instace methods', () => {
        let password = 'Test123#'
        let user

        beforeEach(async () => {
            user = await TestHelper.createNewUser({password})
        })

        it('should return true if the password is correct', async () => {
            const { User } = models
            const userFound = await  User.scope('withPassword').findByPk(user.id)
            const passwordVerified = await userFound.comparePasswords(password)
            expect(passwordVerified).toEqual(true)
        })

        it('should return false if the password is incorrect', async () => {
            const { User } = models
            const userFound = await  User.scope('withPassword').findByPk(user.id)
            const passwordVerified = await userFound.comparePasswords('invalidPassword')
            expect(passwordVerified).toEqual(false)
        })
    })

    describe('hooks', () => {
        it('should not attempt to hash password if it is not given', async () => {
            const user = await TestHelper.createNewUser()
            user.email = 'test2@example.com'
            await user.save()
        })
    })
})