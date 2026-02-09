import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Check,
  X,
  AlertTriangle,
  Clock,
  Satellite as SatelliteIcon,
  FileImage,
  MapPin
} from 'lucide-react';
import './MediaAnalyzer.css';

const API_URL = "http://localhost:8000/media/verify";

const MediaAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
      setAnalysis(null);
      setError(null);
    }
  });

  const analyzeMedia = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("lat", lat);
      formData.append("lon", lon);

      const response = await fetch(API_URL, { method: "POST", body: formData });
      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
      console.log("Full Backend Data:", data);

      const mappedResult = {
        authenticity: data.verdict.label,
        confidence: data.details.ai_check.confidence,
        checks: [
          {
            name: "Details", // Renamed from AI Verification
            result: data.verdict.reason,
            icon: <Check />,
            status: data.verdict.color === "green" ? "pass" : data.verdict.color === "red" ? "fail" : "warning"
          },
          {
            name: "Tamper Check",
            result: data.details.tamper.suspicious ? "Suspicious Pixels" : "No Tampering",
            icon: <FileImage />,
            status: data.details.tamper.suspicious ? "fail" : "pass"
          },
          {
            name: "Satellite Match",
            result: data.details.satellite.status === "match" ? "Location Verified" : "No Records Found",
            icon: <SatelliteIcon />,
            status: data.details.satellite.match ? "pass" : "fail"
          }
        ]
      };
      setAnalysis(mappedResult);
    } catch (err: any) {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Authentic':
      case 'Real': 
        return '#10b981'; // Green
      case 'Misleading':
      case 'Fake (AI)':
      case 'Manipulated': 
        return '#ef4444'; // Red
      case 'Uncertain': 
        return '#f59e0b'; // Fixed: Now returns Yellow
      case 'Outdated': 
        return '#f59e0b'; // Yellow
      default: 
        return '#6b7280'; // Grey fallback
    }
  };

  return (
    <motion.div className="media-analyzer" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="analyzer-header">
        <h1>Media Authenticity Checker</h1>
        <p>Upload images/videos to verify disaster media authenticity</p>
      </div>

      <div className="analyzer-main-layout">
        <div className="top-split-section">
          {/* LEFT 70% - Upload Area */}
          <div className="upload-container-wrapper">
            <div {...getRootProps()} className={`dropzone-box ${isDragActive ? 'active' : ''} ${file ? 'has-file' : ''}`}>
              <input {...getInputProps()} />
              {file ? (
                <div className="file-preview-content">
                  <FileImage className="file-icon" size={48} />
                  <p>{file.name}</p>
                  <button className="remove-btn-alt" onClick={(e) => { e.stopPropagation(); setFile(null); setAnalysis(null); }}>
                    <X />
                  </button>
                </div>
              ) : (
                <div className="upload-prompt-content">
                  <Upload className="upload-icon-alt" size={48} />
                  <p>Drag & drop or click to upload</p>
                  <p className="hint-text">Supports: JPEG, PNG, GIF, MP4, MOV</p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 30% - Coordinates & Steps */}
          <div className="info-panel-box">
            <div className="location-input-section">
              <div className="input-title">
                <MapPin size={18} />
                <h3>Location Metadata</h3>
              </div>
              <div className="coord-inputs">
                <div className="input-group">
                  <label>Latitude</label>
                  <input type="text" placeholder="e.g. 28.6139" value={lat} onChange={(e) => setLat(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Longitude</label>
                  <input type="text" placeholder="e.g. 77.2090" value={lon} onChange={(e) => setLon(e.target.value)} />
                </div>
              </div>
            </div>
            <hr className="panel-divider" />
            <div className="steps-container">
              {[
                { n: 1, t: "Upload Media", p: "Upload images/videos" },
                { n: 2, t: "Coordinates", p: "Optional: Enter location" },
                { n: 3, t: "AI Analysis", p: "Multiple models verify authenticity" }
              ].map(s => (
                <div className="step-item" key={s.n}>
                  <div className="step-number-circle">{s.n}</div>
                  <div className="step-text">
                    <h4>{s.t}</h4>
                    <p>{s.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="action-row-full">
          <motion.button
            className="analyze-btn-full"
            onClick={analyzeMedia}
            disabled={!file || isAnalyzing}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Media'}
          </motion.button>
          {error && <p className="error-text-msg">{error}</p>}
        </div>

        {analysis && (
          <motion.div className="results-section-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="result-header">
              <h2>Analysis Results</h2>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(analysis.authenticity) }}>
                {analysis.authenticity}
              </div>
            </div>
            <div className="checks-grid-full">
              {analysis.checks.map((check: any, i: number) => (
                <div key={i} className="check-card-full">
                  <div className="check-icon-box">{check.icon}</div>
                  <h3>{check.name}</h3>

                  {/* Confidence Bar for the Details Card */}
                  {check.name === "Details" && (
                    <div className="confidence-container" style={{ margin: '12px 0', width: '100%' }}>
                      <div className="confidence-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: '#6b7280', fontWeight: 600 }}>
                        <span>Confidence Score</span>
                        <span>{Math.round(analysis.confidence * 100)}%</span>
                      </div>
                      <div className="progress-track" style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                        <motion.div 
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${analysis.confidence * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{ 
                            height: '100%',
                            borderRadius: '10px',
                            backgroundColor: getStatusColor(analysis.authenticity) 
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <p className={`check-result-text ${check.status}`}>{check.result}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MediaAnalyzer;