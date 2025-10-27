import React from 'react';
import { Link } from 'react-router-dom';
import NavigationBar from '../UI/NavigationBar/NavigationBar';
import Footer from '../UI/Footer/Footer';
import './Services.css';

// Import service icons from Images folder
import EconomicServiceIcon from '../../Images/EconomicService.png';
import WorkshopServiceIcon from '../../Images/WorkshopService.png';
import WebDevServiceIcon from '../../Images/WebDevService.png';
import UIUXServiceIcon from '../../Images/UIUXService.png';
import SEOServiceIcon from '../../Images/SEOService.png';
import DatabaseServiceIcon from '../../Images/DatabaseService.png';
import FinancialModellingServiceIcon from '../../Images/FinancialModellingService.png';
import CybersecurityServiceIcon from '../../Images/CybersecurityService.png';

// Service icons object for easy reference
const serviceIcons = {
  economic: EconomicServiceIcon,
  techWorkshops: WorkshopServiceIcon,
  webDev: WebDevServiceIcon,
  uiUx: UIUXServiceIcon,
  seo: SEOServiceIcon,
  database: DatabaseServiceIcon,
  financial: FinancialModellingServiceIcon,
  cybersecurity: CybersecurityServiceIcon
};

/**
 * Services Component
 * Displays the Heartland Community Network services page with:
 * - Header with navigation
 * - Services grid showcasing 8 main service offerings
 * - Footer with company information and map
 */
const Services = () => {
  // Service data array containing all service information with actual images
  const services = [
    {
      id: 1,
      title: "Economic Development",
      description: "HCN can help you with AI Solutions like an in-depth analysis of data for insights, chatbots for your website, etc.",
      icon: serviceIcons.economic, // Economic development icon
      link: "#economic-development"
    },
    {
      id: 2,
      title: "Tech Workshops & Training",
      description: "Connect with us to engage in Tech Workshops and know what aligns with you and you business.",
      icon: serviceIcons.techWorkshops, // Tech workshops icon
      link: "#tech-workshops"
    },
    {
      id: 3,
      title: "Web & App Design/ Development",
      description: "See how a website or mobile app can help your business for your growth and increased engagement.",
      icon: serviceIcons.webDev, // Web development icon
      link: "#web-development"
    },
    {
      id: 4,
      title: "UI/UX & Digital Design",
      description: "Connect with us for a redesign of your website or get digital designs to help you grow.",
      icon: serviceIcons.uiUx, // UI/UX design icon
      link: "#ui-ux-design"
    },
    {
      id: 5,
      title: "SEO & SEM",
      description: "HCN can help you reach your target audience with improvement of SEO & SEM of your site.",
      icon: serviceIcons.seo, // SEO icon
      link: "#seo-sem"
    },
    {
      id: 6,
      title: "Database Management",
      description: "Connect with us to manage your data inventory digitally or online.",
      icon: serviceIcons.database, // Database management icon
      link: "#database-management"
    },
    {
      id: 7,
      title: "Financial Modelling",
      description: "Grant-Writing, Funding Opportunities",
      icon: serviceIcons.financial, // Financial modelling icon
      link: "#financial-modelling"
    },
    {
      id: 8,
      title: "Cybersecurity",
      description: "Cybersecurity Solutions",
      icon: serviceIcons.cybersecurity, // Cybersecurity icon
      link: "#cybersecurity"
    }
  ];

  return (
    <div className="services-page">
      {/* Header Section with Navigation */}
      <NavigationBar isLoggedIn={false} />
      
      {/* Main Content Section */}
      <main className="services-main">
        {/* Services Title */}
        <div className="services-header">
          <h1 className="services-title">Our Services</h1>
        </div>
        
        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              {/* Service Icon */}
              <div className="service-icon">
                <img 
                  src={service.icon} 
                  alt={`${service.title} icon`} 
                  className="service-icon-img"
                />
              </div>
              
              {/* Service Content */}
              <div className="service-content">
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <a href={service.link} className="explore-link">Explore</a>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Services;
