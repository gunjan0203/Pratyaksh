// frontend/src/pages/HomePage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  MapPin, 
  BarChart3, 
  Image, 
  Users,
  Globe,
  CloudRain,
  Wind,
  Activity
} from 'lucide-react';
import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: <Shield />,
      title: "Media Authenticity",
      description: "AI-powered verification of disaster-related media content",
      color: "#3b82f6",
      details: ["Deepfake detection technology", "Source verification system", "Timestamp validation", "Cross-platform analysis"]
    },
    {
      icon: <BarChart3 />,
      title: "Damage Estimator",
      description: "Analyze before/after images for precise damage assessment",
      color: "#10b981",
      details: ["AI-based damage scoring", "Cost estimation algorithms", "Structural integrity analysis", "Priority level assignment"]
    },
    {
      icon: <MapPin />,
      title: "Real-time Monitoring",
      description: "Track active disaster zones with live heatmaps",
      color: "#ef4444",
      details: ["Live satellite imagery", "Sensor network integration", "Weather pattern tracking", "Evacuation route planning"]
    },
    {
      icon: <Image />,
      title: "Visual Analysis",
      description: "Generate detailed heatmaps and damage reports",
      color: "#f59e0b",
      details: ["3D terrain mapping", "Damage overlay visualization", "Historical comparison tools", "Interactive reporting system"]
    },
    {
      icon: <Users />,
      title: "Resource Allocation",
      description: "Smart distribution of aid based on damage assessment",
      color: "#8b5cf6",
      details: ["Automated resource tracking", "Priority-based distribution", "Logistics optimization", "Team coordination tools"]
    },
    {
      icon: <Globe />,
      title: "Global Coverage",
      description: "Monitor disasters across India with detailed maps",
      color: "#06b6d4",
      details: ["Multi-region monitoring", "Local government integration", "Regional risk assessment", "Cultural context analysis"]
    }
  ];

  // UPDATED: Added descriptions for each disaster type
  const disasterTypes = [
    { 
      name: "Earthquakes", 
      icon: <Activity />, 
      color: "#ef4444",
      description: "Sudden tectonic shifts causing ground tremors. We provide real-time magnitude tracking and epicenter mapping."
    },
    { 
      name: "Floods", 
      icon: <CloudRain />, 
      color: "#3b82f6",
      description: "Overflow of water submerging land. Our sensors monitor precipitation levels and rising water boundaries 24/7."
    },
    { 
      name: "Wildfires", 
      icon: <Wind />, 
      color: "#f59e0b",
      description: "Rapidly spreading vegetation fires. We use thermal satellite data to predict fire paths and smoke distribution."
    },
    { 
      name: "Landslides", 
      icon: <MapPin />, 
      color: "#10b981",
      description: "Downslope movement of soil and rock. Our AI predicts slope stability based on rainfall and soil moisture data."
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="badge">
              <AlertTriangle size={16} />
              <span>Real-time Disaster Response System</span>
            </div>
            <h1>
              PRATYAKSH 
              <span className="gradient-text">  AI-Powered Disaster Management Platform</span>
            </h1>
            <p className="hero-description">
              Advanced platform for disaster monitoring, media verification, damage assessment, 
              and resource allocation. Making disaster response faster, smarter, and more effective.
            </p>
            <div className="hero-buttons">
              <motion.button
                className="primary-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
              >
                <Shield size={20} />
                Sign In
              </motion.button>
              <Link to="/signup" className="secondary-btn">
                Sign Up
              </Link>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="visual-card">
            <div className="map-preview">
              <div className="map-grid">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="grid-cell">
                    <div className="cell-content"></div>
                  </div>
                ))}
              </div>
              <div className="disaster-markers">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="marker"
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      backgroundColor: i <= 2 ? '#ef4444' : i <= 4 ? '#f59e0b' : '#10b981'
                    }}
                  >
                    <AlertTriangle size={12} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Disaster Types - UPDATED WITH FLIP CARDS */}
      <section className="disaster-types-section">
        <div className="section-headerr">
          <h2>Monitor Multiple Disaster Types</h2>
          <p>Track and analyze various natural disasters in real-time</p>
        </div>
        
        <div className="disaster-types-grid">
          {disasterTypes.map((disaster, index) => (
            <motion.div
              key={index}
              className="flip-card-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flip-card-inner">
                {/* Front Side: Icon and Name */}
                <div className="flip-card-front disaster-type-card" style={{ borderColor: disaster.color }}>
                  <div className="disaster-icon" style={{ backgroundColor: `${disaster.color}20`, color: disaster.color }}>
                    {disaster.icon}
                  </div>
                  <h3>{disaster.name}</h3>
                  <p className="disaster-hint">Hover for details →</p>
                </div>

                {/* Back Side: Description */}
                <div className="flip-card-back disaster-type-card" style={{ backgroundColor: disaster.color }}>
                  <div className="disaster-icon" style={{ backgroundColor: `${disaster.color}20`, color: "white" }}>
                    {disaster.icon}
                  </div>
                  <h3>{disaster.name}</h3>
                  <p className="disaster-description">{disaster.description}</p>
                  <div className="flip-back-hint">← Hover back</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-headerr">
          <h2>Comprehensive Disaster Management</h2>
          <p>Everything you need for effective disaster response and analysis</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="feature-content">
                <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <div className="feature-details" style={{ borderLeft: `4px solid ${feature.color}` }}>
                <div className="feature-icon" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h4>Advanced Features</h4>
                <ul>
                  {feature.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-overlay"></div>
        <div className="cta-content">
          <motion.div
            className="cta-text"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Ready to transform disaster response?</h2>
            <p>Join emergency responders and organizations using our platform</p>
            <div className="cta-buttons">
              <motion.button
                className="primary-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </motion.button>
              <button className="outline-btn" onClick={() => navigate('/login')}>
                Log In
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <Shield size={24} />
            <span>PRATYAKSH</span>
          </div>
          <div className="footer-links">
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-copyright">
            © 2024 PRATYAKSH. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;