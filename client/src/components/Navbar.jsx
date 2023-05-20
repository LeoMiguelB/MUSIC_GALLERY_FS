import "./Navbar.css";

import { useState } from "react";

import { Link } from "react-router-dom";

const Navbar = () => {
    const [isActive, setIsActive] = useState(false);

    //for the responsive design
    const handleOnClick = () => {
        setIsActive(!isActive);
    }

    return (
        <div className="sticky">
            <div className="navbar">
                <div className="brand-title"><Link to="/">MIGUEL</Link></div>
                <Link to="#" className={`toggle-button ${isActive ? 'active' : ''}`} onClick={handleOnClick}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </Link>
                <div className="navbar-links">
                    <ul>
                        <li><Link to="/">Music Library</Link></li>
                        <li><Link to="/upload-audio">Upload Audio</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar;