import React from "react";
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom"
import '../Home.css';



export const Home = () => {
    const navigate = useNavigate()

    //if there's no token, stay on this page, else go to dashboard
    useEffect(() => {
      if (window.localStorage.getItem("token")) {
        const result = fetch(`${import.meta.env.VITE_SERVER_URL}/users/me`, {
          method: "get",
          headers: {
              Authorization : "Bearer " + window.localStorage.getItem("token"),
              "Content-Type": "application/json",
          }
        })
        .then(response => response.json())
        .then(data => {
            if (!data.message) {
              navigate("/dashboard", {
                replace: true
              })
            }
        })
      }
    })
  
    

      //   if (window.localStorage.getItem("token")) {
      //     navigate("/dashboard", {
      //       replace: true
      //     })
      //   }
      // }, []);
    
 

    return (
        <>
          <div className="home-page">
          
            <h1> The Handy Dandy Reptile Husbandry</h1>
            <div className="black-container" >
              <h3>What It's All About:</h3>
              <p> Do you own several reptiles all with their own schedules, unique names, and husbandries??? Well you're in luck! This application 
                is just for you! The Handy Dandy Reptile Husbandry is a reptile mangement tool designed for reptile owners of just three specific 
                snakes :D</p>
              <Link className="button" to={{pathname: `/login`}}>Login</Link>
              <Link className="button" to={{pathname: `/signup`}}>SignUp</Link>  
            </div>
          </div>

          
            
        </>
    )
}