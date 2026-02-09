// frontend/src/components/MapVisualization.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Navigation,
  Layers,
  Filter
} from 'lucide-react';
import './MapVisualization.css';

interface DisasterZone {
  id: number;
  name: string;
  x: number;
  y: number;
  type: 'flood' | 'fire' | 'earthquake' | 'hurricane';
  severity: number;
  radius: number;
}

const MapVisualization: React.FC = () => {
  const [zones, setZones] = useState<DisasterZone[]>([
    { id: 1, name: 'Coastal Flood', x: 30, y: 40, type: 'flood', severity: 85, radius: 25 },
    { id: 2, name: 'Urban Fire', x: 60, y: 30, type: 'fire', severity: 70, radius: 20 },
    { id: 3, name: 'Mountain Quake', x: 40, y: 60, type: 'earthquake', severity: 90, radius: 30 },
    { id: 4, name: 'Forest Zone', x: 20, y: 20, type: 'fire', severity: 60, radius: 18 },
    { id: 5, name: 'River Flood', x: 70, y: 50, type: 'flood', severity: 75, radius: 22 },
  ]);

  const [selectedZone, setSelectedZone] = useState<DisasterZone | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showSatellite, setShowSatellite] = useState(false);

  const getZoneColor = (type: string, severity: number) => {
    const opacity = severity / 100;
    
    switch (type) {
      case 'flood':
        return `rgba(59, 130, 246, ${opacity})`;
      case 'fire':
        return `rgba(239, 68, 68, ${opacity})`;
      case 'earthquake':
        return `rgba(245, 158, 11, ${opacity})`;
      case 'hurricane':
        return `rgba(139, 92, 246, ${opacity})`;
      default:
        return `rgba(107, 114, 128, ${opacity})`;
    }
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'flood': return '🌊';
      case 'fire': return '🔥';
      case 'earthquake': return '🏔️';
      case 'hurricane': return '🌀';
      default: return '⚠️';
    }
  };

  const handleZoneClick = (zone: DisasterZone) => {
    setSelectedZone(zone);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h3>Disaster Zones Visualization</h3>
        <div className="map-controls">
          <motion.button 
            className={`map-btn ${showHeatmap ? 'active' : ''}`}
            onClick={() => setShowHeatmap(!showHeatmap)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Layers />
            Heatmap
          </motion.button>
          <motion.button 
            className={`map-btn ${showSatellite ? 'active' : ''}`}
            onClick={() => setShowSatellite(!showSatellite)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Navigation />
            Satellite
          </motion.button>
        </div>
      </div>

      <div className="map-wrapper">
        <div 
          className="map-area"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Grid Background */}
          <div className="map-grid">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`row-${i}`} className="grid-row" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={`col-${i}`} className="grid-col" />
            ))}
          </div>

          {/* Heatmap Overlay */}
          {showHeatmap && (
            <div className="heatmap-overlay">
              {zones.map(zone => (
                <div
                  key={zone.id}
                  className="heatmap-blob"
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.radius * 2}px`,
                    height: `${zone.radius * 2}px`,
                    background: `radial-gradient(circle, ${getZoneColor(zone.type, zone.severity)} 0%, transparent 70%)`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Disaster Zones */}
          {zones.map(zone => (
            <motion.div
              key={zone.id}
              className="disaster-zone"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 0.5,
                delay: zone.id * 0.1,
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{ scale: 1.2 }}
              onClick={() => handleZoneClick(zone)}
            >
              <div 
                className="zone-marker"
                style={{ 
                  backgroundColor: getZoneColor(zone.type, 100),
                  borderColor: getZoneColor(zone.type, 100),
                }}
              >
                <span className="zone-icon">{getZoneIcon(zone.type)}</span>
              </div>
              <div className="zone-pulse" style={{ borderColor: getZoneColor(zone.type, 100) }} />
            </motion.div>
          ))}

          {/* Map Legend */}
          <div className="map-legend">
            <h4>Legend</h4>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color flood" />
                <span>Flood</span>
              </div>
              <div className="legend-item">
                <div className="legend-color fire" />
                <span>Fire</span>
              </div>
              <div className="legend-item">
                <div className="legend-color earthquake" />
                <span>Earthquake</span>
              </div>
              <div className="legend-item">
                <div className="legend-color hurricane" />
                <span>Hurricane</span>
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="zoom-controls">
          <motion.button 
            className="zoom-btn"
            onClick={handleZoomIn}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomIn />
          </motion.button>
          <motion.button 
            className="zoom-btn"
            onClick={handleZoomOut}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ZoomOut />
          </motion.button>
        </div>

        {/* Selected Zone Info */}
        {selectedZone && (
          <motion.div 
            className="zone-info-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="zone-info-header">
              <span className="zone-icon">{getZoneIcon(selectedZone.type)}</span>
              <h4>{selectedZone.name}</h4>
              <button 
                className="close-info"
                onClick={() => setSelectedZone(null)}
              >
                ×
              </button>
            </div>
            <div className="zone-info-body">
              <div className="info-item">
                <span className="info-label">Severity:</span>
                <div className="severity-meter">
                  <div 
                    className="severity-fill"
                    style={{ 
                      width: `${selectedZone.severity}%`,
                      background: getZoneColor(selectedZone.type, 100)
                    }}
                  />
                  <span className="severity-value">{selectedZone.severity}%</span>
                </div>
              </div>
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">{selectedZone.type}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Affected Area:</span>
                <span className="info-value">{(selectedZone.radius * 10).toFixed(0)} km²</span>
              </div>
              <button className="analyze-btn">
                <Navigation />
                Analyze Zone
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MapVisualization;