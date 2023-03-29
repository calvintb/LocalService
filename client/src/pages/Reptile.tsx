import React, { useReducer } from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom'


//No error handling atm. Ex: If user types in 3 of the four fields needed to make a husbandry record

interface Reptile {
    id: number;
    species: string;
    name: string;
    sex: string;
}
interface Schedule {
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
interface HusbandryRecord {
    id: number,
    length: string,
    weight: string,
    temperature: string,
    humidity: string,
}
interface Feeding {
    id: number,
    foodItem: string,
}

export const Reptile = () => {
    const [schedules, setSchedules] = useState([]);
    const [feedings, setFeedings] = useState([]);
    const [husbandryRecords, setHusbandryRecords] = useState([]);
    const [reptiles, setReptiles] = useState([]);
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

    const [reptile, setReptile] = useState({name: "", species: "", sex: ""});


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
          setReptile({name: name, species: species, sex: sex})
        }
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
      }


    useEffect(()=>{
        getReptiles();
        getFeedings();
        getSchedules();
        getHusbandryRecords()
    }, []);

    return (
    <div>
        <h1>I am on the reptile page of reptile {useParams().id} !</h1>
            <h1>List of all the feedings of reptile {useParams().id}</h1>
            <div className='feeding-container'>
                { feedings.map((feeding: Feeding) => (
                    <div key={feeding.id}className='reptile-item'>
                        <h2>{feeding.foodItem}</h2>
                        <br />
                    </div>
                )) }
            </div>
        
            <h1>This is a list of all of the husbandry records for this reptile</h1>
            <div className='husbandries-container'>
                { husbandryRecords.map((husbandries: HusbandryRecord) => (
                    <div key={husbandries.id} className='schedule-item'>
                        <h2> Length: {husbandries.length}</h2>
                        <h2> Weight: {husbandries.weight}</h2>
                        <h2> Temperature: {husbandries.temperature}</h2>
                        <h2> Humidity: {husbandries.humidity}</h2>
                        <br />
                    </div>
                )) }
            </div>

            <h1>This is a list of all of the schedules for this reptile.</h1>
            <div className='schedule-container'>
                { schedules.map((schedule: Schedule) => (
                    <div key={schedule.id} className='schedule-item'>
                        <h2> Activity type: {schedule.type}</h2>
                        <h2> Description: {schedule.description} </h2>
                        <h2> Monday: {(schedule.monday).toString()} </h2>
                        <h2> Tuesday: {(schedule.tuesday).toString()} </h2>
                        <h2> Wednesday: {(schedule.wednesday).toString()} </h2>
                        <h2> Thursday: {(schedule.thursday).toString()} </h2>
                        <h2> Friday: {(schedule.friday).toString()} </h2>
                        <h2> Saturday: {(schedule.saturday).toString()} </h2>
                        <h2> Sunday: {(schedule.sunday).toString()} </h2>
                        <br />
                    </div>
                )) }
            </div>

            <div>
                <h1>You can update reptile {useParams().id} below:</h1>
                <div className='update-reptile-form'>
                    <h4>Name</h4>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={useParams().name} />
                    <h4>Species</h4>
                    <input type="text" value={species} onChange={e => setSpecies(e.target.value)} placeholder="Reptiles species here"/>
                    <h4>Sex</h4>
                    <input type="text" value={sex} onChange={e => setSex(e.target.value)} placeholder="Reptiles sex here"/>
                    <br />
                    <button onClick={updateReptile}>Update Reptile</button>
                </div> 
            </div>


            <div>
                <h1>You can create a feeding for reptile {useParams().id} below:</h1>
                <div>
                    <input type="text" value={foodItem} onChange={e => setFoodItem(e.target.value)} placeholder='Type feeding here'/>
                    <br />
                    <button onClick={createFeeding}>Create a feeding</button>
                </div>
            </div>


            <div>
                <h1>You can create a husbandry record for reptile {useParams().id} below:</h1>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    createHusbandryRecord() 
                }}>
                    <input type="text" value={length} onChange={e => setLength(e.target.value)} placeholder='Type length here'/>
                    <br />
                    <input type="text" value={weight} onChange={e => setWeight(e.target.value)} placeholder='Type weight here'/>
                    <br />
                    <input type="text" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder='Type temperature here'/>
                    <br />
                    <input type="text" value={humidity} onChange={e => setHumidity(e.target.value)} placeholder='Type humidity here'/>
                    <br />
                    <button type='submit' >Create a husbandry record</button>
                </form>
            </div>

            <div>
                <h1>You can create a schedule for reptile {useParams().id} below:</h1>
                <form>
                    <input type="text" value={type} onChange={e => setType(e.target.value)} placeholder='Type type here'/>
                    <br />
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder='Type description here'/>
                    <br />Monday
                    <input type="checkbox" checked={monday} onChange={e => setMonday(e.target.checked)}/>
                    <br />Tuesday
                    <input type="checkbox" checked={tuesday} onChange={e => setTuesday(e.target.checked)}/>
                    <br />Wednesday
                    <input type="checkbox" checked={wednesday} onChange={e => setWednesday(e.target.checked)}/>
                    <br />Thursday
                    <input type="checkbox" checked={thursday} onChange={e => setThursday(e.target.checked)}/>
                    <br />Friday
                    <input type="checkbox" checked={friday} onChange={e => setFriday(e.target.checked)}/>
                    <br />Saturday
                    <input type="checkbox" checked={saturday} onChange={e => setSaturday(e.target.checked)}/>
                    <br />Sunday
                    <input type="checkbox" checked={sunday} onChange={e => setSunday(e.target.checked)}/>
                    <br />
                    <button onClick={createSchedule}>Create a schedule</button>
                </form>
            </div>
    </div>
    );
}