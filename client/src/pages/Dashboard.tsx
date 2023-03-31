import React, { useReducer } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'
import { useNavigate } from "react-router-dom"
import { Navbar } from '../components/navbar';

interface Reptile {
    id: number;
    species: string;
    name: string;
    sex: string;
}
interface Schedule {
    [index: string |number]: string | number | boolean,
    id: number;
    type:string;
    description:string;
    monday:boolean;
    tuesday:boolean;
    wednesday:boolean;
    thursday:boolean;
    friday:boolean;
    saturday:boolean;
    sunday:boolean;
    reptileId: number;
}

const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export const Dashboard = () => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [reptiles, setReptiles] = useState([]);
    const [isCreatingReptile, setCreateReptile] = useState(false);
    const [reptile, setReptile] = useState({name:"", species:"", sex:""});

    const ReptileCreationForm = () => {        
        return (
        <form><h2>Create your reptile</h2>
            <div className='reptile-create'>
                <input key="name" onChange={(e) => setReptile({...reptile, name:e.target.value})} placeholder='Name' value={reptile.name}></input><br/>
                <input onChange={(e) => setReptile({...reptile, species:e.target.value})} placeholder='Species' value={reptile.species}></input><br/>
                <input onChange={(e) => setReptile({...reptile, sex:e.target.value})} placeholder='Sex' value={reptile.sex}></input> <br/>
                <div className='buttons'>
                    <button type="button" onClick={createReptile}>Create</button>
                    <button type="button" onClick={()=>{setCreateReptile(false)}}>Cancel</button>
                </div>
            </div>
        </form>
        );
    }

    const CreateButtons = () => {
        return (
        <div >
            <button onClick={() => {setCreateReptile(true)}}>Add a new reptile</button>
        </div>
        );
    }

    const getReptiles =  async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles`, {
            headers: {
                Authorization : "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const resultBody = await result.json();
        if (resultBody.reptiles){
            setReptiles(resultBody.reptiles);
            console.log(resultBody.reptiles);
        }
    }

    const getSchedules = async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/schedules`, {
            headers: {
                Authorization : "Bearer " + window.localStorage.getItem("token"),
            }
        });

        const resultBody = await result.json();
        if (resultBody.schedules){
            const date = new Date();
            const day = days[date.getDay()];
            setSchedules(resultBody.schedules.filter((sched: Schedule)=>{return true == sched[day];}));
            console.log(resultBody.schedules);
        }
    }   

    const createReptile = async () => {
        if (reptile.name && reptile.species && reptile.sex){
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles`, {
            method: "post",
            headers: {
                Authorization : "Bearer " + window.localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reptile),
        })
        .then(() => {getReptiles(); setReptile({name:"", species:"", sex:""})})
        }
    }
    const deleteReptile = async (reptileId:number) => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles/${reptileId}`, {
            method: "delete",
            headers: {
                Authorization : "Bearer " + window.localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reptile),
        })
        getSchedules();
        getReptiles();
    }
    

    useEffect(()=>{
        /* Check if user is logged in and redirect to home*/
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
                if (data.message) {
                  navigate("/", {
                    replace: true
                  })
                }
            })
          }

        getReptiles();
        getSchedules();
    }, []);
    

    let body;
    if (isCreatingReptile) {
        body = ReptileCreationForm();
    } else {
        body = CreateButtons();
    }
    // getReptiles()   
    return (
    <div className='dashboard-page'>
        <Navbar></Navbar>

        <h1>
            Dashboard
        </h1>
        <div className="user-schedules">
            <h1>Your schedule for the day:</h1>
            <div className='schedule-container'>
            {
            schedules.map((schedule: Schedule) => (
              <div key={schedule.id} className='schedule-item'>
                <h2>
                    Reptile: {reptiles.length > 0 ? (reptiles.filter((rept:Reptile)=>rept.id == schedule.reptileId)[0] as Reptile).name :<></> } | Type: {schedule.type} | Description: {schedule.description} 
                </h2>
              </div>
            ))
          }
            </div>
        </div>
        <div>
            <h1>This is a list of all of your reptiles</h1>
            <div className='reptile-container'>
            {
            reptiles.map((reptile: Reptile) => (
              <div key={reptile.id} className='reptile-item'>
                <h2>{reptile.name} | {reptile.species} ({reptile.sex})</h2>
                <div className='button-container'>
                    <Link className='button' to={{pathname: `/reptiles/${reptile.id}`}}>Manage</Link>
                    <button className='button' onClick={()=>deleteReptile(reptile.id)}>Delete</button>
                </div>
    
              </div>
            ))
          }
            </div>
            { body }
        </div>
    </div>
    
    );
    
}



/* 
    I should see all of the schedules for my user for the day of the week it is (for example, if it is Monday then I should only see the schedules that have me doing something on Monday.)
    I should see a list of all my reptiles
    When selecting a reptile the app should navigate to the Reptile page
    I should be able to create a new reptile (you can do this on this page via something like a pop up, or you can create a new page for this)
    I should be able to delete a reptile.
    I should be able to log out of my account
*/
