import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { NAV_LINKS, SITE } from '../../utils/constants'
import { fadeInDown, slideInMenu } from '../../utils/animations'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const headerLinks = NAV_LINKS.filter((link) =>
    ['About', 'Skills', 'Experience', 'Projects', 'Contact'].includes(link.name)
  )
  const sectionIds = headerLinks.map((link) => link.href.replace('#', ''))
  const activeSection = useScrollSpy(sectionIds)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const handleNavClick = (href) => {
    setMobileOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
        className={`fixed-top transition-all ${
          isScrolled ? 'glass-navbar shadow-sm' : 'bg-transparent'
        }`}
        style={{
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div className="container-custom">
          <div
            className="d-flex align-items-center justify-content-between"
            style={{ height: '4.5rem' }}
          >
            {/* Brand Logo */}
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
              <div
                className="w-8 h-8 gradient-bg rounded-3 d-flex align-items-center justify-content-center text-white fw-bold small shadow-sm"
                style={{ width: '34px', height: '34px' }}
              >
                BN
              </div>
              <span
                className="fw-bold"
                style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}
              >
                {SITE.name}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="d-none d-md-flex align-items-center gap-1">
              {headerLinks.map((link) => {
                const id = link.href.replace('#', '')
                const isActive = activeSection === id
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="btn btn-sm position-relative border-0 fw-semibold px-3 py-2"
                    style={{
                      color: isActive ? 'var(--color-primary)' : 'var(--text-secondary)',
                      backgroundColor: 'transparent',
                      fontSize: '0.9rem',
                    }}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="position-absolute bottom-0 start-50 translate-middle-x gradient-bg rounded-pill"
                        style={{ height: '2.5px', width: '60%' }}
                      />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Actions: Theme Toggle & Mobile Menu */}
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={toggleTheme}
                className="btn btn-sm rounded-circle p-2"
                style={{
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                }}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="btn btn-sm d-md-none p-2 border-0"
                style={{ color: 'var(--text-primary)' }}
                aria-label="Open menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="position-fixed inset-0 d-md-none"
              style={{
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(4px)',
                zIndex: 1040,
              }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              variants={slideInMenu}
              initial="closed"
              animate="open"
              exit="closed"
              className="position-fixed top-0 bottom-0 end-0 d-md-none glass-card rounded-0 p-4"
              style={{
                width: '280px',
                zIndex: 1050,
                backgroundColor: 'var(--bg-secondary)',
                borderLeft: '1px solid var(--border-color)',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-4">
                <span className="fw-bold gradient-text fs-5">{SITE.name}</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-sm p-1 rounded-2 border-0"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="d-flex flex-column gap-2">
                {headerLinks.map((link) => {
                  const id = link.href.replace('#', '')
                  const isActive = activeSection === id
                  return (
                    <button
                      key={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className={`btn text-start rounded-3 px-3 py-2 fw-semibold border-0 ${
                        isActive ? 'action-primary' : ''
                      }`}
                      style={{
                        backgroundColor: isActive ? undefined : 'transparent',
                        color: isActive ? '#fff' : 'var(--text-secondary)',
                      }}
                    >
                      {link.name}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
