// const express = require("express");
// const socketIO = require("socket.io");
// const http = require("http");

// const chalk = require('chalk')

// const router = require("./router");

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

// app.use(router);


// const serverPort = [{
//     running: 'Server is running!',
//     port: process.env.PORT || 5000,
// }]

// io.on("connection", (socket) => {
//   console.log("user connected");

//   socket.on("join", ({ name, room }) => {
//     console.log(name);
//     console.log(room);
//   });

//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

// server.listen(serverPort.port, () =>
//     portRunning()
// );


// // Styled cli
// function portRunning() {
//     let str;
//     str = "+------------------------+----------+\n";
//     str += "|  Is server running?    |  Port    |\n";
//     str += "|------------------------|----------|\n";
//     for (const row of serverPort) {
//         str += "| ";
//         str += chalk.green(row.running.padEnd(23));
//         str += "| ";
//         str += chalk.blue(row.port.toString().padEnd(8));
//         str += " |\n";
//     }
//     str += "+------------------------+----------+\n";
//     console.log(chalk.bgBlack(str))
// }

const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const port = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(router);

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("join", ({ name, room }) => {
    console.log("Name: " + name);
    console.log("Room: " + room);
    socket.join(room, () => {
      io.to(room).emit("room-message", { name, message: "has joined the room" });
    })

    socket.on("chat-message", (message) => {
      io.to(room).emit("chat-message", { message, name })
    })
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () =>
  console.log(`Server is up an runing on port: ${port}`)
);



