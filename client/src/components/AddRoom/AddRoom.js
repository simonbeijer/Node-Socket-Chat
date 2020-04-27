import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./addRoom.css";

const AddRoom = (props) => {
  return (
    <div className="addOuterContainer">
      <div className="addInnerContainer">
        <div className="inputContainer">
          <h1 className="heading">AddRoom</h1>
          <div>
            <input
              type="text"
              placeholder="Room"
              className="addInput"
              onChange={(event) => props.setRoom(event.target.value)}
            />
          </div>
          <Link
            to={`/chat?name=${props.name}&room=${props.room}`}
            onClick={(event) => (!props.room ? event.preventDefault() : null)}
          >
            <button className="button mt-20" type="submit">
              Create
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
