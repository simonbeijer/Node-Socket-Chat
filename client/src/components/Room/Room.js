import React, { useState } from "react";
import "./room.css";
import { Link } from "react-router-dom";

const Room = (props) => {
  // const [pass, setPass] = useState(false);

  const test = () => {
    props.setPassword(prompt("This room requires a password"));
  };
  console.log(props.unlockedRooms);
  console.log(props.lockedRooms);
  const roomArray = props.unlockedRooms.map((room) => (
    <Link key={room.id} to={`/chat?name=${props.name}&room=${room.roomName}`}>
      <li>{room.roomName}</li>
    </Link>
  ));

  console.log("PASSWORD", props.password);
  // if (!props.password) {
  //   setPass(true);
  // } else {
  //   setPass(false);
  // }

  const roomArrayLocked = props.lockedRooms.map((room) => (
    <Link
      onClick={test}
      key={room.id}
      to={
        props.password
          ? `/chat?name=${props.name}&room=${room.roomName}`
          : `/chat?name=${props.name}&room=lobby`
      }
    >
      <li>{room.roomName} + LOCKED</li>
    </Link>
  ));

  return (
    <div>
      <h1>Rooms</h1>
      <ul>{roomArray}</ul>

      <h1>Rooms Locked</h1>
      <ul>{roomArrayLocked}</ul>
    </div>
  );
};
export default Room;
