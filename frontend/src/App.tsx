import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Dashboard from './pages/Dashboard';
import MediaAnalyzer from './pages/MediaAnalyzer';
import DamageEstimator from './pages/DamageEstimator';
import DamageNeeds from './pages/DamageNeeds';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Settings from './pages/Settings';
import { pageVariants, pageTransition } from './animations';
import './App.css';
import HelpDocs from './pages/HelpDocs';
import './styles/index.css';
import AlertsPage from './pages/AlertsPage';
import AlertDetailPage from './pages/AlertDetailPage';

// Add authentication pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';

// Add global type declarations
declare global {
  interface Window {
    __APP_THEME__?: string;
    __APP_FONT_SIZE__?: string;
  }
}

// Helper function to apply font size to entire app
const applyFontSizeToApp = (fontSize: "small" | "medium" | "large") => {
  const fontSizes = {
    small: "10px",
    medium: "14px",
    large: "18px"
  };
  
  // Apply to root element
  document.documentElement.style.fontSize = fontSizes[fontSize];
  
  // Also apply to body
  document.body.style.fontSize = fontSizes[fontSize];
  
  // Store in a global variable for other components to access
  window.__APP_FONT_SIZE__ = fontSize;
};

// Helper function to apply theme to entire app
const applyThemeToApp = (theme: "dark" | "light" | "auto") => {
  const effectiveTheme = theme === "auto" 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light")
    : theme;
  
  // Apply to root element
  document.documentElement.setAttribute("data-theme", effectiveTheme);
  
  // Also apply to body for wider coverage
  document.body.setAttribute("data-theme", effectiveTheme);
  
  // Store in a global variable for other components to access
  window.__APP_THEME__ = effectiveTheme;
};

// Load initial settings when app starts
const loadInitialSettings = () => {
  const savedSettings = localStorage.getItem("appSettings");
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      
      // Apply theme
      const theme = settings.theme || "dark";
      applyThemeToApp(theme);
      
      // Apply font size
      const fontSize = settings.fontSize || "medium";
      applyFontSizeToApp(fontSize);
      
      // Apply language
      if (settings.language) {
        document.documentElement.lang = settings.language;
      }
    } catch (error) {
      console.error("Failed to load initial settings:", error);
    }
  } else {
    // Apply default theme and font size
    applyThemeToApp("dark");
    applyFontSizeToApp("medium");
  }
};

// Private Route Component for protected routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

// Auth Layout Component (without Navbar/Sidebar)
const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="auth-layout">
    {children}
  </div>
);

// Main Layout Component (with Navbar/Sidebar)
const MainLayout = ({ children, sidebarOpen, setSidebarOpen }: { 
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) => (
  <div className="app">
    <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
    <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    {children}
  </div>
);

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery] = useState('');

  useEffect(() => {
    // Load settings immediately when app starts
    loadInitialSettings();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.theme === "auto") {
          const newTheme = mediaQuery.matches ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", newTheme);
          document.body.setAttribute("data-theme", newTheme);
          window.__APP_THEME__ = newTheme;
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    // Splash screen timer
    const timer = setTimeout(() => setShowSplash(false), 3000);
    
    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  // Optional: Add an event listener to detect theme changes from Settings page
  useEffect(() => {
    const handleSettingsChange = () => {
      // Re-apply settings when they change (e.g., from Settings page)
      loadInitialSettings();
    };
    
    // Listen for custom event that Settings page can trigger
    window.addEventListener('appSettingsChanged', handleSettingsChange);
    
    return () => {
      window.removeEventListener('appSettingsChanged', handleSettingsChange);
    };
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes (without Navbar/Sidebar) */}
        <Route path="/" element={
          <AuthLayout>
            <HomePage />
          </AuthLayout>
        } />
        <Route path="/login" element={
          <AuthLayout>
            <Page><LoginPage /></Page>
          </AuthLayout>
        } />
        <Route path="/signup" element={
          <AuthLayout>
            <Page><SignupPage /></Page>
          </AuthLayout>
        } />

        {/* Protected Routes (with Navbar/Sidebar) */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Page><Dashboard query={searchQuery} /></Page>
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/media-analyzer" element={
          <PrivateRoute>
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Page><MediaAnalyzer /></Page>
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/damage-estimator" element={
          <PrivateRoute>
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Page><DamageEstimator /></Page>
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/damage-needs" element={
          <PrivateRoute>
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Page><DamageNeeds /></Page>
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/alerts" element={
          <PrivateRoute>
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Page><AlertsPage /></Page>
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/alerts/:id" element={
          <PrivateRoute>
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Page><AlertDetailPage /></Page>
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/settings" element={
          <PrivateRoute>
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Page><Settings /></Page>
            </MainLayout>
          </PrivateRoute>
        } />
        
        <Route path="/help" element={
          <PrivateRoute>
            <MainLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
              <Page><HelpDocs /></Page>
            </MainLayout>
          </PrivateRoute>
        } />

        {/* Catch-all redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

// Page wrapper with animations
const Page: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    style={{ height: '100%' }}
  >
    {children}
  </motion.div>
);

export default App;