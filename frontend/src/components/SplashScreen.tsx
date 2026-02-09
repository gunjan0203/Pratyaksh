// frontend/src/components/SplashScreen.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import './SplashScreen.css';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);
        
        return () => clearInterval(timer);
    }, [onComplete]);
    
    return (
        <motion.div 
            className="splash-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="splash-content">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                        type: "spring",
                        stiffness: 260,
                        damping: 20 
                    }}
                    className="logo-container"
                >
                    <motion.div 
                        className="pulse-ring"
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity
                        }}
                    />
                    <motion.div 
                        className="logo-out"
                        animate={{ rotate: 360 }}
                        transition={{ 
                            duration: 20, 
                            repeat: Infinity,
                            ease: "linear" 
                        }}
                    >
                        🛰️
                    </motion.div>
                </motion.div>
                
                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="splash-title"
                >
                    PRATYAKSH
                </motion.h1>
                
                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="splash-subtitle"
                >
                    Real-time disaster analysis & response platform
                </motion.p>
                
                <div className="progress-container">
                    <motion.div 
                        className="progress-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                    />
                    <span className="progress-text">{progress}%</span>
                </div>
                
                <motion.div 
                    className="loading-dots"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    {['⚡', '🛰️', '🤖', '🧠'].map((icon, i) => (
                        <motion.span
                            key={i}
                            animate={{ 
                                y: [0, -10, 0],
                                rotate: [0, 360, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                        >
                            {icon}
                        </motion.span>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SplashScreen;