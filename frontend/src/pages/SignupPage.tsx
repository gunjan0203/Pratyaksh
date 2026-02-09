// frontend/src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  AlertCircle,
 
  ArrowLeft,
} from 'lucide-react';
import './AuthPages.css';
import { useEffect } from 'react';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    navigate('/dashboard');
  }
}, [navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    department: '',
    role: 'responder',
    password: '',
    confirmPassword: '',
    terms: false,
    emergencyAccess: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setSignupError('');
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.organization) {
      newErrors.organization = 'Organization is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);
      setSignupError('');

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const mockResponse = {
          data: {
            token: 'mock-jwt-token-12345',
            user: {
              id: '1',
              email: formData.email,
              name: formData.name,
              organization: formData.organization,
              role: formData.role,
              emergencyAccess: formData.emergencyAccess
            }
          }
        };

        localStorage.setItem('token', mockResponse.data.token);
        localStorage.setItem('user', JSON.stringify(mockResponse.data.user));

        navigate('/dashboard');

      } catch (error: any) {
        console.error('Signup error:', error);
        setSignupError('Access request failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 0: return '#ef4444';
      case 1: return '#ef4444';
      case 2: return '#f59e0b';
      case 3: return '#eab308';
      case 4: return '#84cc16';
      case 5: return '#10b981';
      default: return '#ef4444';
    }
  };

  const strength = passwordStrength(formData.password);

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side - Info */}
        {/* <motion.div
          className="auth-info-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}S
        > */}
          {/* <div className="info-content">
            <div className="info-header">
              <div className="emergency-badge">
                <Shield size={20} />
                <span>Emergency Access Portal</span>
              </div>
              <h2>Request Emergency Access</h2>
              <p>Join disaster response organizations worldwide</p>
            </div>

            <div className="benefits-list">
              <div className="benefit-item">
                <CheckCircle size={20} className="benefit-icon" />
                <div>
                  <h4>Priority Emergency Access</h4>
                  <p>Immediate access during disaster situations</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <CheckCircle size={20} className="benefit-icon" />
                <div>
                  <h4>Real-time Satellite Data</h4>
                  <p>Live satellite imagery and damage assessment</p>
                </div>
              </div> */}
              
              {/* <div className="benefit-item">
                <CheckCircle size={20} className="benefit-icon" />
                <div>
                  <h4>Team Coordination</h4>
                  <p>Coordinate with multiple response teams</p>
                </div>
              </div>
              
              <div className="benefit-item">
                <CheckCircle size={20} className="benefit-icon" />
                <div>
                  <h4>24/7 Support</h4>
                  <p>Round-the-clock emergency support</p>
                </div>
              </div>
            </div>

            <div className="role-selection">
              <h4>Who uses our platform?</h4>
              <div className="roles-grid">
                <div className="role-card">
                  <Building size={24} />
                  <h5>Government Agencies</h5>
                  <p>NDMA, NDRF, State Disaster Authorities</p>
                </div>
                <div className="role-card">
                  <Users size={24} />
                  <h5>NGOs & Aid Orgs</h5>
                  <p>Red Cross, UN Agencies, Humanitarian NGOs</p>
                </div>
                <div className="role-card">
                  <Briefcase size={24} />
                  <h5>Emergency Services</h5>
                  <p>Fire, Police, Medical, Search & Rescue</p>
                </div>
              </div>
            </div> */}

            {/* <div className="active-response">
              <div className="response-header">
                <MapPin size={18} />
                <h4>Active Response Operations</h4>
              </div>
              <div className="response-stats">
                <div className="response-stat">
                  <span className="stat-label">Teams Active</span>
                  <span className="stat-value">48</span>
                </div>
                <div className="response-stat">
                  <span className="stat-label">Zones Covered</span>
                  <span className="stat-value">12</span>
                </div>
                <div className="response-stat">
                  <span className="stat-label">Avg Response</span>
                  <span className="stat-value">2.1min</span>
                </div>
              </div>
            </div> */}
          {/* </div>
        </motion.div> */}

        {/* Right side - Form */}
        <motion.div
          className="auth-form-container"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="auth-header">
            <button className="back-button" onClick={() => navigate('/')}>
              <ArrowLeft size={20} />
              Back to Home
            </button>
            {/* <div className="logo">
              <Shield size={32} />
              <h1>PRATYAKSH</h1>
            </div> */}
            <h2>Request Emergency Access</h2>
            <p>Complete this form for disaster response access</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {signupError && (
              <div className="error-message">
                <AlertCircle size={18} />
                <span>{signupError}</span>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <User size={18} />
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={errors.name ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.name && <div className="field-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <Mail size={18} />
                  Official Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@organization.gov"
                  className={errors.email ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.email && <div className="field-error">{errors.email}</div>}
              </div>
            </div>

            {/* <div className="form-row"> */}
              <div className="form-group">
                <label htmlFor="phone">
                  <Phone size={18} />
                  Emergency Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98xxx xxxx"
                  className={errors.phone ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.phone && <div className="field-error">{errors.phone}</div>}
              </div>

              {/* <div className="form-group">
                <label htmlFor="organization">
                  <Building size={18} />
                  Organization
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="National Disaster Response Force"
                  className={errors.organization ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.organization && <div className="field-error">{errors.organization}</div>}
              </div>
            </div> */}

            {/* <div className="form-row">
              <div className="form-group">
                <label htmlFor="department">
                  <Briefcase size={18} />
                  Department
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Emergency Operations"
                  className={errors.department ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.department && <div className="field-error">{errors.department}</div>}
              </div> */}

              {/* <div className="form-group">
                <label htmlFor="role">Role / Position</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="">Select your role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div> */}

            {/* <div className="form-group">
              <label>Organization Type</label>
              <div className="org-type-grid">
                {organizationTypes.map((type) => (
                  <label key={type.value} className="org-type-label">
                    <input
                      type="radio"
                      name="orgType"
                      value={type.value}
                      onChange={() => {}}
                      disabled={isLoading}
                    />
                    <span>{type.label}</span>
                  </label>
                ))}
              </div>
            </div> */}

            <div className="form-group">
              <label htmlFor="password">
                <Lock size={18} />
                Emergency Access Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create secure password"
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
              
              <div className="password-strength">
                <div className="strength-meter">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className="strength-bar"
                      style={{
                        backgroundColor: level <= strength ? getStrengthColor(strength) : '#e5e7eb'
                      }}
                    />
                  ))}
                </div>
                <div className="strength-label">
                  {strength === 0 && 'Very weak'}
                  {strength === 1 && 'Weak'}
                  {strength === 2 && 'Fair'}
                  {strength === 3 && 'Good'}
                  {strength === 4 && 'Strong'}
                  {strength === 5 && 'Very strong'}
                </div>
              </div>
              
              {errors.password && <div className="field-error">{errors.password}</div>}
              
              <div className="password-requirements">
                <p>For emergency access, password must contain:</p>
                <ul>
                  <li className={formData.password.length >= 8 ? 'met' : ''}>
                    At least 8 characters
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'met' : ''}>
                    One lowercase letter
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'met' : ''}>
                    One uppercase letter
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'met' : ''}>
                    One number
                  </li>
                </ul>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={18} />
                Confirm Password
              </label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
            </div>

            {/* <div className="form-group emergency-access">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="emergencyAccess"
                  checked={formData.emergencyAccess}
                  onChange={handleChange}
                  disabled={isLoading}
                /> */}
                {/* <span> */}
                  {/* <strong>Request Emergency Priority Access</strong> */}
                  {/* <small>(For critical disaster response operations)</small>
                </span> */}
              {/* </label>
            </div> */}

            <div className="form-group terms-group">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span>
                  I agree to the{' '}
                  <Link to="/terms" className="terms-link">
                    Emergency Access Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="terms-link">
                    Security Policy
                  </Link>
                </span>
              </label>
              {errors.terms && <div className="field-error">{errors.terms}</div>}
            </div>

            <motion.button
              type="submit"
              className="submit-btn emergency"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Requesting Emergency Access...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>

            <div className="auth-divider">
              <span>Already have an account?</span>
            </div>

            <div className="auth-footer">
              <p>
                Sign in to your account{' '}
                <Link to="/login" className="auth-link">
                  here
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;