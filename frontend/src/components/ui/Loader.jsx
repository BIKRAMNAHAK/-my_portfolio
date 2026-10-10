import { motion } from 'framer-motion'

export default function Loader({ size = 'md', text = 'Loading' }) {
  const dimMap = {
    sm: { width: '24px', height: '24px' },
    md: { width: '40px', height: '40px' },
    lg: { width: '56px', height: '56px' },
  }

  const dim = dimMap[size] || dimMap.md

  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-3 py-4">
      <motion.div
        className="rounded-circle p-1"
        style={{
          ...dim,
          background: 'conic-gradient(#8b5cf6, #06b6d4, #22c55e, #f59e0b, #ef4444, #8b5cf6)',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="w-100 h-100 rounded-circle" style={{ backgroundColor: 'var(--bg-primary)' }} />
      </motion.div>

      {text && (
        <motion.div
          className="small fw-semibold d-flex"
          style={{ color: 'var(--color-primary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span>{text}</span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          >
            .
          </motion.span>
        </motion.div>
      )}
    </div>
  )
}