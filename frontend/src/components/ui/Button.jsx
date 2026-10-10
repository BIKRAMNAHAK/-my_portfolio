import { motion } from 'framer-motion'

const variants = {
  primary: 'gradient-bg text-white shadow-sm',
  secondary: 'glass text-body border',
  outline: 'border border-primary text-primary',
  ghost: 'text-secondary bg-transparent',
  danger: 'btn-outline-danger',
}

const sizes = {
  sm: 'px-3 py-1 small rounded-3',
  md: 'px-4 py-2 rounded-3',
  lg: 'px-5 py-3 fs-6 rounded-4',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      className={`
        d-inline-flex align-items-center justify-content-center gap-2 fw-semibold text-decoration-none border-0
        transition
        ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}
      `}
      style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.6 : 1 }}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={16} />}
        </>
      )}
    </motion.button>
  )
}
