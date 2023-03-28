import React, { SyntheticEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom';
import "../signup-login.css"

interface SignupBody {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    token: string
}

export const Signup = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({firstName:"", lastName:"", email:"", password:""})

    const createUser = async (e: SyntheticEvent) => {
        e.preventDefault();
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        const resultBody = await result.json();
        console.log("result => " + resultBody.token);
        if (resultBody.token){
            window.localStorage.setItem("token", resultBody.token);
        }
        setUser({firstName:"", lastName:"", email:"", password:""});
        navigate("/dashboard", {
            replace: true
        })
    }

    return (
        <div>
            <div>
                <h1>Create Reptile Husbandry Account</h1>
            </div>
            <form>
                <label>First Name</label>
                <input value={user.firstName} type='text' onChange={(e) => setUser({...user, firstName: e.target.value})}></input>

                <br></br>
                <label>Last Name</label>
                <input value={user.lastName} type='text' onChange={(e) => setUser({...user, lastName: e.target.value})}></input>

                <br></br>
                <label>Email</label>
                <input value={user.email} type='email' onChange={(e) => setUser({...user, email: e.target.value})}></input>

                <br></br>
                <label>Password</label>
                <input value={user.password} type='password' onChange={(e) => setUser({...user, password: e.target.value})}></input>

                <br></br>
                <label></label>
                <button onClick={createUser}>Sign Up</button>
            </form>
        </div>
    )
}