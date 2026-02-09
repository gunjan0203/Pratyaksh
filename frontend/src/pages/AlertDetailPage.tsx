// frontend/src/pages/AlertDetailPage.tsx
import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle,
  Download,
  Share2,
  Phone,
  Navigation,
  Wind,
  Droplets,
  Thermometer,
  Building2,
  Ambulance
} from 'lucide-react';
import './AlertDetailPage.css';

// Define the Alert type to match what we're passing
interface Alert {
  id: number;
  title: string;
  location: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  time: string;
  description: string;
  affectedAreas: string[];
  casualties: number;
  responseTeams: number;
  status: 'active' | 'contained' | 'resolved';
  windSpeed?: string;
  rainfall?: string;
  evacuationCenters?: number;
  medicalTeams?: number;
  waterLevel?: string;
  forecast?: string;
}

const AlertDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the alert data from location state
  const alert = location.state?.alert as Alert;

  // If no alert data was passed, use default data based on ID
  const defaultAlerts: Record<number, Alert> = {
    1: { 
      id: 1, 
      title: 'Coastal Flood Emergency', 
      location: 'Coastal Region A', 
      type: 'Flood', 
      severity: 'high', 
      time: '2 minutes ago',
      description: 'Heavy rainfall causing flash floods in coastal areas. Water levels rising rapidly. Evacuation orders issued for low-lying areas.',
      affectedAreas: ['Region A-1', 'Region A-2', 'Region A-3'],
      casualties: 12,
      responseTeams: 5,
      status: 'active',
      windSpeed: '45 km/h',
      rainfall: '250 mm',
      evacuationCenters: 3,
      medicalTeams: 8,
      waterLevel: '3.2m',
      forecast: 'More heavy rainfall expected in next 24 hours'
    },
    2: { 
      id: 2, 
      title: 'Urban Fire Outbreak', 
      location: 'Urban Zone B', 
      type: 'Fire', 
      severity: 'medium', 
      time: '15 minutes ago',
      description: 'Factory fire spreading to nearby residential buildings. Firefighters battling blaze in industrial zone.',
      affectedAreas: ['Industrial Zone', 'Residential Block 4'],
      casualties: 3,
      responseTeams: 8,
      status: 'active',
      windSpeed: '25 km/h',
      evacuationCenters: 2,
      medicalTeams: 5,
      forecast: 'Wind direction changing, may spread if not contained'
    },
    3: { 
      id: 3, 
      title: 'Mountain Landslide', 
      location: 'Mountain Region C', 
      type: 'Landslide', 
      severity: 'critical', 
      time: '1 hour ago',
      description: 'Massive landslide blocking main highway and affecting several villages. Rescue operations underway.',
      affectedAreas: ['Highway 77', 'Village C-1', 'Village C-2'],
      casualties: 24,
      responseTeams: 12,
      status: 'active',
      rainfall: '400 mm',
      evacuationCenters: 4,
      medicalTeams: 15,
      forecast: 'Risk of further landslides due to saturated soil'
    },
    4: { 
      id: 4, 
      title: 'Earthquake Aftershocks', 
      location: 'Northern Plains', 
      type: 'Earthquake', 
      severity: 'high', 
      time: '2 hours ago',
      description: 'Multiple aftershocks following 6.8 magnitude earthquake. Buildings damaged, infrastructure affected.',
      affectedAreas: ['Plain District', 'Northern Valley'],
      casualties: 45,
      responseTeams: 15,
      status: 'active',
      evacuationCenters: 8,
      medicalTeams: 25,
      forecast: 'Continued aftershocks expected for next 48 hours'
    },
    5: { 
      id: 5, 
      title: 'Tsunami Warning', 
      location: 'Southern Coast', 
      type: 'Tsunami', 
      severity: 'critical', 
      time: '3 hours ago',
      description: 'Tsunami warning issued after undersea earthquake. Coastal areas being evacuated.',
      affectedAreas: ['Coastal Cities', 'Island Territories'],
      casualties: 0,
      responseTeams: 20,
      status: 'active',
      windSpeed: '60 km/h',
      waterLevel: 'Estimated 5-8m wave',
      evacuationCenters: 10,
      medicalTeams: 30,
      forecast: 'First wave expected within 2 hours'
    },
    6: { 
      id: 6, 
      title: 'Forest Wildfire', 
      location: 'Eastern Forest', 
      type: 'Wildfire', 
      severity: 'medium', 
      time: '4 hours ago',
      description: 'Wildfire spreading rapidly due to strong winds. National park and forest reserve threatened.',
      affectedAreas: ['National Park', 'Forest Reserve'],
      casualties: 2,
      responseTeams: 6,
      status: 'contained',
      windSpeed: '35 km/h',
      evacuationCenters: 2,
      medicalTeams: 4,
      forecast: 'Wind expected to calm in next 6 hours'
    },
    7: { 
      id: 7, 
      title: 'Avalanche Danger', 
      location: 'Western Valley', 
      type: 'Avalanche', 
      severity: 'high', 
      time: '5 hours ago',
      description: 'Avalanche warning for ski resorts and mountain passes. Multiple tourists trapped.',
      affectedAreas: ['Ski Resort', 'Mountain Pass 42'],
      casualties: 8,
      responseTeams: 10,
      status: 'active',
      evacuationCenters: 3,
      medicalTeams: 12,
      forecast: 'Heavy snowfall expected, increasing avalanche risk'
    },
    8: { 
      id: 8, 
      title: 'Tropical Storm Alert', 
      location: 'Southeast Islands', 
      type: 'Storm', 
      severity: 'medium', 
      time: '6 hours ago',
      description: 'Tropical storm approaching with heavy rainfall and strong winds. Flooding expected.',
      affectedAreas: ['Island Chain', 'Coastal Towns'],
      casualties: 0,
      responseTeams: 7,
      status: 'active',
      windSpeed: '85 km/h',
      rainfall: 'Expected 300mm',
      evacuationCenters: 6,
      medicalTeams: 10,
      forecast: 'Storm intensifying, landfall in 12 hours'
    }
  };

  // Use the alert from state, or fallback to default based on ID
  const alertData = alert || defaultAlerts[parseInt(id || '1')];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#ef4444';
      case 'contained': return '#f59e0b';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleShare = () => {
    if (navigator.share && alertData) {
      navigator.share({
        title: alertData.title,
        text: alertData.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleEmergencyCall = () => {
    window.open('tel:911');
  };

  const handleViewMap = () => {
    // For demonstration, use the alert location in Google Maps search
    const searchQuery = encodeURIComponent(alertData.location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${searchQuery}`, '_blank');
  };

  if (!alertData) {
    return (
      <div className="alert-detail-page">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          Back to Alerts
        </button>
        <div className="not-found">
          <AlertTriangle size={64} />
          <h2>Alert Not Found</h2>
          <p>The requested alert could not be found.</p>
          <button 
            className="primary-btn"
            onClick={() => navigate('/alerts')}
          >
            View All Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="alert-detail-page">
      {/* Header */}
      <div className="detail-header">
        <button 
          className="back-btn"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          Back to Alerts
        </button>
        
        <div className="header-actions">
          <button className="action-btn" onClick={handleShare}>
            <Share2 size={18} />
            Share
          </button>
          <button className="action-btn">
            <Download size={18} />
            Report
          </button>
        </div>
      </div>

      {/* Alert Header */}
      <div className="alert-header-card">
        <div className="alert-title-section">
          <div 
            className="severity-badge"
            style={{ backgroundColor: getSeverityColor(alertData.severity) }}
          >
            <AlertTriangle size={20} />
            <span>{alertData.severity.toUpperCase()}</span>
          </div>
          <h1>{alertData.title}</h1>
          <div className="alert-meta">
            <span className="meta-item">
              <MapPin size={16} />
              {alertData.location}
            </span>
            <span className="meta-item">
              <Clock size={16} />
              {alertData.time}
            </span>
            <span className="type-badge">{alertData.type}</span>
            <span 
              className="status-badge"
              style={{ 
                backgroundColor: getStatusColor(alertData.status) + '20',
                color: getStatusColor(alertData.status)
              }}
            >
              {alertData.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-content">
        {/* Left Column */}
        <div className="detail-column">
          <div className="info-card">
            <h3>Alert Details</h3>
            <p className="description">{alertData.description}</p>
            
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Alert ID</span>
                <span className="detail-value">#{alertData.id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span 
                  className="detail-value status"
                  style={{ color: getStatusColor(alertData.status) }}
                >
                  {alertData.status.toUpperCase()}
                </span>
              </div>
              
              {alertData.waterLevel && (
                <div className="detail-item">
                  <span className="detail-label">
                    <Droplets size={14} />
                    Water Level
                  </span>
                  <span className="detail-value">{alertData.waterLevel}</span>
                </div>
              )}
              
              {alertData.windSpeed && (
                <div className="detail-item">
                  <span className="detail-label">
                    <Wind size={14} />
                    Wind Speed
                  </span>
                  <span className="detail-value">{alertData.windSpeed}</span>
                </div>
              )}
              
              {alertData.rainfall && (
                <div className="detail-item">
                  <span className="detail-label">
                    <Thermometer size={14} />
                    Rainfall
                  </span>
                  <span className="detail-value">{alertData.rainfall}</span>
                </div>
              )}
            </div>
          </div>

          <div className="info-card">
            <h3>Affected Areas</h3>
            <div className="areas-list">
              {alertData.affectedAreas.map((area, index) => (
                <div key={index} className="area-item">
                  <MapPin size={16} />
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="detail-column">
          <div className="stats-card">
            <h3>Response Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <Users className="stat-icon" />
                <div>
                  <span className="stat-value">{alertData.casualties}</span>
                  <span className="stat-label">Casualties</span>
                </div>
              </div>
              <div className="stat-item">
                <Users className="stat-icon" />
                <div>
                  <span className="stat-value">{alertData.responseTeams}</span>
                  <span className="stat-label">Response Teams</span>
                </div>
              </div>
              {alertData.medicalTeams && (
                <div className="stat-item">
                  <Ambulance className="stat-icon" />
                  <div>
                    <span className="stat-value">{alertData.medicalTeams}</span>
                    <span className="stat-label">Medical Teams</span>
                  </div>
                </div>
              )}
              {alertData.evacuationCenters && (
                <div className="stat-item">
                  <Building2 className="stat-icon" />
                  <div>
                    <span className="stat-value">{alertData.evacuationCenters}</span>
                    <span className="stat-label">Evacuation Centers</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {alertData.forecast && (
            <div className="info-card">
              <h3>Weather Forecast</h3>
              <p className="forecast">{alertData.forecast}</p>
            </div>
          )}

          <div className="action-card">
            <h3>Emergency Actions</h3>
            <div className="action-buttons">
              <button className="emergency-btn" onClick={handleEmergencyCall}>
                <Phone size={18} />
                Call Emergency
              </button>
              <button className="emergency-btn" onClick={handleViewMap}>
                <Navigation size={18} />
                View on Map
              </button>
              <button 
                className="emergency-btn"
                onClick={() => navigate('/help')}
              >
                <Users size={18} />
                Request Assistance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Coordinates */}
      <div className="coordinates-info">
        <span className="coordinate-label">Alert Reference:</span>
        <span className="coordinate-value">
          ID #{alertData.id} • {alertData.type} • {alertData.location}
        </span>
      </div>
    </div>
  );
};

export default AlertDetailPage;