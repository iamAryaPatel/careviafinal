import { AnimatePresence, motion } from 'framer-motion';

export default function Toast({ message, type = 'success' }) {
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={`toast toast--${type}`}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <span className="toast__icon">{icons[type] || icons.success}</span>
          <span className="toast__message">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
