// frontend/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Activity
} from 'lucide-react';
import './AuthPages.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  // In both LoginPage.tsx and SignupPage.tsx, add this useEffect:

    useEffect(() => {
      // Check if user is already logged in
      const token = localStorage.getItem('token');
      if (token) {
        // If already logged in, redirect to dashboard
        navigate('/dashboard');
      }
    }, [navigate]);
    
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsLoading(true);
  setLoginError('');
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock successful login
    const mockResponse = {
      data: {
        token: 'mock-jwt-token-12345',
        user: {
          id: '1',
          email: formData.email,
          name: 'Emergency Responder',
          role: 'responder'
        }
      }
    };
    
    // Store token and user info
    localStorage.setItem('token', mockResponse.data.token);
    localStorage.setItem('user', JSON.stringify(mockResponse.data.user));
    
    // ✅ Redirect to dashboard after successful login
    navigate('/dashboard');
    
  } catch (error: any) {
    console.error('Login error:', error);
    setLoginError('Invalid credentials. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleDemoLogin = () => {
    setFormData({
      email: 'responder@pratyaksh.com',
      password: 'demo123'
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side - Form */}
        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="auth-header">
            <button className="back-button" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              Back to Home
            </button>
            {/* <div className="logo"> */}
              {/* <Shield size={32} /> */}
              {/* <h1>PRATYAKSH</h1> */}
            {/* </div> */}
            <h2> Access Portal</h2>
            <p>Sign in to access disaster management dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {loginError && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                <Mail size={18} />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="responder@organization.com"
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={18} />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={errors.password ? 'error' : ''}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" />
                <span>Remember this device</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Authenticating...
                </>
              ) : (
                'Access Dashboard'
              )}
            </motion.button>

            <div className="demo-section">
              <button
                type="button"
                className="demo-btn"
                onClick={() => navigate('/signup')}
                disabled={isLoading}
              >
                <Activity size={20} />
                Create new account
              </button>
            </div>

            {/* <div className="auth-divider">
              <span>Or continue with</span>
            </div> */}

            {/* <div className="social-login">
              <button type="button" className="social-btn google">
                <img src="https://www.google.com/favicon.ico" alt="Google" />
                Google
              </button>
              <button type="button" className="social-btn microsoft">
                <img src="https://www.microsoft.com/favicon.ico" alt="Microsoft" />
                Microsoft
              </button>
            </div> */}

            <div className="auth-footer">
              <p>
                Create an account?{' '}
                <Link to="/signup" className="auth-link">
                  Request Access
                </Link>
              </p>
            </div>
          </form>
        </motion.div>

        {/* Right side - Info */}
        {/* <motion.div
          className="auth-info-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="info-content">
            <div className="info-header">
              <div className="emergency-badge">
                <AlertTriangle size={20} />
                <span>Emergency Response System</span>
              </div>
              <h2>Critical Disaster Management</h2>
              <p>Real-time monitoring and response coordination</p>
            </div>

            <div className="features-list">
              <div className="feature-item">
                <CheckCircle size={20} className="feature-icon" />
                <div>
                  <h4>Live Disaster Tracking</h4>
                  <p>Real-time monitoring of active disaster zones</p>
                </div>
              </div>
              
              <div className="feature-item">
                <CheckCircle size={20} className="feature-icon" />
                <div>
                  <h4>AI Damage Assessment</h4>
                  <p>Automatic damage analysis from satellite imagery</p>
                </div>
              </div>
              
              <div className="feature-item">
                <CheckCircle size={20} className="feature-icon" />
                <div>
                  <h4>Resource Coordination</h4>
                  <p>Smart allocation of emergency response teams</p>
                </div>
              </div>
              
              <div className="feature-item">
                <CheckCircle size={20} className="feature-icon" />
                <div>
                  <h4>Media Verification</h4>
                  <p>Authenticate disaster-related media content</p>
                </div>
              </div>
            </div> */}

            {/* <div className="active-alerts">
              <div className="alerts-header">
                <h4>Active Alerts</h4>
                <span className="alert-count">12 Critical</span>
              </div>
              <div className="alert-list">
                <div className="alert-item critical">
                  <MapPin size={14} />
                  <span>Earthquake - Northern Region</span>
                </div>
                <div className="alert-item high">
                  <MapPin size={14} />
                  <span>Flood Warning - Coastal Areas</span>
                </div>
                <div className="alert-item medium">
                  <MapPin size={14} />
                  <span>Wildfire - Forest Zone</span>
                </div>
              </div>
            </div> */}
{/* 
            <div className="stats-preview">
              <div className="stat">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Monitoring</div>
              </div>
              <div className="stat">
                <div className="stat-number">2min</div>
                <div className="stat-label">Avg Response</div>
              </div>
              <div className="stat">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
            </div>
          </div>
        </motion.div> */}
      </div>
    </div>
  );
};

export default LoginPage;