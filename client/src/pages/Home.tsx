import { useEffect, useState } from "react";


export const Home = () => {
    useEffect(() => {
        // check that user is logged in
        // if user is logged in
        // navigate to dashboard 
        // else let the page load
    }, [])

    return (
        <>
            <h1> The Handy Dandy Reptile Husbandry</h1>
            <p> Do you own several reptiles all with their own schedules, unique names, and husbandries??? Well you're in luck! This application is just for you! The Handy Dandy Reptile Husbandry is a reptile mangement tool designed for reptile owners of just three specific snakes :D</p>
            <button>Login</button>
            <button>Signup</button>
            
            {/* router go here :D */}
        </>
    )
}