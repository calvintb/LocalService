import { Link, useNavigate } from "react-router-dom"
import '../index.css'

export const Navbar = () => {
    const navigate = useNavigate()

    const logOut = () => {
        window.localStorage.removeItem("token");
        navigate("/", {
            replace: true
        })
    }

    return (
        <div className="navbar">
            <button onClick={() => {navigate("/dashboard", {replace: true})}}> HOME </button>
            <button onClick={logOut}> LOGOUT </button>
        </div>
    )
}