// frontend/src/animations/index.ts
export const pageVariants = {
    initial: {
        opacity: 0,
        x: "-100vw",
        scale: 0.8
    },
    in: {
        opacity: 1,
        x: 0,
        scale: 1
    },
    out: {
        opacity: 0,
        x: "100vw",
        scale: 1.2
    }
};

import type { Transition } from "framer-motion";

export const pageTransition: Transition = {
    duration: 0.5,
    ease: "anticipate",
};


export const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
};

export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const cardHover = {
    initial: { scale: 1 },
    hover: { 
        scale: 1.05,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)"
    }
};

export const pulseAnimation = {
    initial: { scale: 1 },
    animate: { 
        scale: [1, 1.1, 1],
        transition: { 
            duration: 1.5,
            repeat: Infinity 
        }
    }
};