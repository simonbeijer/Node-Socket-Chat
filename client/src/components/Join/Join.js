import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./join.css";

const Join = () => {
  const [name, setName] = useState("");

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <div className="inputContainer">
          <h1 className="heading">Join</h1>
          <div>
            <input
              type="text"
              placeholder="Name"
              className="joinInput"
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <Link
            to={`/chat?name=${name}&room=${"lobby"}`}
            onClick={(event) => (!name ? event.preventDefault() : null)}
          >
            <button className="button mt-20" type="submit">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Join;
