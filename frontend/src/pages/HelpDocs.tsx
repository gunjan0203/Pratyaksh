import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Video,
  FileText,
  Code,
  Globe,
  Users,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ExternalLink,
  Download,
  Clock,
  HelpCircle,
  AlertTriangle,
  Shield,
  Satellite
} from 'lucide-react';
import './HelpDocs.css';

const HelpDocs: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'docs' | 'tutorials' | 'api' | 'community'>('docs');

  const toggleSection = (index: number) => {
    setExpandedSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqSections = [
    {
      title: 'Media Authenticity Checker',
      icon: <Shield />,
      questions: [
        {
          q: 'How does the AI detect manipulated media?',
          a: 'Our AI uses multiple techniques including metadata analysis, reverse image search, pattern recognition, and satellite imagery comparison to identify manipulated content.'
        },
        {
          q: 'What file formats are supported?',
          a: 'We support JPEG, PNG, GIF for images, and MP4, MOV, AVI for videos. Maximum file size is 100MB.'
        },
        {
          q: 'How accurate is the authenticity analysis?',
          a: 'Our current model achieves 94.2% accuracy on verified test datasets. Results include a confidence score to indicate reliability.'
        }
      ]
    },
    {
      title: 'Damage Estimation',
      icon: <AlertTriangle />,
      questions: [
        {
          q: 'How does damage estimation work?',
          a: 'The system compares before/after images using computer vision algorithms to detect structural changes, quantify damage percentage, and estimate economic impact.'
        },
        {
          q: 'What kind of damage can be estimated?',
          a: 'We can estimate structural damage, flooding extent, fire damage, infrastructure damage, and agricultural impact.'
        },
        {
          q: 'How accurate are the estimates?',
          a: 'Estimates are typically within ±15% of ground truth measurements when using high-quality satellite or drone imagery.'
        }
      ]
    },
    {
      title: 'Panic Heatmap',
      icon: <Satellite />,
      questions: [
        {
          q: 'How is panic detected without social media APIs?',
          a: 'We analyze media upload patterns, frequency anomalies, and satellite-image mismatches to detect potential panic zones without accessing social media APIs.'
        },
        {
          q: 'What data sources are used?',
          a: 'We use satellite imagery, verified media uploads, historical disaster data, and ground reports from trusted sources.'
        },
        {
          q: 'How real-time is the heatmap?',
          a: 'The heatmap updates every 5 minutes with new data, with critical alerts triggering immediate updates.'
        }
      ]
    },
    {
      title: 'System & Integration',
      icon: <Code />,
      questions: [
        {
          q: 'How can I integrate with your API?',
          a: 'Our REST API is fully documented. You can get API keys and documentation from the API section of this page.'
        },
        {
          q: 'Is my data secure?',
          a: 'All data is encrypted in transit and at rest. We comply with GDPR and never share sensitive information.'
        },
        {
          q: 'What browsers are supported?',
          a: 'Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. We recommend using the latest version for best performance.'
        }
      ]
    }
  ];

  const tutorials = [
    {
      title: 'Getting Started Guide',
      duration: '10 min',
      level: 'Beginner',
      icon: <BookOpen />,
      description: 'Learn the basics of using the Disaster Response platform'
    },
    {
      title: 'Media Analysis Tutorial',
      duration: '15 min',
      level: 'Intermediate',
      icon: <Video />,
      description: 'Step-by-step guide to analyzing media authenticity'
    },
    {
      title: 'Damage Estimation Walkthrough',
      duration: '20 min',
      level: 'Advanced',
      icon: <FileText />,
      description: 'Complete guide to damage assessment workflow'
    },
    {
      title: 'API Integration Guide',
      duration: '25 min',
      level: 'Developer',
      icon: <Code />,
      description: 'Integrate our API into your applications'
    }
  ];

  const resources = [
    {
      title: 'API Documentation',
      type: 'Technical',
      icon: <Code />,
      link: '/api/docs'
    },
    {
      title: 'Research Papers',
      type: 'Academic',
      icon: <BookOpen />,
      link: '/research'
    },
    {
      title: 'Case Studies',
      type: 'Reports',
      icon: <FileText />,
      link: '/case-studies'
    },
    {
      title: 'Data Privacy Policy',
      type: 'Legal',
      icon: <Shield />,
      link: '/privacy'
    }
  ];

  return (
    <motion.div
      className="help-docs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="help-header">
        <div className="header-content">
          <h1>
            <HelpCircle />
            Help & Documentation
          </h1>
          <p className="header-subtitle">
            Everything you need to use the Disaster Response platform effectively
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <BookOpen className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">24</span>
            <span className="stat-label">Guides</span>
          </div>
        </div>
        <div className="stat-card">
          <Video className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">18</span>
            <span className="stat-label">Tutorials</span>
          </div>
        </div>
        <div className="stat-card">
          <FileText className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">156</span>
            <span className="stat-label">Articles</span>
          </div>
        </div>
        <div className="stat-card">
          <Users className="stat-icon" />
          <div className="stat-content">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="docs-tabs">
        <button
          className={`tab-btn ${activeTab === 'docs' ? 'active' : ''}`}
          onClick={() => setActiveTab('docs')}
        >
          <BookOpen />
          Documentation
        </button>
        <button
          className={`tab-btn ${activeTab === 'tutorials' ? 'active' : ''}`}
          onClick={() => setActiveTab('tutorials')}
        >
          <Video />
          Tutorials
        </button>
        <button
          className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          <Code />
          API Reference
        </button>
        <button
          className={`tab-btn ${activeTab === 'community' ? 'active' : ''}`}
          onClick={() => setActiveTab('community')}
        >
          <Users />
          Community
        </button>
      </div>

      {/* Main Content */}
      <div className="docs-content">
        {/* Documentation Section */}
        {activeTab === 'docs' && (
          <motion.div
            className="docs-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Frequently Asked Questions</h2>
            <p className="section-description">
              Find quick answers to common questions about the platform
            </p>

            <div className="faq-container">
              {faqSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="faq-section">
                  <div className="faq-section-header">
                    <div className="section-title">
                      {section.icon}
                      <h3>{section.title}</h3>
                    </div>
                    <button
                      className="expand-btn"
                      onClick={() => toggleSection(sectionIndex)}
                    >
                      {expandedSections.includes(sectionIndex) ? <ChevronUp /> : <ChevronDown />}
                    </button>
                  </div>

                  {expandedSections.includes(sectionIndex) && (
                    <motion.div
                      className="faq-list"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      {section.questions.map((item, qIndex) => (
                        <div key={qIndex} className="faq-item">
                          <h4 className="question">{item.q}</h4>
                          <p className="answer">{item.a}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tutorials Section */}
        {activeTab === 'tutorials' && (
          <motion.div
            className="tutorials-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Video Tutorials & Guides</h2>
            <p className="section-description">
              Step-by-step tutorials to master the Disaster Response platform
            </p>

            <div className="tutorials-grid">
              {tutorials.map((tutorial, index) => (
                <motion.div
                  key={index}
                  className="tutorial-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="tutorial-header">
                    <div className="tutorial-icon">{tutorial.icon}</div>
                    <div className="tutorial-meta">
                      <span className="duration">
                        <Clock />
                        {tutorial.duration}
                      </span>
                      <span className={`level ${tutorial.level.toLowerCase()}`}>
                        {tutorial.level}
                      </span>
                    </div>
                  </div>
                  <h3>{tutorial.title}</h3>
                  <p>{tutorial.description}</p>
                  <button className="start-tutorial-btn">
                    Start Tutorial
                    <ChevronRight />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* API Section */}
        {activeTab === 'api' && (
          <motion.div
            className="api-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2>API Documentation</h2>
            <p className="section-description">
              Integrate our disaster analysis capabilities into your applications
            </p>

            <div className="api-endpoints">
              <div className="endpoint-card">
                <div className="endpoint-header">
                  <span className="method post">POST</span>
                  <code>/api/analyze/media</code>
                </div>
                <p className="endpoint-description">
                  Analyze media authenticity. Accepts image/video uploads and returns AI analysis.
                </p>
                <div className="endpoint-meta">
                  <span className="tag">Authentication Required</span>
                  <span className="tag">Rate Limited</span>
                </div>
              </div>

              <div className="endpoint-card">
                <div className="endpoint-header">
                  <span className="method post">POST</span>
                  <code>/api/estimate/damage</code>
                </div>
                <p className="endpoint-description">
                  Estimate damage from before/after images. Returns damage percentage and analysis.
                </p>
                <div className="endpoint-meta">
                  <span className="tag">Authentication Required</span>
                  <span className="tag">High Compute</span>
                </div>
              </div>

              <div className="endpoint-card">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <code>/api/panic/heatmap</code>
                </div>
                <p className="endpoint-description">
                  Get panic heatmap data for a location. Returns panic scores and hotspots.
                </p>
                <div className="endpoint-meta">
                  <span className="tag">Public</span>
                  <span className="tag">Real-time</span>
                </div>
              </div>

              <div className="endpoint-card">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <code>/api/damage/needs</code>
                </div>
                <p className="endpoint-description">
                  Translate damage type to required aid. Returns resource recommendations.
                </p>
                <div className="endpoint-meta">
                  <span className="tag">Public</span>
                  <span className="tag">Cached</span>
                </div>
              </div>
            </div>

            <div className="api-actions">
              <button className="api-btn primary">
                <Download />
                Download API SDK
              </button>
              <button className="api-btn">
                <ExternalLink />
                View Full Documentation
              </button>
              <button className="api-btn">
                <Code />
                API Playground
              </button>
            </div>
          </motion.div>
        )}

        {/* Community Section */}
        {activeTab === 'community' && (
          <motion.div
            className="community-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2>Community & Support</h2>
            <p className="section-description">
              Connect with other users, get help, and share knowledge
            </p>

            <div className="community-grid">
              <div className="community-card">
                <div className="community-icon">
                  <Users />
                </div>
                <h3>Community Forum</h3>
                <p>Join discussions, ask questions, and share experiences with other users</p>
                <button className="community-btn">
                  Join Forum
                  <ExternalLink />
                </button>
              </div>

              <div className="community-card">
                <div className="community-icon">
                  <MessageSquare />
                </div>
                <h3>Live Chat Support</h3>
                <p>Get real-time assistance from our support team (24/7 for enterprise users)</p>
                <button className="community-btn">
                  Start Chat
                  <MessageSquare />
                </button>
              </div>

              <div className="community-card">
                <div className="community-icon">
                  <Mail />
                </div>
                <h3>Email Support</h3>
                <p>Send us detailed questions or feedback. We respond within 24 hours</p>
                <button className="community-btn">
                  Contact Support
                  <Mail />
                </button>
              </div>

              <div className="community-card">
                <div className="community-icon">
                  <Globe />
                </div>
                <h3>Knowledge Base</h3>
                <p>Browse our extensive collection of articles, guides, and best practices</p>
                <button className="community-btn">
                  Browse Articles
                  <BookOpen />
                </button>
              </div>
            </div>

            <div className="community-resources">
              <h3>Additional Resources</h3>
              <div className="resources-grid">
                {resources.map((resource, index) => (
                  <motion.div
                    key={index}
                    className="resource-item"
                    whileHover={{ x: 5 }}
                  >
                    {resource.icon}
                    <div className="resource-info">
                      <h4>{resource.title}</h4>
                      <span className="resource-type">{resource.type}</span>
                    </div>
                    <ExternalLink className="resource-link" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Help Banner */}
      <div className="help-banner">
        <div className="banner-content">
          <h3>Need Immediate Help?</h3>
          <p>Our support team is available 24/7 for critical disaster response situations</p>
        </div>
        <div className="banner-actions">
          <button className="emergency-btn">
            <AlertTriangle />
            Emergency Support
          </button>
          <button className="contact-btn">
            <Mail />
            Contact Us
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpDocs;