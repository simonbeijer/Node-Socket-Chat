import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import "./chat.css";

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const ENDPOINT = "localhost:5000";

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room });

    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, [ENDPOINT, location.search]);


  useEffect(() => {
    socket.on('room-message', (data) => {
      setMessages([...messages, data])
    })
  })

  useEffect(() => {
    socket.on('chat-message', (data) => {
      setMessages([...messages, data])
    })
  })

  let nr = 1
  function key() {
    nr++
    return nr
  }

  function clearInput() {
    return inputValue
  }

  function sendMessage() {
    socket.emit('chat-message', inputValue)
    setInputValue("")
  }

  return (
    <div>
      <h1>Chat</h1>
      <ul>{messages.map(message => (
        <li key={key()}>{message.name + ": " + message.message}</li>
      ))}</ul>

      <div>
        <input value={clearInput()} onChange={(event) => setInputValue(event.target.value)} type="text" />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
