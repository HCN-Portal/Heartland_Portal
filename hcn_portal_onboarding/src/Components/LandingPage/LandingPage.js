import React from 'react';
import './LandingPage.css'; 
import { Link } from 'react-router-dom';
import hcn_landing from '../../Images/hcn_landing.png';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
// import hcn_logo from '../../Images/hcn_logo.png'
// import Signup from './signup';


const LandingPage = () => {
  return (
    <div className="landing-page">
    {/* //   <header className="header">
    //     <div className="logo">
    //     <img src={hcn_logo} alt="Hoosier Community Network" className="logo" />
    //     </div>
    //     <nav>
    //       <ul className="nav-links">
    //         <li><a href="#support">Support</a></li>
    //         <li><a href="#mission">Mission</a></li>
    //         <li><a href="#services">Services</a></li>
    //         <li><Link to="/Login" className="login-btn">Login</Link></li>
    //         <li><Link to="/Signup" className="sign-up-btn">Sign Up</Link></li>
    //       </ul>
    //     </nav>
    //   </header> */}

      <NavigationBar /> 
      <section className="hero-section">
        <div className="hero-text">
          <h2>Let’s build something that our client’s love</h2>
          <p>
            At Hoosier Community Network, we’re more than just a team; we're a community dedicated to making a difference.
            Together, we support local businesses by providing the tools and resources they need to thrive in an ever-evolving
            marketplace.
          </p>
          <h2>Empower. Innovate. Impact.</h2>
          <p>
            Our mission is to empower local businesses through comprehensive support in website development, marketing,
            financing, cybersecurity, and innovative AI solutions. Your role is pivotal in turning these visions into reality.
          </p>
          <Link to="/apply">
          <button className="join-button">Join Us Today</button>
          </Link>
          
        </div>
        <div className="hero-image">
          <img src={hcn_landing} alt="Community Illustration" />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
