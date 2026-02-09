// WorldMapVisualization.tsx
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './WorldMapVisualization.css';

// Fix for default markers in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icon
const createCustomIcon = (color: string) => {
    return L.divIcon({
        html: `
      <div style="
        width: 40px;
        height: 40px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      ">
        <div style="
          width: 20px;
          height: 20px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: 'custom-marker'
    });
};

interface DisasterZone {
    id: number;
    name: string;
    type: string;
    lat: number;
    lng: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
}

interface WorldMapVisualizationProps {
    disasterZones: DisasterZone[];
}

const MapController: React.FC<{ markers: DisasterZone[] }> = ({ markers }) => {
    const map = useMap();

    useEffect(() => {
        if (markers.length > 0) {
            const bounds = L.latLngBounds(
                markers.map(marker => [marker.lat, marker.lng] as [number, number])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [markers, map]);

    return null;
};

const WorldMapVisualization: React.FC<WorldMapVisualizationProps> = ({ disasterZones }) => {
    const mapRef = useRef<L.Map>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return '#ef4444';
            case 'high': return '#f97316';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };

    const getDisasterIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'wildfire':
            case 'fire':
                return '🔥';
            case 'earthquake':
                return '🌋';
            case 'flood':
            case 'tsunami':
                return '🌊';
            case 'landslide':
                return '🏔️';
            default:
                return '⚠️';
        }
    };

    // 🇮🇳 INDIA MAP SETTINGS (only change needed)
    const defaultCenter: [number, number] = [22.97, 78.65];
    const defaultZoom = 5;

    const indiaBounds = L.latLngBounds(
        L.latLng(6.5, 68.0),   // South-West India
        L.latLng(37.5, 97.5)  // North-East India
    );

    return (
        <div className="world-map-container">
            <MapContainer
                ref={mapRef}
                center={defaultCenter}
                zoom={defaultZoom}
                minZoom={4}
                maxZoom={10}
                bounds={indiaBounds}
                maxBounds={indiaBounds}
                maxBoundsViscosity={1.0}
                className="world-map"
                whenReady={() => setMapLoaded(true)}
                style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: '12px'
                }}
            >
                <TileLayer
                    noWrap={true}
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController markers={disasterZones} />

                {disasterZones.map((zone) => (
                    <Marker
                        key={zone.id}
                        position={[zone.lat, zone.lng]}
                        icon={createCustomIcon(getSeverityColor(zone.severity))}
                    >
                        <Popup>
                            <div className="popup-content">
                                <h4>{zone.name}</h4>
                                <div className="popup-details">
                                    <div className="popup-type">
                                        <span className="type-icon">{getDisasterIcon(zone.type)}</span>
                                        <span className="type-label">{zone.type}</span>
                                    </div>
                                    <div className="popup-severity">
                                        <span className={`severity-badge ${zone.severity}`}>
                                            {zone.severity.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <div className="map-controls">
                <div className="map-stats">
                    <div className="stat">
                        <span className="stat-value">{disasterZones.length}</span>
                        <span className="stat-label">ACTIVE ZONES</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">
                            {disasterZones.filter(z => z.severity === 'critical').length}
                        </span>
                        <span className="stat-label">CRITICAL</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">
                            {disasterZones.filter(z => z.severity === 'high').length}
                        </span>
                        <span className="stat-label">HIGH ALERT</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorldMapVisualization;
