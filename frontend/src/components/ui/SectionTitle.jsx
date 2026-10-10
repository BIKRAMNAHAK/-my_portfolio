import { motion } from 'framer-motion'
import { fadeInUp } from '../../utils/animations'

export default function SectionTitle({
  subtitle,
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}) {
  const alignClass = {
    center: 'text-center align-items-center',
    left: 'text-start align-items-start',
    right: 'text-end align-items-end',
  }

  const sub = subtitle || eyebrow

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`d-flex flex-column gap-2 mb-4 ${alignClass[align] || alignClass.center} ${className}`}
    >
      {sub && (
        <span
          className="text-uppercase fw-bold small letter-spacing-2"
          style={{
            color: 'var(--color-primary)',
            fontSize: '0.78rem',
            letterSpacing: '0.12em',
          }}
        >
          {sub}
        </span>
      )}
      <h2
        className="fw-bold mb-1"
        style={{
          color: 'var(--text-primary)',
          fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
          letterSpacing: '-0.04em',
        }}
      >
        {title.includes(' ') ? (
          <>
            {title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="gradient-text">{title.split(' ').slice(-1)}</span>
          </>
        ) : (
          <span className="gradient-text">{title}</span>
        )}
      </h2>
      {description && (
        <p
          className="text-secondary mb-0"
          style={{ maxWidth: '42rem', fontSize: '1rem', lineHeight: 1.6 }}
        >
          {description}
        </p>
      )}
      <div
        className="gradient-bg rounded-pill mt-2"
        style={{ width: '4rem', height: '4px' }}
      />
    </motion.div>
  )
}
