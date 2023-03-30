import React, { useReducer } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import './Reptile.css'

interface Reptile {
    id: number;
    species: string;
    name: string;
    sex: string;
}
type Schedule = {
    id: number;
    type: string,
    description: string,
    "monday": boolean,
    "tuesday": boolean,
    "wednesday": boolean,
    "thursday": boolean,
    "friday": boolean,
    "saturday": boolean,
    "sunday": boolean
}
type HusbandryRecord = {
    id: number,
    length: string,
    weight: string,
    temperature: string,
    humidity: string,
}
type Feeding = {
    id: number,
    foodItem: string,
}

export const Reptile = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [feedings, setFeedings] = useState<Feeding[]>([]);
    const [husbandryRecords, setHusbandryRecords] = useState<HusbandryRecord[]>([]);
    const [reptiles, setReptiles] = useState<Reptile[]>([]);
    const currReptileId = useParams().id;

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [sex, setSex] = useState("");

    const [foodItem, setFoodItem] = useState("");

    const [length, setLength] = useState("")
    const [weight, setWeight] = useState("")
    const [temperature, setTemperature] = useState("")
    const [humidity, setHumidity] = useState("")

    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [monday, setMonday] = useState(false);
    const [tuesday, setTuesday] = useState(false);
    const [wednesday, setWednesday] = useState(false);
    const [thursday, setThursday] = useState(false);
    const [friday, setFriday] = useState(false);
    const [saturday, setSaturday] = useState(false);
    const [sunday, setSunday] = useState(false);


    const getReptiles =  async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles`, {
            headers: {
                Authorization : "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const resultBody = await result.json();
        if (resultBody.reptiles){
            setReptiles(resultBody.reptiles);
        }
    }

    const getFeedings = async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/feedings/${currReptileId}`, {
            headers: {
                Authorization : "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const resultBody = await result.json();
        if (resultBody.feedings){
            setFeedings(resultBody.feedings);
        }
    }
    
    const getSchedules = async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/schedules/${currReptileId}`, {
            headers: {
                Authorization : "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const resultBody = await result.json();
        if (resultBody.schedules){
            setSchedules(resultBody.schedules)
        }
    }   

    const getHusbandryRecords = async () => {
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/husbandry-records/${currReptileId}`, {
            headers: {
                Authorization : "Bearer " + window.localStorage.getItem("token"),
            }
        });
        const resultBody = await result.json();
        if (resultBody.husbandries){
            setHusbandryRecords(resultBody.husbandries)
        }
    }   

    async function updateReptile() {
        const body = {
          name,
          species,
          sex,
        }
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/reptiles/${currReptileId}`, {
          method: 'put',
          headers: {
            "Authorization": "Bearer " + window.localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });
        const resultBody = await result.json();
        if (resultBody.reptile) {
            setReptiles([...reptiles, resultBody.reptile])
        }
        getReptiles();
    }

    async function createFeeding() {
        const body = {
          foodItem
        }
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/feedings/${currReptileId}`, {
          method: 'post',
          headers: {
            "Authorization": "Bearer " + window.localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        const resultBody = await result.json();
        if (resultBody.feeding) {
          setFeedings([...feedings, resultBody.feeding])
        }
    }

    async function createHusbandryRecord() {
        const body = {
          length,
          weight,
          temperature,
          humidity
        }
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/husbandry-records/${currReptileId}`, {
          method: 'post',
          headers: {
            "Authorization": "Bearer " + window.localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });
        const resultBody = await result.json();
        if (resultBody.husbandry){
            setHusbandryRecords([...husbandryRecords, resultBody.husbandry])
        }
    }

    async function createSchedule() {
        const body = {
          type,
          description,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday
        }
        const result = await fetch(`${import.meta.env.VITE_SERVER_URL}/schedules/${currReptileId}`, {
          method: 'post',
          headers: {
            "Authorization": "Bearer " + window.localStorage.getItem("token"),
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        const resultBody = await result.json()
        if (resultBody.schedule){
            setSchedules([...schedules, resultBody.schedule])
        }
        
    }


    useEffect(()=>{
        getReptiles();
        getFeedings();
        getSchedules();
        getHusbandryRecords()
    }, []);

    return (
    <div className='black shadowed main_stuff-box'>
        <div className='purple shadowed stuff-box'>
            {reptiles
                .filter((reptile: Reptile) => (reptile.id).toString() === currReptileId)
                .map((reptile: Reptile) => (
                    <div key={reptile.id}>
                    <h1>{reptile.name}</h1>
                    <h2>Species: {reptile.species}</h2>
                    <h2>Sex: {reptile.sex}</h2>
                    </div>
                ))
            }
        </div>
        
            <br />
            <h2>Feedings</h2>
            <div className='feedings'>
                { feedings.map((feeding: Feeding) => (
                    <div key={feeding.id} className='green shadowed stuff-box child'>
                        <h4>{feeding.foodItem}</h4>
                    </div>
                )) }
            </div>
            <br />
            <h2>Husbandry records</h2>
            <div className=''>
                { husbandryRecords.map((husbandries: HusbandryRecord) => (
                    <div key={husbandries.id} className='green shadowed stuff-box husbandry-records'>
                        <h4> Length: {husbandries.length} </h4>
                        <h4> Weight: {husbandries.weight} </h4>
                        <h4> Temperature: {husbandries.temperature} </h4>
                        <h4> Humidity: {husbandries.humidity} </h4>
                    </div>
                )) }
            </div>

            <br />
            <h2>Schedules</h2>
            <div className=''>
                { schedules.map((schedule: Schedule) => (
                    <div key={schedule.id} className='purple shadowed stuff-box'>
                        <h4 className='sched_title'> Activity type: {schedule.type}</h4>
                        <h4 className='sched_title'> Description: {schedule.description} </h4>
                        <div className='days'>
                            <h4> Mon: {(schedule.monday).toString()} </h4>
                            <h4> Tue: {(schedule.tuesday).toString()} </h4>
                            <h4> Wed: {(schedule.wednesday).toString()} </h4>
                            <h4> Thu: {(schedule.thursday).toString()} </h4>
                            <h4> Fri: {(schedule.friday).toString()} </h4>
                            <h4> Sat: {(schedule.saturday).toString()} </h4>
                            <h4> Sun: {(schedule.sunday).toString()} </h4>
                        </div>
                        <br />
                    </div>
                )) }
            </div>

            <br />
            <br />
            <br />
            <div className='green stuff-box'>
                <br />
                <h2>Update reptile</h2>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    updateReptile()
                }}
                >
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder='Type new name here'/>
                    <br />
                    <input type="text" value={species} onChange={e => setSpecies(e.target.value)} placeholder='Type new species here'/>
                    <br />
                    <input type="text" value={sex} onChange={e => setSex(e.target.value)} placeholder='Type new sex here'/>
                    <br />
                    <button type="submit" className='button'>Update Reptile</button>
                </form> 
            </div>

            <div className='green stuff-box'>
                <br />
                <h2>Create a new feeding</h2>
                <form
                onSubmit={(e) => {
                    e.preventDefault()
                    createFeeding()
                }}
                >
                    <input type="text" value={foodItem} onChange={e => setFoodItem(e.target.value)} placeholder='Type feeding here'/>
                    <br />
                    <button type="submit" className='button'>Create a feeding</button>
                </form>
            </div>


            <div className='green stuff-box'>
                <br />
                <h2>Create a new husbandry record</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        createHusbandryRecord()
                    }}
                >
                    <input type="text" value={length} onChange={e => setLength(e.target.value)} placeholder='Type length here'/>
                    <br />
                    <input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder='Type weight here'/>
                    <br />
                    <input type="text" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder='Type temperature here'/>
                    <br />
                    <input type="text" value={humidity} onChange={e => setHumidity(e.target.value)} placeholder='Type humidity here'/>
                    <br />
                    <button type="submit" className='button'>Create a husbandry record</button>
                </form>
            </div>

            <div className='green stuff-box'>
                <br />
                <h2>Create a new schedule</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        createSchedule()
                    }}
                >
                    <input type="text" value={type} onChange={e => setType(e.target.value)} placeholder='Type type here'/>
                    <br />
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder='Type description here'/>
                    <div className='days'>
                        <div>
                            <br />M
                            <input type="checkbox" checked={monday} onChange={e => setMonday(e.target.checked)}/>
                        </div>

                        <div>
                            <br />T
                            <input type="checkbox" checked={tuesday} onChange={e => setTuesday(e.target.checked)}/>
                        </div>

                        <div>
                            <br />W
                            <input type="checkbox" checked={wednesday} onChange={e => setWednesday(e.target.checked)}/>
                        </div>

                        <div>
                            <br />T
                            <input type="checkbox" checked={thursday} onChange={e => setThursday(e.target.checked)}/>
                        </div>

                        <div>
                            <br />F
                            <input type="checkbox" checked={friday} onChange={e => setFriday(e.target.checked)}/>
                        </div>

                        <div>
                            <br />S
                            <input type="checkbox" checked={saturday} onChange={e => setSaturday(e.target.checked)}/>
                        </div>
    
                        <div>
                            <br />S
                            <input type="checkbox" checked={sunday} onChange={e => setSunday(e.target.checked)}/>
                            <br />
                        </div>    
                    </div>
                    
                    <button type="submit" className='button button:hover'>Create a schedule</button>
                </form>
            </div>
    </div>
    );
}