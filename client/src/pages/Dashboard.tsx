import React, { useReducer } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Reptile {
    id: number;
    species: string;
    name: string;
    sex: string;
}
interface Schedule {
    id: number;
    type:string,
    description:string,
    "monday":boolean,
    "tuesday":boolean,
    "wednesday":boolean,
    "thursday":boolean,
    "friday":boolean,
    "saturday":boolean,
    "sunday":boolean
}
const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export const Dashboard = () => {
    const [schedules, setSchedules] = useState([]);
    const [reptiles, setReptiles] = useState([]);
    const [isCreatingReptile, setCreateReptile] = useState(false);
    const [reptile, setReptile] = useState({name:"", species:"", sex:""});

    const ReptileCreationForm = () => {        
        return (
        <form><h2>Create your reptile</h2>
            <input key="name" onChange={(e) => setReptile({...reptile, name:e.target.value})} placeholder='Name' value={reptile.name}></input><br/>
            <input onChange={(e) => setReptile({...reptile, species:e.target.value})} placeholder='Species' value={reptile.species}></input><br/>
            <input onChange={(e) => setReptile({...reptile, sex:e.target.value})} placeholder='Sex' value={reptile.sex}></input> <br/>
            <button type="button" onClick={createReptile}>Create</button>
            <button type="button" onClick={()=>{setCreateReptile(false)}}>Cancel</button>
    
        </form>
        );
    }

    const CreateButtons = () => {
        return (
        <div>
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
            setSchedules(resultBody.schedules.filter((sched: any)=>{return true == sched[day];}));
            console.log(resultBody.schedules);
        }
    }   

    const createReptile = async () => {
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
    const deleteReptile = async (reptileId:number) => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles/${reptileId}`, {
            method: "delete",
            headers: {
                Authorization : "Bearer " + window.localStorage.getItem("token"),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reptile),
        })
        .then(() => {getReptiles()}) 
    }

    useEffect(()=>{
        getReptiles();
        getSchedules();
    }, []);
    

    let body;
    if (isCreatingReptile) {
        body = ReptileCreationForm();
    } else {
        body = CreateButtons();
    }
    return (
    <div>
        <h1>
            I am on the dashboard page!
        </h1>
        <div className="user-schedules">
            <h1>Your schedule for the day:</h1>
            <div className='schedule-container'>
            {
            schedules.map((schedule: Schedule) => (
              <div key={schedule.id} className='schedule-item'>
                <h2>
                    {schedule.type} | {schedule.description} 
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
              <div key={reptile.id} className='reptile-item'><h2>
              <Link to={{pathname: `/reptiles/${reptile.id}`}}>{reptile.name}</Link> {reptile.species} {reptile.sex}
            </h2>
                <button onClick={()=>deleteReptile(reptile.id)}>Delete</button>
              </div>
            ))
          }
            </div>
            { body }
        </div>
        <div>
            <button>Log Out</button>
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
