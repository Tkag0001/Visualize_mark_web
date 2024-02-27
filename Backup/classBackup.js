const { spawn } = require('child_process')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({path: '../config.env'})
const DB_NAME = 'classes_backup'
const ARCHIVE_PATH = path.join(__dirname, `${DB_NAME}.gzip`)
const uri=process.env.CONN_STR

console.log(ARCHIVE_PATH)

// backupMongoDB()
// restoreMongoDB()

function backupMongoDB() {
    const dataBK = spawn('mongodump', [
        `--uri=${uri}`,
        `--archive=${ARCHIVE_PATH}`,
        '--gzip',
    ]);

    dataBK.stdout.on('data', (data) => {
        console.log('stdout:\n', data.toString());
    });

    dataBK.stderr.on('data', (data) => {
        console.error('stderr:\n', data.toString());
    });

    dataBK.on('error', (error) => {
        console.error('error:\n', error);
    });

    dataBK.on('exit', (code, signal) => {
        if (code) console.error('Process exit with code:', code);
        else if (signal) console.error('Process killed with signal:', signal);
        else console.log('Backup is successful');
    });
}

function restoreMongoDB() {
    const dataRestore = spawn('mongorestore', [
        `--gzip`,
        `--archive=${ARCHIVE_PATH}`,
        `--uri=${uri}`
    ]);

    dataRestore.stdout.on('data', (data) => {
        console.log('stdout:\n', data.toString());
    });

    dataRestore.stderr.on('data', (data) => {
        console.error('stderr:\n', data.toString());
    });

    dataRestore.on('error', (error) => {
        console.error('error:\n', error);
    });

    dataRestore.on('exit', (code, signal) => {
        if (code) console.error('Process exit with code:', code);
        else if (signal) console.error('Process killed with signal:', signal);
        else console.log('Restore is successful');
    });
}

module.exports={
    backupMongoDB,
    restoreMongoDB
}