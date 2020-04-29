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
  const [availableRooms, setAvailableRooms] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showAddRoom, setShowAddRoom] = useState(false);
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", {
      name,
      room,
      id: Math.floor(Math.random() * 10000),
      password: "",
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
    socket.on("new-rooms", (availableRooms) => {
      setAvailableRooms(availableRooms);
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

  return (
    <div className="mainContainer">
      <div className="chatContainer">
        <h1 className="chatHeading">Chat</h1>
        <ul className="chatMessages">
          {messages.map(
            (message) =>
              message.room === room && (
                <li key={key()}>{`${message.name}:  ${message.message}`}</li>
              )
          )}
        </ul>

        <div className="chatInputContainer">
          <input
            className="chatInput"
            value={clearInput()}
            onChange={(event) => setInputValue(event.target.value)}
            type="text"
          />
          <button className="chatButton" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
      <div className="roomContainer">
        <div className="rooms">
          <Room name={name} room={room} rooms={availableRooms} />
          <div>
            {showAddRoom && (
              <AddRoom name={name} room={room} setRoom={setRoom} />
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
