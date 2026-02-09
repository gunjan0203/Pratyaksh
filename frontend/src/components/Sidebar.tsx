// frontend/src/components/Sidebar.tsx
import type { Variants } from 'framer-motion';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../assets/logo.png";
import {
  Home,
  Image,
  BarChart3,
  Shield,
  AlertTriangle,
  HelpCircle,
  Settings,
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: <Home />, label: 'Dashboard', path: '/dashboard', color: '#3b82f6' },
    { icon: <Image />, label: 'Media Authenticity', path: '/media-analyzer', color: '#10b981' },
    { icon: <BarChart3 />, label: 'Damage Estimator', path: '/damage-estimator', color: '#f59e0b' },
    { icon: <Shield />, label: 'Damage to Needs', path: '/damage-needs', color: '#8b5cf6' },
    { icon: <AlertTriangle />, label: 'Alerts', path: '/alerts', color: '#f97316' },
  ];

  const secondaryItems = [
    { icon: <HelpCircle />, label: 'Help & Docs', path: '/help' },
    { icon: <Settings />, label: 'Settings', path: '/settings' },
  ];

  const sidebarVariants: Variants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const overlayVariants: Variants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const handleLogout = () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to logout?');
    
    if (confirmed) {
      // Clear authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear any cached analysis data
      localStorage.removeItem('damageAnalysis');
      localStorage.removeItem('beforePreview');
      localStorage.removeItem('afterPreview');
      
      // Close sidebar
      onClose();
      
      // Show success message
      alert('Logged out successfully!');
      
      // Redirect to home page
      navigate('/');
      
      // Force reload to clear any state
      window.location.reload();
    }
  };

  const getUserInfo = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          name: user.name || 'Response Commander',
          role: user.role || 'Administrator',
          email: user.email || 'commander@disasterresponse.ai'
        };
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
    }
    
    return {
      name: 'Response Commander',
      role: 'Administrator',
      email: 'commander@disasterresponse.ai'
    };
  };

  const userInfo = getUserInfo();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="sidebar-overlay"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          <motion.aside
            className="sidebar"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <div className="logo-icon">
                  <img src={logo} alt="Drone icon" className="drone-icon" />
                </div>
                <div className="logo-textt">
                  <h2>PRATYAKSH</h2>
                  <p>Real Time Disaster
                    Monitoring and Control
                  </p>
                </div>
              </div>
              <motion.button
                className="close-btn"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X />
              </motion.button>
            </div>

            {/* User Profile */}
            <div className="user-profile">
              <motion.div
                className="avatar"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.name}`}
                  alt="Avatar"
                />
              </motion.div>
              <div className="user-info">
                <h3>{userInfo.name}</h3>
                <p className="user-role">{userInfo.role}</p>
                <p className="user-email">{userInfo.email}</p>
                <div className="user-status">
                  <span className="status-dot active"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>

            {/* Main Menu */}
            <nav className="sidebar-nav">
              <h3 className="nav-title">MAIN FEATURES</h3>
              <ul className="nav-menu">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      className="nav-link"
                      onClick={onClose}
                      style={{ '--item-color': item.color } as React.CSSProperties}
                    >
                      <span className="nav-icon" style={{ color: item.color }}>
                        {item.icon}
                      </span>
                      <span className="nav-label">{item.label}</span>
                      <ChevronRight className="nav-arrow" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Secondary Menu */}
            <nav className="sidebar-nav secondary">
              <h3 className="nav-title">SUPPORT</h3>
              <ul className="nav-menu">
                {secondaryItems.map((item, index) => (
                  <motion.li
                    key={index}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      className="nav-link"
                      onClick={onClose}
                    >
                      <span className="nav-icon">
                        {item.icon}
                      </span>
                      <span className="nav-label">{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* System Status
            <div className="system-status">
              <h3 className="status-title">System Status</h3>
              <div className="status-items">
                <div className="status-item">
                  <span className="status-label">AI Models</span>
                  <div className="status-indicator active"></div>
                </div>
                <div className="status-item">
                  <span className="status-label">Satellite</span>
                  <div className="status-indicator active"></div>
                </div>
                <div className="status-item">
                  <span className="status-label">Database</span>
                  <div className="status-indicator warning"></div>
                </div>
                <div className="status-item">
                  <span className="status-label">API</span>
                  <div className="status-indicator active"></div>
                </div>
              </div>
            </div> */}

            {/* Logout Button - UPDATED */}
            <motion.button
              className="logout-btn"
              onClick={handleLogout}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: 'rgba(239, 68, 68, 0.2)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut />
              <span>Logout</span>
            </motion.button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;