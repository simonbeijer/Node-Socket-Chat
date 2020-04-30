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

  socket.on("test-password", (data) => {
    let roomIndex = rooms.findIndex((roomx) => roomx.roomName == data.room);
    let myRoom = rooms.slice(roomIndex);
    if (myRoom[0].password == data.password) {
      socket.emit("correct-password");
    } else {
      socket.emit("wrong-password");
    }
  });

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

      io.to(room).emit("room-message", {
        name,
        message: "has joined the room",
      });

      io.to(room).emit("users", users);
      io.emit("new-rooms", { lockedRoomsX, unlockedRoomsX });
    });

    console.log("ROOMS:", JSON.stringify(rooms, null, 2));

    socket.on("chat-message", (message) => {
      if (message === "/fed19") {
        io.to(room).emit("chat-message", {
          message,
          name,
          room,
          img: "https://media.giphy.com/media/W1VdPHo8Ft3Es/200w_d.gif",
        });
      } else if (message === "/dota") {
        io.to(room).emit("chat-message", {
          message,
          name,
          room,
          img: "https://media.giphy.com/media/5NTfjgFn3vjWg/200w_d.gif",
        });
      } else if (message === "/wow") {
        io.to(room).emit("chat-message", {
          message,
          name,
          room,
          img: "https://media.giphy.com/media/8vHSt3vau0pFh0ZemM/200w_d.gif",
        });
      } else if (message === "/garrosh") {
        io.to(room).emit("chat-message", {
          message,
          name,
          room,
          img: "https://media.giphy.com/media/1oEvw29Nv7GnkhDML5/200w_d.gif",
        });
      } else {
        io.to(room).emit("chat-message", { message, name, room, img: "" });
      }
    });

    socket.on("typing", (data) => {
      if (data.typing == true) {
        io.to(room).emit("display", data);
      } else {
        io.to(room).emit("display", data);
      }
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
