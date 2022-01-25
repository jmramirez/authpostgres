import express from 'express'
import errorsMiddleware from './middlewares/errors';
import { v1Routes } from './controllers'
import environment from './config/environment'
import logger from 'morgan'

export default class App {
    constructor() {
        this.app = express()
        this.app.use(logger('dev', { skip: (req,res)=> environment.env === 'test'}))
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.get('/',(req,res) => {
            res.send('Hello world')
        })
        this.setRoutes()
    }

    setRoutes() {
        this.app.use('/v1', v1Routes)
        this.app.use(errorsMiddleware)
    }

    getApp() {
        return this.app()
    }

    listen() {
        const { port } = environment
        this.app.listen(port, () => {
            console.log(`Listening at port ${port}`)
        })
    }
}

