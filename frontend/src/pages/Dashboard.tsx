import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  AlertTriangle,
  MapPin,
  HelpCircleIcon,
  Shield,
  Image,
  ChevronRight,
  BarChart3,
} from 'lucide-react';

import AlertFeed from '../components/AlertFeed';
import WorldMapVisualization from '../components/WorldMapVisualization';
import { fadeInUp, staggerContainer } from '../animations';
import './Dashboard.css';

interface DashboardProps {
  query: string;
}

/* ---------- BACKEND ALERT SHAPE ---------- */
interface BackendAlert {
  title: string;
  location: string;
  date: string;
  category: string;
  source: string;
}

/* ---------- ALERTFEED EXPECTED SHAPE ---------- */
interface UIAlert {
  id: number;
  title: string;
  location: string;
  type: string;
  severity: 'high' | 'critical' | 'medium' | 'low';
  time: string;
}

/* ---------- MAP DATA ---------- */
interface DisasterZone {
  id: number;
  name: string;
  type: string;
  lat: number;
  lng: number;
  severity: 'high' | 'critical' | 'medium' | 'low';
}

const ALERT_LIMIT = 20;

const Dashboard: React.FC<DashboardProps> = ({ query }) => {
  const navigate = useNavigate();

  /* ---------- STATE ---------- */
  const [alerts, setAlerts] = useState<BackendAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const [disasterZones] = useState<DisasterZone[]>([
    {
      id: 1,
      name: 'Uttarakhand Landslides',
      type: 'Landslide',
      lat: 30.0668,
      lng: 79.0193,
      severity: 'high',
    },
    {
      id: 2,
      name: 'Assam Floods',
      type: 'Flood',
      lat: 26.2006,
      lng: 92.9376,
      severity: 'critical',
    },
  ]);

  /* ---------- FETCH ALERTS ---------- */
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch(
          'http://localhost:8000/alerts/india-all-disasters'
        );
        const data = await res.json();
        setAlerts(data.incidents || []);
      } catch (err) {
        console.error('Alert fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  /* ---------- SEARCH FILTER ---------- */
  const filteredAlerts = alerts.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.location.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  /* ---------- BACKEND → UI ADAPTER ---------- */
  const mappedAlerts: UIAlert[] = filteredAlerts.map((alert, index) => {
    let severity: UIAlert['severity'] = 'medium';

    const c = alert.category.toLowerCase();
    if (c.includes('earthquake')) severity = 'high';
    else if (c.includes('flood') || c.includes('cyclone')) severity = 'critical';
    else if (c.includes('landslide')) severity = 'high';

    return {
      id: index,
      title: alert.title,
      location: alert.location,
      type: alert.category,
      severity,
      time: alert.date,
    };
  });

  /* ---------- LIMIT FOR DASHBOARD ---------- */
  const limitedAlerts = mappedAlerts.slice(0, ALERT_LIMIT);
  const hasMoreAlerts = mappedAlerts.length > ALERT_LIMIT;

  /* ---------- QUICK ACTIONS ---------- */
  const quickActions = [
    { icon: <Image />, label: 'Media Authenticity', color: '#3b82f6', path: '/media-analyzer' },
    { icon: <BarChart3 />, label: 'Damage Estimator', color: '#10b981', path: '/damage-estimator' },
    { icon: <Shield />, label: 'Damage To Needs', color: '#f59e0b', path: '/damage-needs' },
    { icon: <HelpCircleIcon />, label: 'Help', color: '#ef4444', path: '/help' },
  ];

  return (
    <motion.div
      className="dashboard"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div variants={fadeInUp} className="dashboard-header">
        <h1 className="dashboard-title">Dashboard Overview</h1>
        <p className="dashboard-subtitle">
          Real-time disaster monitoring & response
        </p>
      </motion.div>

      {/* ---------- QUICK ACTIONS ---------- */}
      <motion.div variants={fadeInUp} className="quick-actions bottom-section">
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              className="quick-action-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(action.path)}
              style={{ '--action-color': action.color } as React.CSSProperties}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="dashboard-row">
                {/* ---------- RECENT ALERTS ---------- */}
      <motion.div variants={fadeInUp} className="alerts-section">
       <div className="section-hheader section-header-with-action">
          <div className="section-title">
            <AlertTriangle className="section-icon" />
            <h2>Recent Alerts</h2>
          </div>

          <Link to="/alerts" className="view-all-btn-link">
            <motion.div
              className="view-all-btn"
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              View All
              <ChevronRight size={16} />
            </motion.div>
          </Link>
        </div>


          <div className="alerts-scroll-container">
            {loading && <p className="loading-text">Fetching live alerts…</p>}

            {!loading && limitedAlerts.length === 0 && (
              <p className="loading-text">No active alerts found</p>
            )}

            {!loading && limitedAlerts.length > 0 && (
              <>
                <AlertFeed alerts={limitedAlerts} />
              </>
            )}
          </div>
        </motion.div>

        {/* ---------- MAP ---------- */}
        <motion.div variants={fadeInUp} className="map-section">
          <div className="section-hheader">
            <MapPin className="section-icon" />
            <h2>Active Disaster Zones</h2>
          </div>

          <WorldMapVisualization disasterZones={disasterZones} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
