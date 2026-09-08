/* eslint-disable react-refresh/only-export-components, no-unused-vars, react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const ThemeContext = createContext(null);

/* Premium Animation Curves */
const springTransition = { type: 'spring', stiffness: 300, damping: 30 };
const easeTransition = [0.22, 1, 0.36, 1]; // Smooth snap ease

export const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: easeTransition } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { duration: 0.2, ease: 'easeInOut' } 
  }
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } }
};

export const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeTransition } }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('carvia-theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('carvia-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(x => (x === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export function PageTransition({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div 
      variants={reduce ? {} : pageVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export function MotionSection({ children, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.section 
      className={className} 
      variants={reduce ? {} : stagger} 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.1 }}
    >
      {children}
    </motion.section>
  );
}

export function ScrollReveal({ children, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? {} : item}>
      {children}
    </motion.div>
  );
}

export function AnimatedButton({ children, loading, success, className = '', ...props }) {
  const reduce = useReducedMotion();
  return (
    <motion.button 
      className={`animated-button ${className}`} 
      whileHover={reduce ? {} : { y: -2 }} 
      whileTap={reduce ? {} : { scale: 0.97 }} 
      disabled={loading || props.disabled} 
      {...props}
    >
      {loading ? (
        <span className="button-spinner" />
      ) : success ? (
        <span className="success-mark">✓</span>
      ) : (
        children
      )}
    </motion.button>
  );
}

export function AnimatedModal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div 
          className="modal-backdrop" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onMouseDown={onClose}
        >
          <motion.div 
            className="modal-card" 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 15, scale: 0.95 }} 
            transition={springTransition} 
            onMouseDown={e => e.stopPropagation()} 
            role="dialog" 
            aria-modal="true" 
            aria-label={title}
          >
            <header>
              <h2>{title}</h2>
              <button onClick={onClose} aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </header>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SkeletonCard({ type = 'job' }) {
  return (
    <div className={`skeleton-card-motion ${type}`} aria-label="Loading content">
      <i /><i /><i /><i />
    </div>
  );
}

export function LoadingScreen() {
  const [message, setMessage] = useState(0);
  const messages = [
    'Connecting to network...',
    'Fetching personalized jobs...',
    'Polishing the workspace...'
  ];

  useEffect(() => {
    const id = setInterval(() => setMessage(x => (x + 1) % messages.length), 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div 
      className="loading-screen" 
      initial={{ opacity: 1 }} 
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="loading-logo">
        <b>cv</b><span>Carvia</span>
      </div>
      <div className="loading-track"><i /></div>
      <p key={message}>{messages[message]}</p>
    </motion.div>
  );
}
