const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = require('./app.js')
const mongoose = require('mongoose')
// console.log(app.get('env'))
console.log(process.env)

mongoose.connect(process.env.CONN_STR, {
    useNewUrlparser: true
}).then((conn) => {
    // console.log(conn)
    console.log('DB Connection Successful')
}).catch((error) =>{
    console.log('Some error has the occured')
})

// Create server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server has started')
})