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
const _ = require("lodash");

app.use(router);

let rooms = [];
let availableRooms = [];
let foundRoom = false;
let nr;

function createId() {
  return Math.floor(Math.random() * 10000);
}

io.on("connection", (socket) => {
  console.log("user connected");
  let users = [];
  let userSocket = [];

  socket.on("join", ({ name, room, id, password }) => {
    userSocket = { name, userId: createId() };

    if (rooms.length <= 0) {
      console.log("NO ROOMS, LOBBY CREATED");
      rooms.push({
        roomName: room,
        id,
        password,
        users: [userSocket],
      });
    } else {
      nr = 0;
      for (const r of rooms) {
        nr++;
        if (r.roomName === room) {
          foundRoom = true;
          break;
        }
      }
      console.log(foundRoom);
      console.log(nr);

      if (foundRoom) {
        rooms[nr - 1].users.push(userSocket);
        console.log(JSON.stringify(rooms, null, 2));
        foundRoom = false;
      } else {
        rooms.push({
          roomName: room,
          id,
          password,
          users: [userSocket],
        });
        console.log(JSON.stringify(rooms, null, 2));
      }
    }

    // leave all other rooms first!

    for (const roomx of rooms) {
      socket.leave(roomx.roomName, () => {
        for (const user of roomx.users) {
          if (user.name === userSocket.name) {
            let index = roomx.users.indexOf(user);
            console.log("USERS BEFORE LEAVE ROOM", roomx.users);
            roomx.users.splice(index, 1);
            console.log("USERS AFTER LEAVE ROOM", roomx.users);
          }
        }
      });
    }

    socket.join(room, () => {
      availableRooms = [];
      for (let i of rooms) {
        availableRooms.push(i);
        if (i.roomName === room) {
          console.log("USERS BEFORE JOIN ROOM", i.users, room);
          i.users.push(userSocket);
          console.log("USERS AFTER JOIN ROOM", i.users, room);
          users = i.users;
        }
      }

      console.log("ROOMS:", JSON.stringify(rooms, null, 2));
      io.to(room).emit("room-message", {
        name,
        message: "has joined the room",
      });
      io.to(room).emit("users", users);
      io.emit("new-rooms", availableRooms);
    });

    socket.on("chat-message", (message) => {
      io.to(room).emit("chat-message", { message, name });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");

      for (let i of rooms) {
        if (i.roomName === room) {
          let index = i.users.indexOf(userSocket);
          i.users.splice(index, 1);
        }
      }

      users = [];
      for (let i of rooms) {
        if (i.roomName === room) {
          users = i.users;
        }
      }
      io.to(room).emit("users", users);
    });
  });
});

server.listen(port, () =>
  console.log(`Server is up an runing on port: ${port}`)
);

// {
//   "roomName": "123",
//   "id": 8197,
//   "password": "",
//   "users": [
//     {
//       "name": "Fredrik",
//       "userId": 8956
//     }
