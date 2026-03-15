import React from 'react';
import hcn_logo from '../../../Images/heartland_CN_logo.png';
import './Footer.css';

/**
 * Footer Component
 * Reusable footer component that displays:
 * - Company logo and information
 * - Social media links
 * - Information and services navigation
 * - Location map embed
 */
const Footer = () => {
  return (
    <footer className="services-footer">
      <div className="footer-content">
        {/* Left Section - Logo and Social Media */}
        <div className="footer-left">
          <div className="footer-logo">
            <img src={hcn_logo} alt="Heartland Community Network" />
            <div className="company-name">
              <div className="company-main">HEARTLAND</div>
              <div className="company-sub">COMMUNITY NETWORK</div>
            </div>
          </div>
          <div className="social-media">
            <a href="#" className="social-link linkedin">in</a>
            <a href="#" className="social-link facebook">f</a>
          </div>
        </div>
        
        {/* Middle Section - Information Links */}
        <div className="footer-middle">
          <div className="footer-section">
            <h4>Information</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#website-design">Website Design & Development</a></li>
              <li><a href="#tech-training">Tech Training and Workshops</a></li>
              <li><a href="#economic-development">Economic Development- AI Solutions</a></li>
            </ul>
          </div>
        </div>
        
        {/* Right Section - Map */}
        <div className="footer-right">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12359.557118066803!2d-86.603661!3d39.245385!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x886c5f42fb261449%3A0x4dae7d6d6f5cd86c!2sHeartland%20Community%20Network!5e0!3m2!1sen!2sus!4v1759092676511!5m2!1sen!2sus"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Heartland Community Network Location Map"
            ></iframe>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;