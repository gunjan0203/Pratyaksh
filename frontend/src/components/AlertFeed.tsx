// frontend/src/components/AlertFeed.tsx - Alternative with Link
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  MapPin, 
  ChevronRight,
} from 'lucide-react';
import './AlertFeed.css';

interface Alert {
  id: number;
  title: string; 
  location: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  time: String;
}

interface AlertFeedProps {
  alerts: Alert[];
}

const AlertFeed: React.FC<AlertFeedProps> = ({ alerts }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🔥';
      case 'high': return '⚠️';
      case 'medium': return '🔶';
      case 'low': return 'ℹ️';
      default: return '📌';
    }
  };

  return (
    <div className="alert-feed">
      {/* <div className="feed-header"> */}
        {/* <div className="header-left">
          <Bell className="header-icon" />
          <h3>Live Alert Feed</h3>
        </div> */}
        {/* <Link to="/alerts" className="view-all-btn-link">
          <motion.div 
            className="view-all-btn"
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            View All
            <ChevronRight />
          </motion.div>
        </Link> */}
      {/* </div> */}
      
      <div className="alerts-container">
        {alerts.map((alert, index) => (
          <Link to={`/alerts/${alert.id}`} key={alert.id} className="alert-item-link">
            <motion.div
              className="alert-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            >
              <div className="alert-severity" style={{ backgroundColor: getSeverityColor(alert.severity) }}>
                <span className="severity-icon">{getSeverityIcon(alert.severity)}</span>
              </div>
              
              <div className="alert-content">
                <div className="alert-header">
                  <h4 className="alert-title">{alert.type}</h4>
                  <span 
                    className="alert-severity-badge"
                    style={{ color: getSeverityColor(alert.severity) }}
                  >
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                
                <div className="alert-details">
                  <div className="detail-item">
                  
                    <span>  <MapPin className="detail-icon" /> {alert.location}</span>
                  </div>
                  <div className="detail-item">
                    
                    <span><Clock className="detail-icon" />{alert.time}</span>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="alert-action"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight />
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </div>
      
      {/* <div className="feed-footer">
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span>LIVE UPDATES</span>
        </div> */}
        <div className="update-time">
          Updated just now
        </div>
      </div>
    // </div>
  );
};

export default AlertFeed;