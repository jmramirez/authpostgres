import environment from './config/environment'
import app from './express'


app.listen(environment.port, (err) => {
    if(err){
        console.log(err)
    }
    console.info('Server started on port %s', environment.port)
})