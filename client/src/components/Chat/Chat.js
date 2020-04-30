import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import Room from "../Room/Room";
import AddRoom from "../AddRoom/AddRoom";

import "./chat.css";
import CheckPassword from "../CheckPassword/CheckPassword";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [password, setPassword] = useState(null);
  const [correctPassword, setCorrectPassword] = useState(false);
  const ENDPOINT = "localhost:5000";
  const [lockedRooms, setLockedRooms] = useState([]);
  const [unlockedRooms, setUnlockedRooms] = useState([]);
  const [typing, setTyping] = useState([]);
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [passwordRoom, setNewRoomPassword] = useState("");

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

    setShowCheckPassword(false);
    setCorrectPassword(false);
    setShowAddRoom(false);
    setPassword(null);

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
    socket.on("wrong-password", () => {
      console.log("inne!");
      setCorrectPassword(false);
    });
  });
  useEffect(() => {
    socket.on("correct-password", () => {
      console.log("inne i correct password!");
      setCorrectPassword(true);
    });
  });

  useEffect(() => {
    socket.on("display", (data) => {
      setTyping(data);
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
      room: room,
    });
  }

  function testPassword() {
    socket.emit("test-password", {
      name: name,
      room: passwordRoom,
      password: password,
    });
  }

  return (
    <div className="mainContainer">
      <div className="chatContainer">
        <h1 className="chatHeader">{room}</h1>
        <ul className="chatMessages">
          {messages.map(
            (message) =>
              message.room === room && (
                <li
                  key={key()}
                  style={{
                    alignSelf: `${
                      message.name === name ? "flex-start" : "flex-end"
                    }`,
                  }}
                >
                  <p className="chatName">{message.name}</p>
                  <p
                    className="chatMessage"
                    style={{
                      backgroundColor: `${
                        message.name === name
                          ? "rgba(150,150,150,0.5)"
                          : "rgba(226, 97, 97, 0.8)"
                      }`,
                    }}
                  >
                    {message.message}
                  </p>
                  <img alt="" src={message.img} />
                </li>
              )
          )}
        </ul>

        <div className="chatInputContainer">
          <input
            className="chatInput"
            value={clearInput()}
            onChange={(event) => {
              setInputValue(event.target.value);
              if (event.target.value.length > 0) {
                socket.emit("typing", {
                  user: name,
                  typing: true,
                  room: room,
                });
              } else {
                socket.emit("typing", {
                  user: name,
                  typing: false,
                  room: room,
                });
              }
            }}
            type="text"
          />
          <button
            className="chatButton"
            onClick={() => {
              sendMessage();
              test();
            }}
          >
            Send
          </button>
          {typing.typing ? <p>{typing.user + " skriver..."}</p> : <p></p>}
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
            password={correctPassword}
            testPassword={testPassword}
            setShowCheckPassword={setShowCheckPassword}
            setNewRoomPassword={setNewRoomPassword}
          />
        </div>
        <button
          className="addRoomBtn"
          onClick={() => setShowAddRoom(!showAddRoom)}
        >
          ADD ROOM
        </button>
        <div className="addRoom">
          {showAddRoom && (
            <AddRoom
              name={name}
              room={room}
              setRoom={setRoom}
              setPassword={setPassword}
            />
          )}
        </div>
        <div className="showPassword">
          {showCheckPassword && (
            <CheckPassword
              setPassword={setPassword}
              passwordRoom={passwordRoom}
              testPassword={testPassword}
              correctPassword={correctPassword}
              name={name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
