import "./Navbar.css";

import { useState } from "react";

import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";

import { logoutUser } from "../features/user/userSlice";

import { useSelector } from "react-redux";


import { useLogoutUserMutation } from "../features/api/authSlice";

const Navbar = () => {
    const [isActive, setIsActive] = useState(false);

    const username = useSelector(state => state.user.username);

    const dispatch = useDispatch();

    const [logout, { isLoading }] = useLogoutUserMutation();

    //for the responsive design
    const handleOnClick = () => {
        console.log('updating active');
        setIsActive(!isActive);
    }

    const handleLogout = async () => {
        try {
            const res = await logout({ username }).unwrap();

        } catch (error) {
            if (error.data.status === 404) {
                console.log(error)
            }
        }
        dispatch(logoutUser());
    }

    return (
        <div className="sticky">
            <div className="navbar">
                <div className="brand-title"><Link to="/">{username}</Link></div>
                <Link to="#" className={`toggle-button`} onClick={handleOnClick}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </Link>
                <div className={`navbar-links ${isActive ? 'active' : ''}`}>
                    <ul>
                        <li><Link to="/">Music Library</Link></li>
                        <li><Link to="/upload-audio">Upload Audio</Link></li>
                        <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar;