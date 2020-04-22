import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import io from 'socket.io-client';
import Login from './components/login'


const App = () => {
  const socket = io('http://localhost:3000');
  const [showLogin, setShowLogin] = useState(true)

  const hideLogin = () => {
    setShowLogin(false)
  }

  const useStyles = createUseStyles({
    appContainer: {
      height: "100vh",
      overflow: "scroll",
      display: "flex",
      justifyContent: "center",
    },
    messagesList: {
      width: "60%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      listStyleType: "none",
      padding: "2rem",
      "& li:nth-child(odd)": {
        alignSelf: "start",
      },
    },
    form: {
      width: "100%",
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: "#474B4F",
      height: "4rem",
      position: "fixed",
      bottom: 0,
    },
    input: {
      width: "80%",
      height: "70%",
      fontSize: "1.3rem",
      textIndent: "1rem",
      border: "3px solid #61892F",
      borderRadius: "10px",
      backgroundColor: "#6B6E70",
      "&:focus": {
        border: "4px solid #86C232",
        borderRadius: "10px",
        backgroundColor: "#FeFeFe",
        outline: "none",
      },
    },
    button: {
      width: "15%",
      height: "74%",
      backgroundColor: "#86C232",
      borderRadius: "10px",
      border: "none",
      color: "#222629",
      fontSize: "1.3rem",
      "&:hover": {
        cursor: "pointer",
        backgroundColor: "#61892F",
      },
    },
    li: {
      background: "#86C232",
      padding: "2rem",
      borderRadius: "15px",
      marginBottom: "2rem",
      display: "inline-block",
      boxShadow: "8px 2px 16px #474B4F",
    },
  });
  const classes = useStyles();


  function getName(name) {
    console.log(name)
  }

  return (

    <div className={classes.appContainer} >
      {showLogin && (
        <Login getName={getName} hideLogin={hideLogin} />
      )}
      {!showLogin && (
        <>
          <ul id="messages" className={classes.messagesList} >
            <li className={classes.li}>
              <p style={{ fontWeight: "bold" }}>Simon:</p>
              <p>Jonathan, jag älskar dig av hela mitt hjärta</p>
            </li>
            <li className={classes.li}>
              <p style={{ fontWeight: "bold" }}>Jonathan:</p>
              <p>Jag är ledsen, jag ville bara ha din kropp</p>
            </li>
            <li className={classes.li}>
              <p style={{ fontWeight: "bold" }}>Simon:</p>
              <p>Left the conversation...</p>
            </li>
          </ul>
          <div className={classes.form}>
            <input className={classes.input} autoComplete="off" />
            <button className={classes.button}>Send</button>
          </div>
        </>
      )}


    </div>

  );
};

export default App;

