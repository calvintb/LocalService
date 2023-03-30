import React, { SyntheticEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom';
import "../signup-login.css"


export const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({email:"", password:""})

    const login = async (e: SyntheticEvent) => {
        e.preventDefault();
        if(user.email && user.password){
            console.log(import.meta.env.VITE_SERVER_URL)
            const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/users/login`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            })
            const resultBody = await result.json();
            
            if (resultBody.token){
                window.localStorage.setItem("token", resultBody.token);
            }
            setUser({email:"", password:""});
            navigate("/dashboard", {
                replace: true
            })
        }else{
            console.log("invalid inputs");
        }
    }

    return(
        <div>
            <div>
                <h1>Login Page</h1>
            </div>
            <form>
                <br></br>
                <label>Email</label>
                <input value={user.email} type='email' onChange={(e) => setUser({...user, email: e.target.value})}></input>

                <br></br>
                <label>Password</label>
                <input value={user.password} type='password' onChange={(e) => setUser({...user, password: e.target.value})}></input>

                <br></br>
                <label></label>
                <button onClick={login}>Login</button>
            </form>
        </div>
    )
}