// frontend/src/components/Navbar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, User, Settings, LogOut } from 'lucide-react';
import './Navbar.css';
import logo from "../assets/logo.png";
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleAlertsClick = () => {
    navigate('/alerts');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    // Implement your actual logout logic here
    console.log('Logging out...');
    
    // Example logout logic (adjust based on your authentication setup):
    // Remove authentication tokens
    // localStorage.removeItem('authToken');
    // sessionStorage.removeItem('authToken');
    // Clear user data
    // localStorage.removeItem('userData');
    
    // Navigate to homepage after logout
    navigate('/');
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-left">
        <motion.button
          className="menu-btn"
          onClick={onMenuClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Menu />
        </motion.button>
        
        <div className="nav-center">
          {/* Clickable logo */}
          <div 
            className="logo"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogoClick();
              }
            }}
          >
            <img src={logo} alt="Drone icon" className="drone-icon" />
            <span className="logo-text">PRATYAKSH</span>
          </div>
        </div>
      </div>

      <div className="nav-right">
        <motion.button 
          className="nav-btn alert-btn"
          onClick={handleAlertsClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bell />
          {/* <span className="badge">3</span> */}
        </motion.button>
        
        <div className="user-dropdown-container" ref={dropdownRef}>
          <motion.button 
            className="nav-btn user-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <User />
          </motion.button>
          
          {dropdownOpen && (
            <motion.div 
              className="user-dropdown"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button 
                className="dropdown-item"
                onClick={handleSettingsClick}
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>
              
              <div className="dropdown-divider"></div>
              
              <button 
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </div>
        
        <motion.div 
          className="status-indicator"
          animate={{ 
            backgroundColor: ['#10b981', '#10b981', '#10b981', '#f59e0b', '#10b981'],
            scale: [1, 1.2, 1, 1, 1]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity 
          }}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;