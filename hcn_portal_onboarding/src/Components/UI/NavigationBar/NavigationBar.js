import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../store/reducers/authReducer'; // update path if needed
import hcn_logo from '../../../Images/heartland_CN_logo.png';
import './NavigationBar.css';

const NavigationBar = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div>
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img src={hcn_logo} alt="Hoosier Community Network" className="logo" />
          </Link>
        </div>
        <nav>
          <ul className="nav-links">
            <li><a href="#support">Support</a></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/mission">Mission</Link></li>
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
