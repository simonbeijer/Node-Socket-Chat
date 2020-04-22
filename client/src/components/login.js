import React, { useState } from 'react'
import { createUseStyles } from "react-jss";


const Login = (props) => {
    const [name, setName] = useState("")
    const useStyles = createUseStyles(
        {
            login: {
                display: "flex",
                alignItems: "center",
            },
            form: {
                display: "flex",
                flexDirection: "column",
            },
            input: {
                height: "2.5rem",
                fontSize: "1.3rem",
                textIndent: "1rem",
                border: "3px solid #61892F",
                backgroundColor: "#FeFeFe",
                borderRadius: "10px",
                "&:focus": {
                    border: "4px solid #86C232",
                    outline: "none",
                },
            },
            button: {
                marginTop: "1rem",
                height: "2.5rem",
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
        }
    )
    const classes = useStyles()

    const handleChange = (e) => {
        setName(e.target.value)
    }

    const submitLogin = () => {
        props.getName(name)
        props.hideLogin()
    }

    return (
        <div className={classes.login}>
            <form className={classes.form}>
                <input onChange={handleChange} name="name" className={classes.input} type="text" placeholder="Input your name..." />
                <button type="submit" className={classes.button} onClick={submitLogin}>Login</button>
            </form>
        </div>
    )
}

export default Login