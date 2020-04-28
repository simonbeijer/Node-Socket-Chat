import React from "react";
import "./room.css";
import { Link } from "react-router-dom";

const Room = (props) => {
  const roomArray = props.rooms.map((room) => (
    <Link key={room.id} to={`/chat?name=${props.name}&room=${room.roomName}`}>
      <li>{room.roomName}</li>
    </Link>
  ));
  return (
    <div>
      <h1>Rooms</h1>
      <ul>{roomArray}</ul>
    </div>
  );
};
export default Room;
