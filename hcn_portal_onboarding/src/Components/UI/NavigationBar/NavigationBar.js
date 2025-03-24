import React from 'react';
// import { Link } from 'react-router-dom';
import hcn_logo from '../../../Images/hcn_logo.png'
import './NavigationBar.css'

const NavigationBar = () =>{




    return(
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
            {/* <li><Link to="/Login" className="login-btn">Login</Link></li> */}
            {/* <li><Link to="/Signup" className="sign-up-btn">Sign Up</Link></li> */}
          </ul>
        </nav>
      </header>
        </div>
    );
};

export default NavigationBar;
