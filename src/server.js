import environment from './config/environment'
import app from './express'
import dbConfig from './config/database'
import Database from './database'

(async () => {
    try {
        const db = new Database(environment.env, dbConfig)
        await db.connect()
    } catch (e) {
        console.error('Something went wrong initializing the database server')
        console.log(e)
        e.stack
    }
})()

app.listen(environment.port, (err) => {
    if(err){
        console.log(err)
    }
    console.info('Server started on port %s', environment.port)
})