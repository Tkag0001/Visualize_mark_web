const express = require('express')
let app = express();
const morgan = require('morgan')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const path=require('path')

//Connect router
const classRouter = require('./Routes/classRouter')
const accountRouter = require('./Routes/accountRouter')

app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Defind url
app.use(express.static('./Public'))

app.get('/home', (req, res)=>{
    res.sendFile(path.join(__dirname, 'Public', 'html', 'home.html'))
})

app.get('/login', (req,res)=>{
    res.sendFile(path.join(__dirname, 'Public', 'html', 'index.html'))
})

app.get('/', (req,res)=>{
    res.redirect('/login')
})

app.get('/create', (req, res)=>{
    res.sendFile(path.join(__dirname, 'Public', 'html', 'create.html'))
})

app.get('/update', (req, res)=>{
    res.sendFile(path.join(__dirname, 'Public', 'html', 'update.html'))
})

app.use(express.urlencoded({ extended: true }));
// app.use(logger)
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString()
    next()
})

app.use('/api/v1/classes', classRouter)
app.use('/api/v1/auth', accountRouter)

module.exports = app