import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
    return (
        <div className="home-container">
            <h1 className="app-title">Nazwa Twojej Aplikacji</h1>
            <div className="buttons-wrapper">
                <Link to="/login" className="nav-button">Logowanie</Link>
                <Link to="/register" className="nav-button">Rejestracja</Link>
            </div>
        </div>
    );
}

export default HomePage;
