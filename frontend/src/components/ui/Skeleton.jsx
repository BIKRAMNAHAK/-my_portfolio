export default function Skeleton({ className = '', variant = 'rectangular', style = {} }) {
  const variantStyles = {
    rectangular: { borderRadius: '0.75rem', height: '100px' },
    circular: { borderRadius: '50%', width: '48px', height: '48px' },
    text: { borderRadius: '0.35rem', height: '16px' },
  }

  return (
    <div
      className={`skeleton-placeholder ${className}`}
      style={{
        backgroundColor: 'var(--border-color)',
        opacity: 0.5,
        ...variantStyles[variant],
        ...style,
      }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-4 d-flex flex-column gap-3">
      <Skeleton variant="rectangular" style={{ height: '160px' }} />
      <Skeleton variant="text" style={{ width: '75%' }} />
      <Skeleton variant="text" style={{ width: '100%' }} />
      <Skeleton variant="text" style={{ width: '60%' }} />
    </div>
  )
}
