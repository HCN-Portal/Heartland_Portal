import React from 'react';
import './Mission.css';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import Footer from '../UI/Footer/Footer';

const Mission = () => {
  return (
    <div className="mission-page">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="mission-hero">
        <div className="mission-hero-content">
          <h1>About HCN</h1>
          <div className='mission-content-grid'>
          <p className="mission-subtitle">
            Heartland Community Network helps small businesses grow through digital tools, training, 
            and community support.
          </p>
          </div>
          <button className="get-involved-btn">
            Get Involved →
          </button>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="mission-statement">
        <div className="container">
          <p className="mission-text">
            Our mission is to provide accessible, high-quality digital services 
            and training so every entrepreneur, creator, and business has the 
            tools they need to thrive in today's technology-driven world.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="core-values">
        <div className="container">
          <h2>Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Empowerment</h3>
              <p>Equipping you to own and accelerate your digital growth.</p>
            </div>
            <div className="value-card">
              <h3>Collaboration</h3>
              <p>Learning deeply and co-creating with businesses and communities.</p>
            </div>
            <div className="value-card">
              <h3>Integrity</h3>
              <p>Building trust through honesty, transparency, and accountability.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>Exploring new tools and methods to keep you ahead.</p>
            </div>
            <div className="value-card">
              <h3>Quality</h3>
              <p>Delivering professional, durable outcomes that last.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="collaboration-stats">
        <div className="container">
          <h2>Collabs and Partnerships</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">5+</div>
              <div className="stat-label">Grants</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">35+</div>
              <div className="stat-label">Business Onboard</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div className="stat-label">Workshops Conducted</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">200+</div>
              <div className="stat-label">Employees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Members of <span className="hcn-text">HCN</span></h2>
          <div className="team-grid">
            <div className="team-card">
              <h3>Leadership Team</h3>
              <p>
                Our leadership team is made up of experts with entrepreneurial backgrounds 
                and a passion for community growth and digital innovation.
              </p>
              <button className="team-card-btn">View</button>
            </div>
            <div className="team-card">
              <h3>Team Members</h3>
              <p>
                Our team includes skilled people in technology, business development, 
                marketing, and community engagement, all working together to support 
                local businesses.
              </p>
              <button className="team-card-btn">View</button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Mission;