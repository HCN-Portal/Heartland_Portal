import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hcn_logo from '../../../Images/hcn_logo.png';
import './NavigationBar.css';

const NavigationBar = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div>
      <header className="header">
        <div className="logo">
          <img src={hcn_logo} alt="Hoosier Community Network" className="logo" />
        </div>
        <nav>
          <ul className="nav-links">
            <li><a href="#support">Support</a></li>
            <li><a href="#mission">Mission</a></li>
            <li><a href="#services">Services</a></li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="nav-button">Logout</button>
              ) : (
                <Link to="/Login" className="nav-button">Login</Link>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default NavigationBar;
