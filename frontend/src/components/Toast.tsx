// frontend/src/components/Toast.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import './Toast.css';

interface ToastProps {
  message: string;
  visible: boolean;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  visible, 
  type = 'success', 
  duration = 4000,
  onClose 
}) => {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="toast-icon success" />;
      case 'error':
        return <AlertCircle className="toast-icon error" />;
      default:
        return <CheckCircle className="toast-icon" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(16, 185, 129, 0.95)';
      case 'error':
        return 'rgba(239, 68, 68, 0.95)';
      default:
        return 'rgba(59, 130, 246, 0.95)';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="toast-container"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          transition={{ type: "spring", damping: 20 }}
          style={{ backgroundColor: getBackgroundColor() }}
        >
          <div className="toast-content">
            {getIcon()}
            <span className="toast-message">{message}</span>
            <button 
              className="toast-close" 
              onClick={onClose}
              aria-label="Close notification"
            >
              <X size={18} />
            </button>
          </div>
          
          {duration > 0 && (
            <motion.div 
              className="toast-progress"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;