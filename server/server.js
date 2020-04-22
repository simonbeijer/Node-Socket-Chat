const express = require('express');
const app = express();
const http = require('http').createServer(app);
const chalk = require('chalk')
const io = require('socket.io')(http)

const server = [{
    running: 'Server is running!',
    port: 3000,
}]


io.on('connection', (socket) => {
    console.log('User connected')

    socket.on('disconnect', () => {
        console.log('User disconnected')
    })
})


// Server listen
http.listen(3000, 'localhost', () => {
    portRuninng()
});


// Styled cli
function portRuninng() {
    let str;
    str = "+------------------------+----------+\n";
    str += "|  Is server running?    |  Port    |\n";
    str += "|------------------------|----------|\n";
    for (const row of server) {
        str += "| ";
        str += chalk.green(row.running.padEnd(23));
        str += "| ";
        str += chalk.blue(row.port.toString().padEnd(8));
        str += " |\n";
    }
    str += "+------------------------+----------+\n";
    console.log(chalk.bgBlack(str))
}