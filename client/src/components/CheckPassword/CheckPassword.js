import React from "react";
import { Link } from "react-router-dom";

import "./checkPassword.css";

const CheckPassword = (props) => {
  return (
    <div className="passOuterContainer">
      <div>
        <div className="passinputContainer">
          <input
            type="text"
            placeholder="Password..."
            className="inputJoin"
            onChange={(event) => props.setPassword(event.target.value)}
          />
          <button
            className="enterRoom"
            type="submit"
            onClick={props.testPassword}
          >
            Check password
          </button>
          {props.correctPassword && (
            <Link to={`/chat?name=${props.name}&room=${props.passwordRoom}`}>
              <button className="enterRoom">ENTER ROOM</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckPassword;
