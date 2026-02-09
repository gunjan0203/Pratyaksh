import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { 
  Save, 
  X, 
  Download, 
  Upload, 
  AlertCircle,
  Trash2,
  RotateCcw,
  AlertTriangle
} from "lucide-react";
import Toast from "../components/Toast";
import "./Settings.css";

interface AppSettings {
  theme: "dark" | "light" | "auto";
  useCache: boolean;
  baseCost: number;
  currency: string;
  language: string;
  fontSize: "small" | "medium" | "large";
  notifications: boolean;
  autoSave: boolean;
  exportQuality: "low" | "medium" | "high";
}

interface ConfirmationPopup {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: "danger" | "warning" | "info";
  onConfirm: () => void;
}

// Constants for font sizes in pixels
const FONT_SIZES = {
  small: "10px",
  medium: "12px",
  large: "14px"
} as const;

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: "dark",
    useCache: true,
    baseCost: 5000000,
    currency: "INR",
    language: "en",
    fontSize: "medium",
    notifications: true,
    autoSave: true,
    exportQuality: "medium",
  });

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [confirmationPopup, setConfirmationPopup] = useState<ConfirmationPopup>({
    visible: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    type: "danger",
    onConfirm: () => {}
  });
  
  const formRef = useRef<HTMLDivElement>(null);
  const themeAppliedRef = useRef(false);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("appSettings");
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
          
          // Apply saved theme to entire app
          applyThemeToApp(parsed.theme || "dark");
          
          // Apply saved font size to entire app
          if (parsed.fontSize && parsed.fontSize !== "medium") {
            applyFontSizeToApp(parsed.fontSize as "small" | "medium" | "large");
          }
          
          // Apply language
          if (parsed.language) {
            document.documentElement.lang = parsed.language;
          }
          
        } catch (error) {
          console.error("Failed to load settings:", error);
        }
      }
    };

    loadSettings();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (settings.theme === "auto") {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        applyThemeToApp(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  // Apply theme when settings change
  useEffect(() => {
    if (themeAppliedRef.current) {
      applyThemeToApp(settings.theme);
    } else {
      themeAppliedRef.current = true;
    }
  }, [settings.theme]);

  // Apply font size when it changes
  useEffect(() => {
    applyFontSizeToApp(settings.fontSize);
  }, [settings.fontSize]);

  // Apply language when it changes
  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

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

  // Helper function to apply font size to entire app
  const applyFontSizeToApp = (fontSize: "small" | "medium" | "large") => {
    // Apply to root element
    document.documentElement.style.fontSize = FONT_SIZES[fontSize];
    
    // Also apply to body
    document.body.style.fontSize = FONT_SIZES[fontSize];
    
    // Store in a global variable for other components to access
    window.__APP_FONT_SIZE__ = fontSize;
  };

  // Handle Enter key press to save settings
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        saveSettings();
      }
    };

    const formElement = formRef.current;
    if (formElement) {
      formElement.addEventListener("keypress", handleKeyPress);
    }

    return () => {
      if (formElement) {
        formElement.removeEventListener("keypress", handleKeyPress);
      }
    };
  }, [settings]);

  // Close popup on Escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && confirmationPopup.visible) {
        closeConfirmationPopup();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [confirmationPopup.visible]);

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = useCallback(() => {
    try {
      // Validate settings
      if (settings.baseCost < 0) {
        showErrorToast("Base cost cannot be negative!");
        return;
      }

      if (settings.baseCost > 10000000000) { // 10 billion limit
        showErrorToast("Base cost is too high!");
        return;
      }

      // Save to localStorage
      localStorage.setItem("appSettings", JSON.stringify(settings));
      
      // Apply theme to entire app
      applyThemeToApp(settings.theme);
      
      // Apply font size to entire app
      applyFontSizeToApp(settings.fontSize);
      
      // Apply language
      document.documentElement.lang = settings.language;
      
      // Show success toast
      showSuccessToast("Settings saved successfully!");
      
      console.log("Settings saved:", {
        fontSize: settings.fontSize,
        language: settings.language,
        currency: settings.currency,
        theme: settings.theme
      });
      
    } catch (error) {
      showErrorToast("Failed to save settings!");
      console.error("Save error:", error);
    }
  }, [settings]);

  const showConfirmationPopup = (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    type: "danger" | "warning" | "info" = "danger",
    confirmText: string = "Confirm",
    cancelText: string = "Cancel"
  ) => {
    setConfirmationPopup({
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm: () => {
        onConfirm();
        closeConfirmationPopup();
      }
    });
  };

  const closeConfirmationPopup = () => {
    setConfirmationPopup(prev => ({ ...prev, visible: false }));
  };

  const resetToDefaults = () => {
    showConfirmationPopup(
      "Reset Settings to Defaults",
      "This will restore all settings to their original values. Your current settings will be lost. Are you sure you want to proceed?",
      () => {
        const defaults: AppSettings = {
          theme: "dark",
          useCache: true,
          baseCost: 5000000,
          currency: "INR",
          language: "en",
          fontSize: "medium",
          notifications: true,
          autoSave: true,
          exportQuality: "medium",
        };
        setSettings(defaults);
        // Apply defaults immediately
        applyThemeToApp("dark");
        applyFontSizeToApp("medium");
        showSuccessToast("Settings reset to defaults");
      },
      "warning",
      "Reset Settings",
      "Keep Current"
    );
  };

  const clearLocalData = () => {
    showConfirmationPopup(
      "Clear Cached Data",
      "This will permanently delete all cached images, analysis results, and temporary files. This action cannot be undone. Are you sure you want to proceed?",
      () => {
        const keysToRemove = [
          "beforePreview", 
          "afterPreview", 
          "analysisResult",
          "cachedImages",
          "recentAnalyses"
        ];
        
        let clearedCount = 0;
        keysToRemove.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
            clearedCount++;
          }
        });
        
        showSuccessToast(`Cleared ${clearedCount} cached items`);
      },
      "danger",
      "Clear All Data",
      "Cancel"
    );
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `disaster-response-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSuccessToast("Settings exported successfully!");
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        
        // Validate imported settings
        if (!importedSettings || typeof importedSettings !== 'object') {
          throw new Error("Invalid settings file");
        }
        
        // Merge with current settings
        setSettings(prev => ({ ...prev, ...importedSettings }));
        
        // Apply imported settings immediately
        if (importedSettings.theme) {
          applyThemeToApp(importedSettings.theme);
        }
        if (importedSettings.fontSize) {
          applyFontSizeToApp(importedSettings.fontSize);
        }
        if (importedSettings.language) {
          document.documentElement.lang = importedSettings.language;
        }
        
        showSuccessToast("Settings imported successfully!");
      } catch (error) {
        showErrorToast("Invalid settings file format!");
        console.error("Import error:", error);
      }
    };
    reader.onerror = () => {
      showErrorToast("Failed to read settings file!");
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const showSuccessToast = (msg: string) => {
    setToastMessage(msg);
    setToastType("success");
    setShowToast(true);
  };

  const showErrorToast = (msg: string) => {
    setToastMessage(msg);
    setToastType("error");
    setShowToast(true);
  };

  const handleCurrencyChange = (value: string) => {
    updateSetting("currency", value);
    
    // Show currency symbol preview
    const symbols: Record<string, string> = {
      "INR": "₹",
      "USD": "$",
      "EUR": "€",
      "GBP": "£"
    };
    
    console.log(`Currency changed to: ${symbols[value]} ${value}`);
  };

  const handleFontSizeChange = (value: string) => {
    const fontSize = value as "small" | "medium" | "large";
    updateSetting("fontSize", fontSize);
    applyFontSizeToApp(fontSize); // Apply immediately
    console.log(`Font size changed to: ${value}`);
  };

  const handleLanguageChange = (value: string) => {
    updateSetting("language", value);
    
    // Show language name
    const languages: Record<string, string> = {
      "en": "English",
      "hi": "Hindi (हिन्दी)",
      "es": "Spanish (Español)",
      "fr": "French (Français)"
    };
    
    console.log(`Language changed to: ${languages[value]}`);
  };

  const handleThemeChange = (value: "dark" | "light" | "auto") => {
    updateSetting("theme", value);
    applyThemeToApp(value); // Apply immediately
    console.log(`Theme changed to: ${value}`);
  };

  return (
    <motion.div 
      ref={formRef}
      className="settings-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="settings-header">
        <h1>Settings</h1>
        <div className="header-actions">
          <button 
            className="secondary-btn export-btn"
            onClick={exportSettings}
            aria-label="Export settings to JSON file"
          >
            <Download />
            Export Settings
          </button>
          <label 
            className="secondary-btn import-btn" 
            htmlFor="import-settings"
            aria-label="Import settings from JSON file"
          >
            <Upload />
            Import Settings
            <input
              id="import-settings"
              type="file"
              accept=".json"
              onChange={importSettings}
              aria-label="Select settings file to import"
              className="import-settings-input" 
            />
          </label>
        </div>
      </div>

      {/* Damage Analysis */}
      <section className="settings-card">
        <h2>Damage Analysis</h2>
        <div className="setting-row">
          <div className="setting-label">
            <span>Base Reconstruction Cost</span>
            <small>Base cost for damage calculation</small>
          </div>
          <div className="setting-control">
            <div className="currency-input">
              <select 
                value={settings.currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="currency-select"
                aria-label="Select currency"
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
              <input
                type="number"
                value={settings.baseCost}
                onChange={(e) => updateSetting("baseCost", Number(e.target.value))}
                min="0"
                max="10000000000"
                step="1000"
                aria-label="Base reconstruction cost"
              />
            </div>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span>Export Quality</span>
            <small>Quality of exported images</small>
          </div>
          <select 
            value={settings.exportQuality}
            onChange={(e) => updateSetting("exportQuality", e.target.value as any)}
            aria-label="Select export quality"
          >
            <option value="low">Low (Faster)</option>
            <option value="medium">Medium (Balanced)</option>
            <option value="high">High (Best Quality)</option>
          </select>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span>Result Caching</span>
            <small>Store analysis results for faster access</small>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.useCache}
              onChange={(e) => updateSetting("useCache", e.target.checked)}
              aria-label="Toggle result caching"
            />
            <span className="slider" />
          </label>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span>Auto-save Results</span>
            <small>Automatically save analysis results</small>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => updateSetting("autoSave", e.target.checked)}
              aria-label="Toggle auto-save results"
            />
            <span className="slider" />
          </label>
        </div>
      </section>

      {/* Appearance */}
      <section className="settings-card">
        <h2>Appearance</h2>
        <div className="setting-row">
          <div className="setting-label">
            <span>Theme</span>
            <small>Interface color scheme</small>
          </div>
          <div className="theme-switch">
            <button
              className={settings.theme === "dark" ? "active" : ""}
              onClick={() => handleThemeChange("dark")}
              aria-label="Set dark theme"
            >
              Dark
            </button>
            <button
              className={settings.theme === "light" ? "active" : ""}
              onClick={() => handleThemeChange("light")}
              aria-label="Set light theme"
            >
              Light
            </button>
            <button
              className={settings.theme === "auto" ? "active" : ""}
              onClick={() => handleThemeChange("auto")}
              aria-label="Set auto theme based on system preference"
            >
              Auto
            </button>
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span>Font Size</span>
            <small>Adjust text size</small>
          </div>
          <select 
            value={settings.fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            aria-label="Select font size"
          >
            <option value="small">Small </option>
            <option value="medium">Medium </option>
            <option value="large">Large </option>
          </select>
        </div>
      </section>

      {/* Preferences */}
      <section className="settings-card">
        <h2>Preferences</h2>
        <div className="setting-row">
          <div className="setting-label">
            <span>Language</span>
            <small>Interface language</small>
          </div>
          <select 
            value={settings.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            aria-label="Select language"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="es">Spanish (Español)</option>
            <option value="fr">French (Français)</option>
          </select>
        </div>

        <div className="setting-row">
          <div className="setting-label">
            <span>Notifications</span>
            <small>Show completion notifications</small>
          </div>
          <label className="toggle">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSetting("notifications", e.target.checked)}
              aria-label="Toggle notifications"
            />
            <span className="slider" />
          </label>
        </div>
      </section>

      {/* Data Management */}
      <section className="settings-card danger">
        <h2>Data Management</h2>
        <div className="danger-actions">
          <button 
            className="danger-btn" 
            onClick={clearLocalData}
            aria-label="Clear all cached data"
          >
            <Trash2 />
            Clear Cached Data
          </button>
          <button 
            className="danger-btn outline" 
            onClick={resetToDefaults}
            aria-label="Reset all settings to defaults"
          >
            <RotateCcw />
            Reset to Defaults
          </button>
        </div>
        <p className="hint-text">
          This will remove all cached images and analysis results. Your settings will be preserved.
        </p>
      </section>

      {/* Save Section with Consistent Button Sizes */}
      <div className="save-section">
        <button 
          className="save-btn" 
          onClick={saveSettings}
          aria-label="Save all settings"
        >
          <Save />
          Save Settings
        </button>
        <button 
          className="cancel-btn" 
          onClick={() => window.history.back()}
          aria-label="Cancel and go back"
        >
          <X />
          Cancel
        </button>
      </div>

      {/* Instructions for Enter key */}
      <div className="enter-hint">
        <small>💡 Press <kbd>Enter</kbd> to save settings</small>
      </div>

      {/* Confirmation Popup - Fixed to prevent multiple dropdowns */}
      {confirmationPopup.visible && (
        <motion.div 
          className="confirmation-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeConfirmationPopup}
        >
          <motion.div 
            className={`confirmation-popup ${confirmationPopup.type}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <div className="popup-icon">
                {confirmationPopup.type === "danger" && <AlertTriangle />}
                {confirmationPopup.type === "warning" && <AlertCircle />}
                {confirmationPopup.type === "info" && <AlertCircle />}
              </div>
              <h3>{confirmationPopup.title}</h3>
            </div>
            
            <div className="popup-body">
              <p>{confirmationPopup.message}</p>
            </div>
            
            <div className="popup-footer">
              <button 
                className="popup-cancel-btn"
                onClick={closeConfirmationPopup}
                type="button"
              >
                {confirmationPopup.cancelText}
              </button>
              <button 
                className={`popup-confirm-btn ${confirmationPopup.type}`}
                onClick={confirmationPopup.onConfirm}
                type="button"
              >
                {confirmationPopup.confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Toast
        message={toastMessage}
        visible={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </motion.div>
  );
};

declare global {
  interface Window {
    __APP_THEME__?: string;
    __APP_FONT_SIZE__?: string;
  }
}

export default Settings;