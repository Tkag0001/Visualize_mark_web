const express = require('express')
let app = express();
const morgan = require('morgan')

//Connect router
const classRouter = require('./Routes/classRouter')

//Custom middleware
// const logger = function (req, res, next) {
//     console.log('Custom middleware called')
//     next();
// }

app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use(express.static('./Public'))
// app.use(logger)
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString()
    next()
})

app.use('/api/v1/classes', classRouter)

module.exports = app