const express = require('express')
let app = express();
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const mongoose = require('mongoose')

//Connect router
const classRouter = require('./Routes/classRouter')
mongoose.connect(process.env.CONN_STR, {
    useNewUrlparser: true
}).then((conn) => {
    // console.log(conn)
    console.log('DB Connection Successful')
}).catch((error) =>{
    console.log('Some error has the occured')
})

app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use(express.static('./Public'))
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString()
    next()
})

app.use('/api/v1/classes', classRouter)
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server has started')
})

module.exports = app