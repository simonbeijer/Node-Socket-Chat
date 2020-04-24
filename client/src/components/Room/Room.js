import React from 'react';
import "./room.css";



const Room = (props) => {

    const roomArray = props.rooms.map((room) =>
        <li key={room.id}>{room.roomName}</li>
    );
    return (
        <div>
            <h1>Rooms</h1>
            <ul>{roomArray}</ul>
        </div>
    )
}
export default Room

