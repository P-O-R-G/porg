import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
    return (
        <div className="app-header">
            <nav>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    <li>
                        <Link to="/">
                            <i class="bi-house-fill pad-icon" style={{color:"cornflowerblue"}}></i>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about">
                            <i class="bi-info-circle-fill pad-icon" style={{color:"cornflowerblue"}}></i>
                            About
                        </Link>
                    </li>
                </ul>
            </nav>
            <h1 className="app-title">PORG - Processing Of Real-time Gestures</h1>
        </div>
    );
};

export default Header;