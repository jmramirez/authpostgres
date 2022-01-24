import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import errorsMiddleware from './middlewares/errors';
import { v1Routes } from './controllers'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(errorsMiddleware)

app.use('/v1', v1Routes)


app.get('/',(req,res) => {
    res.send('Hello world')
})

export default app

