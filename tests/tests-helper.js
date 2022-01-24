import '../src/config'
import Database from '../src/database'
import dbConfig from '../src/config/database'

let db

export default class TestHelper {
    static async startDb() {
        db = new Database('test', dbConfig)
        await db.connect()
        return db
    }

    static async stopDb() {
        await db.disconnect()
    }

    static async syncDb() {
        await db.sync()
    }

    static async createNewUser(options = {}) {
        const models = require('./../src/models').default
        const  {
            email =  'test@example.com',
            password = 'Test123#',
            roles = ['admin','customer'],
            username = 'test',
            firstName = 'Jose',
            lastName = 'Ramirez',
            refreshToken = 'test=refresh-token'
        } = options
        const { User } = models
        const data = {email, password, roles, username, firstName, lastName, refreshToken}
        return User.createNewUser(data)
    }
}