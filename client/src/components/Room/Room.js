import React from "react";
import "./room.css";
import { Link } from "react-router-dom";

const Room = (props) => {
  const roomArray = props.unlockedRooms.map((room) => (
    <div key={room.id}>
      <Link key={room.id} to={`/chat?name=${props.name}&room=${room.roomName}`}>
        <li>
          <h3>{room.roomName}</h3>
        </li>
      </Link>
      {room.users.map((user, index) => (
        <p key={index}>{user.name}</p>
      ))}
    </div>
  ));

  const roomArrayLocked = props.lockedRooms.map((room) => (
    <div
      onClick={() => {
        props.setNewRoomPassword(room.roomName);
        props.setShowCheckPassword(true);
      }}
      key={room.id}
    >
      <li>
        <h3>
          {room.roomName} <i className="fas fa-lock"></i>
        </h3>
      </li>
      {room.users.map((user, index) => (
        <p key={index}>{user.name}</p>
      ))}
    </div>
  ));

  return (
    <div className="allRooms">
      <div className="unlockedRooms">
        <h1>Open rooms</h1>
        <ul>{roomArray}</ul>
      </div>
      <div className="unlockedRooms">
        <h1>Locked rooms</h1>
        <ul>{roomArrayLocked}</ul>
      </div>
    </div>
  );
};
export default Room;
