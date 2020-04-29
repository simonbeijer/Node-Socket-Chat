// const chalk = require('chalk')

// const router = require("./router");

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

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
let unlockedRoomsX = [];
let lockedRoomsX = [];
let foundRoom = false;
let nr;

function createId() {
  return Math.floor(Math.random() * 10000);
}

io.on("connection", (socket) => {
  console.log("user connected");

  let userSocket = [];

  socket.on("join", ({ name, room, id, password }) => {
    userSocket = { name, userId: createId() };

    //Create room if not exist, otherwise add user to room.
    if (rooms.length <= 0) {
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

      if (foundRoom) {
        rooms[nr - 1].users.push(userSocket);

        foundRoom = false;
      } else {
        rooms.push({
          roomName: room,
          id,
          password,
          users: [userSocket],
        });
      }
    }
    console.log("ROOMS:", JSON.stringify(rooms, null, 2));
    console.log(room);

    let roomIndex = rooms.findIndex((roomx) => roomx.roomName == room);
    console.log("roomindex", roomIndex);
    let myRoom = rooms.slice(roomIndex);

    console.log("myroom", myRoom);
    console.log("password", password);

    if (myRoom[0].password == password) {
      io.emit("correct-password", "You have entered an valid password");
      // Leave all other rooms first!
      for (const roomx of rooms) {
        socket.leave(roomx.roomName, () => {
          for (const user of roomx.users) {
            if (user.name === userSocket.name) {
              let index = roomx.users.indexOf(user);

              roomx.users.splice(index, 1);
              io.to(roomx.roomName).emit("users", roomx.users);
            }
          }
        });
      }

      //Join room
      socket.join(room, () => {
        unlockedRoomsX = [];
        lockedRoomsX = [];
        for (const i of rooms) {
          if (i.roomName === room) {
            i.users.push(userSocket);
            users = i.users;
          }
        }

        for (const i of rooms) {
          if (i.users.length <= 0) {
            let index = rooms.indexOf(i);

            rooms.splice(index, 1);
          }
        }

        //All locked and unlocked rooms

        for (const room of rooms) {
          if (!room.password) {
            unlockedRoomsX.push(room);
          }
        }
        for (const room of rooms) {
          if (room.password) {
            lockedRoomsX.push(room);
          }
        }
        console.log(unlockedRoomsX);
        console.log(lockedRoomsX);

        console.log("ROOMS:", JSON.stringify(rooms, null, 2));

        io.to(room).emit("room-message", {
          name,
          message: "has joined the room",
        });

        io.to(room).emit("users", users);
        io.emit("new-rooms", { lockedRoomsX, unlockedRoomsX });
      });

      socket.on("chat-message", (message) => {
        console.log(message)
          if(message === "/fed19") {
            io.to(room).emit("chat-message", { message, name, room, img: "https://media.giphy.com/media/W1VdPHo8Ft3Es/200w_d.gif" });
          } else if(message === "/dota") {
            io.to(room).emit("chat-message", { message, name, room, img: "https://media.giphy.com/media/50osJfiY106dO/200w_d.gif" });
          } else {
            io.to(room).emit("chat-message", { message, name, room, img: "" });
          }
      });

      socket.on('typing', (data) => {
        if(data.typing == true) {
          io.to(room).emit('display', data)
        } else {
          io.to(room).emit('display', data)
        }
      })

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
    } else {
      io.emit("wrong-password", "You have entered an invalid password");
    }
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
