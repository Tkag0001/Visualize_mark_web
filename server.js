const dotenv = require('dotenv')
dotenv.config({path: './config.env'})
const app = require('./app.js')
const mongoose = require('mongoose')
const backup = require('./Backup/classBackup.js')
var cron = require('node-cron');

console.log(process.env)

mongoose.connect(process.env.CONN_STR, {
    useNewUrlparser: true
}).then((conn) => {
    // console.log(conn)
    console.log('DB Connection Successful')
    cron.schedule('* * * * Monday', () => {
        console.log('Backup database');
        backup.backupMongoDB()
    });
}).catch((error) =>{
    console.log('Some error has the occured')
})

// Create server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server has started')
})