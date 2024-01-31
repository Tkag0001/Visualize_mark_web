//Node_Modules
const readline = require('readline');
const fs = require('fs');
const http = require('http');
const url = require('url')
const events = require('events')

//User Modules defined
const replaceHTML = require('/Modules/replaceHTML')
const user = require('./Modules/user')

const html = fs.readFileSync('./Files/Templates/index_chart.html', 'utf-8')
let marks = JSON.parse(fs.readFileSync('./Files/Data/dataMarsk1.json', 'utf-8'))
let marksHTML = fs.readFileSync('./Files/Templates/marks_list.html', 'utf-8')
console.log(typeof (marks))

//1. Create server:
//Server inherits from event emitter
const server = http.createServer();
server.on('request', (request, response) => {
    let { query, pathname: path } = url.parse(request.url, true);
    console.log(query)

    if (path === '/' || path.toLocaleLowerCase() === '/home') {
        response.writeHead(200, {
            'Content-Type': 'text/html',
            'my-header': 'Hello, world'
        })
        response.end(html.replace('{{%CONTENT%}}', 'You are in Home page'));
    } else if (path.toLocaleLowerCase() == '/contact') {
        response.writeHead(200, {
            'Content-Type': 'text/html',
            'my-header': 'Hello, world'
        })
        response.end(html.replace('{{%CONTENT%}}', 'You are in contact page'));
    } else if (path.toLocaleLowerCase() == '/about') {
        response.writeHead(200, {
            'Content-Type': 'text/html',
            'my-header': 'Hello, world'
        })
        response.end(html.replace('{{%CONTENT%}}', ''));
    } else if (path.toLocaleLowerCase() == '/marks') {
        let marksResponseHTML = html
        // let filtered = marks
        var filtered
        if (Object.keys(query).length !== 0) {
            filtered = marks.filter(item => item.HoTenGV === query["HoTenGV"]);
        }
        else {
            filtered = marks
        }

        let features = ["Diem0_SL", "Diem1_SL", "Diem2_SL", "Diem3_SL", "Diem4_SL", "Diem5_SL", "Diem6_SL", "Diem7_SL", "Diem8_SL", "Diem9_SL", "Diem10_SL"]

        let rowTable_B = []
        // rowTable.push("[\"Điểm\", \"Số lượng\"]")

        for (let i = 10; i >=0; i--) {
            rowTable_B.push("[\"Điểm " + i + ':\",' + filtered[0][features[i]] + "]")
        }

        console.log(rowTable_B)
        
        let rowTable_P =[]
        rowTable_P.push(`["Đậu",${filtered[0]["SLD"]}]`)
        rowTable_P.push(`["Không đậu",${filtered[0]["SLKD"]}]`)

        console.log(rowTable_P)
        console.log(filtered["MaLop"])
        marksResponseHTML = replaceHTML(marksResponseHTML, filtered[0], rowTable_B, rowTable_P)
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

        response.end(marksResponseHTML);
    } else {
        response.end(html.replace('{{%CONTENT%}}', 'Error 404: Page not fount'));
    }
    console.log('A new request is recieved ');
})

//Start the server
server.listen(8000, '127.0.0.1', () => {
    console.log('Server has started!');
});

//Emitting and handling custom events
let myEmitter = new user();

myEmitter.on('userCreated', (id, name) => {
    console.log(`A new user ${name} with ${id} is created`)
})

myEmitter.on('userCreated', (id, name) => {
    console.log(`A new user ${name} with ${id} is added to database!`)
})

myEmitter.emit('userCreated', 101, 'John')