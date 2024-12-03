import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="app-header">
            <button className="align-right">
                <i className="bi bi-three-dots text-white" style={{ fontSize: '2rem'}}></i>
            </button>
            <h1 className="app-title">PORG - Processing Of Real-time Gestures</h1>
        </div>
    );
};

export default Header;