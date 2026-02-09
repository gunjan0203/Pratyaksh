import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Package,
  Droplets,
  Home,
  Clock,
  MapPin,
  Zap,
  Wind,
  Sun,
  Users,
  FileText,
  ArrowRight,
  CheckCircle,
  RotateCcw
} from 'lucide-react';
import './DamageNeeds.css';

type Priority = 'All' | 'Critical' | 'High' | 'Medium';

interface DamageType {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface Resource {
  id: string;
  name: string;
  category: string;
  priority: Exclude<Priority, 'All'>;
  quantity: number | string;
  unit: string;
  eta: string;
  supplier: string;
  status: 'Available' | 'In Transit' | 'Low Stock';
}

const DamageNeeds: React.FC = () => {
  const [selectedDamage, setSelectedDamage] = useState<string>('flood');
  const [priorityFilter, setPriorityFilter] = useState<Priority>('All');

  // 🔹 Backend related state
  const [step, setStep] = useState<number>(1);
  const [locationContext, setLocationContext] = useState<string>('');
  const [population, setPopulation] = useState<number | ''>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [backendResources, setBackendResources] = useState<Resource[]>([]);

  const damageTypes: DamageType[] = [
    { id: 'flood', name: 'Flood', icon: <Droplets />, color: '#3b82f6', description: 'Water damage & contamination' },
    { id: 'fire', name: 'Fire', icon: <AlertTriangle />, color: '#ef4444', description: 'Burns & structural collapse' },
    { id: 'earthquake', name: 'Earthquake', icon: <Home />, color: '#f59e0b', description: 'Infrastructure failure' },
    { id: 'hurricane', name: 'Hurricane', icon: <Wind />, color: '#8b5cf6', description: 'Wind damage & power outages' },
    { id: 'landslide', name: 'Landslide', icon: <MapPin />, color: '#10b981', description: 'Buried structures & erosion' },
    { id: 'drought', name: 'Drought', icon: <Sun />, color: '#f97316', description: 'Water scarcity & crop loss' },
  ];

  /* ---------------- BACKEND DATA MAPPER ---------------- */
  const mapBackendItemsToResources = (items: any[]): Resource[] => {
    return items.map((item, index) => ({
      id: `api-${index}`,
      name: item.item,
      category: 'Relief Aid',
      priority: 'Critical',
      quantity: item.quantity,
      unit: '',
      eta: 'Planned',
      supplier: item.source,
      status: 'Available',
    }));
  };

  /* ---------------- BACKEND CALL ---------------- */
  const fetchReliefPlan = async () => {
    if (!population || !locationContext) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('disaster_type', selectedDamage);
      formData.append('location_context', locationContext);
      formData.append('population_count', String(population));

      const res = await fetch('http://127.0.0.1:8000/analysis/relief-translator', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.status === 'success') {
        const mapped = mapBackendItemsToResources(result.data.aid_items);
        setBackendResources(mapped);
      }
    } catch (err) {
      console.error('Backend error:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- RESET TO DEFAULT ---------------- */
  const resetToDefault = () => {
    setLocationContext('');
    setPopulation('');
    setBackendResources([]);
    setPriorityFilter('All');
    setStep(1);
  };

  /* ---------------- RESOURCE SOURCE ---------------- */
  const activeResources = backendResources.length ? backendResources : [];

  const filteredResources = activeResources.filter(r =>
    priorityFilter === 'All' ? true : r.priority === priorityFilter
  );

  const downloadPDF = (type: 'damage' | 'relief') => {
    const url =
      type === 'damage'
        ? 'http://127.0.0.1:8000/analysis/download-report'
        : 'http://127.0.0.1:8000/analysis/download-relief-report';

    window.open(url, '_blank');
  };

  return (
    <motion.div className="damage-needs" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="needs-header">
        <div className="header-left">
          <h1>Damage to Needs Estimator</h1>
          <p>Community-level resource mapping and essential supply protocols.</p>
        </div>
      </div>

      <div className="needs-container">
        {/* ---------------- DAMAGE SELECTION ---------------- */}
        <div className="damage-selection">
          <h2><AlertTriangle size={24} /> Select Assessment</h2>
          <div className="damage-grid">
            {damageTypes.map((damage) => (
              <button
                key={damage.id}
                className={`damage-card ${selectedDamage === damage.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedDamage(damage.id);
                  setStep(1);
                  setBackendResources([]);
                }}
                style={{ '--damage-color': damage.color } as React.CSSProperties}
              >
                <div className="damage-icon" style={{ color: damage.color }}>{damage.icon}</div>
                <h3>{damage.name}</h3>
                <p>{damage.description}</p>
                <div className="damage-indicator" />
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- QUESTION STEPS ---------------- */}
        <div className="content-wrapper">
          <AnimatePresence mode="wait">
            {/* Step 1: Location Context */}
            {step === 1 && (
              <motion.div
                className="question-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3><MapPin size={20} /> Select Location Context</h3>
                <div className="dropdown-with-buttons">
                  <select
                    value={locationContext}
                    onChange={(e) => setLocationContext(e.target.value)}
                  >
                    <option value="">Select area type...</option>
                    <option value="Urban">Urban Area</option>
                    <option value="Rural">Rural Area</option>
                    <option value="Coastal">Coastal Region</option>
                    <option value="Mountain">Mountain Region</option>
                    <option value="Industrial">Industrial Zone</option>
                    <option value="Residential">Residential Area</option>
                  </select>

                  <div className="step-buttons">
                    <button
                      className="next-button"
                      disabled={!locationContext}
                      onClick={() => setStep(2)}
                    >
                      Continue <ArrowRight size={18} />
                    </button>

                    <button
                      className="reset-step-button"
                      onClick={resetToDefault}
                      title="Reset everything to default"
                    >
                      <RotateCcw size={18} />
                      Reset All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Population Input */}
            {step === 2 && (
              <motion.div
                className="question-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3><Users size={20} /> Enter Affected Population</h3>
                <div className="input-with-buttons">
                  <div className="input-wrapper">
                    <input
                      type="number"
                      placeholder="Enter number of affected people"
                      value={population}
                      onChange={(e) => setPopulation(Number(e.target.value) || '')}
                      min="1"
                      max="1000000"
                    />
                  </div>

                  <div className="step-buttons">
                    <button
                      className="generate-button"
                      disabled={!population || loading}
                      onClick={fetchReliefPlan}
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner" />
                          Generating Plan...
                        </>
                      ) : (
                        <>
                          Generate Relief Plan <CheckCircle size={18} />
                        </>
                      )}
                    </button>

                    <button
                      className="reset-step-button"
                      onClick={resetToDefault}
                      title="Reset everything to default"
                    >
                      <RotateCcw size={18} />
                      Reset All
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------------- RESOURCE LIST ---------------- */}
          {filteredResources.length > 0 && (
            <div className="resources-section">
              <div className="section-header">
                <h2><Package size={24} /> Resource Checklist</h2>
                <div className="filter-group">
                  {(['All', 'Critical', 'High', 'Medium'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      className={`filter-tab ${priorityFilter === p ? 'active' : ''}`}
                      onClick={() => setPriorityFilter(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="resources-grid">
                <AnimatePresence>
                  {filteredResources.map((resource) => (
                    <motion.div
                      key={resource.id}
                      className="resource-card"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="resource-header">
                        <div className="resource-info">
                          <h3>{resource.name}</h3>
                          <span className="resource-category">{resource.category}</span>
                        </div>
                        <div
                          className="priority-tag"
                          style={{
                            backgroundColor:
                              resource.priority === 'Critical' ? '#ef4444' :
                                resource.priority === 'High' ? '#f59e0b' : '#10b981'
                          }}
                        >
                          {resource.priority}
                        </div>
                      </div>
                      <div className="resource-details">
                        <div className="detail">
                          <span className="label">Quantity</span>
                          <span className="value">{resource.quantity} {resource.unit}</span>
                        </div>
                        <div className="detail">
                          <span className="label">ETA</span>
                          <span className="value"><Clock size={16} /> {resource.eta}</span>
                        </div>
                        <div className="detail">
                          <span className="label">Status</span>
                          <span className={`value status-badge`}>
                            {resource.status}
                          </span>
                        </div>
                        <div className="detail">
                          <span className="label">Source</span>
                          <span className="value">{resource.supplier}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* ---------------- NO DATA MESSAGE ---------------- */}
          {step === 2 && !loading && filteredResources.length === 0 && (
            <motion.div
              className="question-card empty-state-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="empty-state-content">
                <AlertTriangle size={48} color="#64748b" />
                <h3>No Relief Plan Generated Yet</h3>
                <p>
                  Complete the assessment above to generate a customized relief plan based on
                  the selected disaster type and population data.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* ---------------- ACTION PANEL ---------------- */}
        <div className="action-section">
          <h3><Zap size={22} color="#3b82f6" /> Quick Actions</h3>

          <button className="action-btn primary">
            <Users size={18} /> Contact NGO
          </button>

          <button className="action-btn secondary">
            <FileText size={18} /> Export Checklist
          </button>

          <button
            className="action-btn secondary"
            onClick={() => downloadPDF('relief')}
          >
            <FileText size={18} /> Download Relief Plan
          </button>

          {/* Step Indicator */}
          <div className="step-indicator">
            <h4 style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '1rem', fontWeight: 600 }}>
              Assessment Progress
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div className={`dot ${step >= 1 ? 'green' : ''}`} style={{ backgroundColor: step >= 1 ? '#10b981' : '#475569' }}></div>
              <span style={{ color: step >= 1 ? '#f8fafc' : '#94a3b8', fontWeight: step >= 1 ? 600 : 500 }}>
                1. Select Damage Type
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <div className={`dot ${step >= 2 ? 'green' : ''}`} style={{ backgroundColor: step >= 2 ? '#10b981' : '#475569' }}></div>
              <span style={{ color: step >= 2 ? '#f8fafc' : '#94a3b8', fontWeight: step >= 2 ? 600 : 500 }}>
                2. Set Location Context
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className={`dot ${filteredResources.length > 0 ? 'green' : ''}`} style={{ backgroundColor: filteredResources.length > 0 ? '#10b981' : '#475569' }}></div>
              <span style={{ color: filteredResources.length > 0 ? '#f8fafc' : '#94a3b8', fontWeight: filteredResources.length > 0 ? 600 : 500 }}>
                3. Generate Relief Plan
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DamageNeeds;
