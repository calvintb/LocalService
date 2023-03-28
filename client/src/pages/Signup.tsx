import React, { SyntheticEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from 'react-router-dom';

interface SignupBody {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

export const Signup = () => {
    const navigate = useNavigate();
    // const [firstName, setFirstName] = useState("")
    // const [lastName, setLastName] = useState("")
    // const [email, setEmail] = useState("")
    // const [password, setPassword] = useState("")
    const [user, setUser] = useState({firstName:"", lastName:"", email:"", password:""})


    const createUser = async (e: SyntheticEvent) => {
        e.preventDefault();
        console.log(JSON.stringify(user));
        console.log(import.meta.env);
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        .then(() => {setUser({firstName:"", lastName:"", email:"", password:""})})
        //.then(() => {window.localStorage.setItem("token", result.body.token});
        console.log(await result);  
    
    }

    return (
        <div>
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