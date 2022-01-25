import environment from './config/environment'
import dbConfig from './config/database'
import Database from './database'

(async () => {
    try {
        const db = new Database(environment.env, dbConfig)
        await db.connect()

        const App = require('./express').default
        const app = new App()
        app.listen()
    } catch (e) {
        console.error('Something went wrong initializing the server')
        console.log(e)
        e.stack
    }
})()