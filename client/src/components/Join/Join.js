import React, { useState } from "react";
import { Link } from "react-router-dom";

import "./join.css";

const Join = () => {
  const [name, setName] = useState("");

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <div className="inputJoinContainer">
          <h1 className="heading">ENTER NAME</h1>

          <input
            type="text"
            placeholder="Name..."
            className="inputJoin"
            onChange={(event) => setName(event.target.value)}
          />

          <Link
            style={{ width: "100%", textAlign: "center" }}
            to={`/chat?name=${name}&room=${"lobby"}`}
            onClick={(event) => (!name ? event.preventDefault() : null)}
          >
            <button className="button" type="submit">
              SIGN IN
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Join;
