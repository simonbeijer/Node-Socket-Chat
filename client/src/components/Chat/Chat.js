import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import Room from "../Room/Room";
import AddRoom from "../AddRoom/AddRoom";

import "./chat.css";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [password, setPassword] = useState(null);
  const [wrongPassword, setWrongPassword] = useState(false);
  const ENDPOINT = "localhost:5000";
  const [lockedRooms, setLockedRooms] = useState([]);
  const [unlockedRooms, setUnlockedRooms] = useState([]);
  const [typing, setTyping] = useState([]);


  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", {
      name,
      room,
      id: Math.floor(Math.random() * 10000),
      password,
    });

    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("room-message", (data) => {
      let x = {
        name: data.name,
        message: data.message,
      };
      setMessages([...messages, x]);
    });
  });

  useEffect(() => {
    socket.on("new-rooms", (data) => {
      setLockedRooms(data.lockedRoomsX);
      setUnlockedRooms(data.unlockedRoomsX);
    });
  });

  useEffect(() => {
    socket.on("chat-message", (data) => {
      setMessages([...messages, data]);
    });
  });

  useEffect(() => {
    socket.on("users", (users) => {
      setUsersInRoom(users);
    });
  });

  useEffect(() => {
    socket.on("wrong-password", () => {
      setWrongPassword(true);
    });
  });

  useEffect(() => {
    socket.on("correct-password", () => {
      setWrongPassword(false);
    });
  });

  useEffect(() => {
    socket.on("display", (data) => {
      setTyping(data)
    });
  });

  let nr = 1;
  function key() {
    nr++;
    return nr;
  }

  function clearInput() {
    return inputValue;
  }

  function sendMessage() {
    socket.emit("chat-message", inputValue);
    setInputValue("");
  }

  function test() {
    socket.emit("typing", {
      user: name,
      typing: false,
      room: room
    })

  }

  return (
    <div className="mainContainer">
      <div className="chatContainer">
        <h1 className="chatHeading">Chat</h1>
        {typing.typing == true ? 
        <p>{typing.user + " skriver"}</p> : <p></p>}
        <ul className="chatMessages">
          {wrongPassword ? (
            <p>WRONG PASSWORD</p>
          ) : (
            messages.map(
              (message) =>
                message.room === room && (
                  <>
                  <li key={key()}>{`${message.name}:  ${message.message}`}
                  <img src={message.img} />
                  </li>
                  </>
                  )
                  
                  )
                  )}
        </ul>

        <div className="chatInputContainer">
          <input
            className="chatInput"
            value={clearInput()}
            onChange={(event) => {
              setInputValue(event.target.value); 
              if(event.target.value.length > 0) {
                socket.emit("typing", {
                  user: name,
                  typing: true,
                  room: room
                })
              } else {
                socket.emit("typing", {
                  user: name,
                  typing: false,
                  room: room
                })
              }}}
            type="text"
          />
          <button className="chatButton" 
          onClick={() => {sendMessage(); test()}}>
            Send
          </button>
        </div>
      </div>
      <div className="roomContainer">
        <div className="rooms">
          <Room
            name={name}
            room={room}
            lockedRooms={lockedRooms}
            unlockedRooms={unlockedRooms}
            setPassword={setPassword}
            password={wrongPassword}
          />
          <div>
            {showAddRoom && (
              <AddRoom
                name={name}
                room={room}
                setRoom={setRoom}
                setPassword={setPassword}
              />
            )}
          </div>
          <button onClick={() => setShowAddRoom(!showAddRoom)}>ADD ROOM</button>
        </div>
        <div className="roomname">
          <div>Roomname: {room}</div>
          <div>
            {usersInRoom.map((user) => (
              <p key={key()}>{user.name}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
