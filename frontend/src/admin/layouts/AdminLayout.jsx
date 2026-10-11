import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  BriefcaseBusiness,
  GraduationCap,
  User,
  FileText,
  Mail,
  Share2,
  ExternalLink,
  LogOut,
  Menu,
  Sun,
  Moon,
  X,
  ShieldAlert,
} from 'lucide-react'
import { Offcanvas } from 'react-bootstrap'
import { useTheme } from '../../context/ThemeContext'
import { ADMIN_NAV, SITE } from '../../utils/constants'

const iconMap = {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Briefcase: BriefcaseBusiness,
  GraduationCap,
  User,
  FileText,
  Mail,
  Share2,
}

export default function AdminLayout() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.my_data)
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
    navigate('/admin/login', { replace: true })
  }

  const renderNavLinks = () => (
    <>
      <div className="admin-side-brand d-flex align-items-center justify-content-between">
        <Link to="/admin/dashboard" className="d-flex align-items-center gap-3 text-decoration-none">
          <div className="admin-side-logo">
            {user?.name?.slice(0, 2).toUpperCase() || 'BN'}
          </div>
          <div>
            <div className="fw-bold" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              Admin Panel
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              {user?.name || SITE.name}
            </div>
          </div>
        </Link>
      </div>

      <nav className="admin-side-nav">
        {ADMIN_NAV.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = location.pathname === item.href

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => {
                navigate(item.href)
                setShowMobileSidebar(false)
              }}
              className={`admin-side-link ${isActive ? 'admin-side-link-active' : ''}`}
            >
              {Icon && <Icon size={18} />}
              <span>{item.name}</span>
            </button>
          )
        })}
      </nav>

      <div className="admin-side-bottom">
        <Link to="/" target="_blank" className="admin-side-link">
          <ExternalLink size={17} />
          <span>View Site</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="admin-side-link admin-logout"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

        {user?.email && (
          <div className="px-3 pt-2 small text-truncate" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <Mail size={14} className="me-2" />
            {user.email}
          </div>
        )}
      </div>
    </>
  )

  return (
    <div
      className={`admin-wrapper ${isDark ? 'dark' : ''}`}
      data-bs-theme={isDark ? 'dark' : 'light'}
    >
      {/* Desktop Fixed Sidebar */}
      <aside className="admin-sidebar d-none d-lg-flex">
        {renderNavLinks()}
      </aside>

      {/* Mobile Offcanvas Drawer */}
      <Offcanvas
        show={showMobileSidebar}
        onHide={() => setShowMobileSidebar(false)}
        data-bs-theme={isDark ? 'dark' : 'light'}
        className={`${isDark ? 'dark' : ''}`}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          maxWidth: '280px',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        <Offcanvas.Header closeButton closeVariant={isDark ? 'white' : undefined}>
          <Offcanvas.Title className="fw-bold fs-6">
            Admin Workspace
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0 d-flex flex-column h-100">
          {renderNavLinks()}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Header Navbar */}
        <header className="admin-top-navbar">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-sm d-lg-none p-1 border-0"
              style={{ color: 'var(--text-primary)' }}
              onClick={() => setShowMobileSidebar(true)}
              aria-label="Toggle menu"
            >
              <Menu size={22} />
            </button>
            <span className="fw-bold d-lg-none" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              Admin Panel
            </span>
          </div>

          <div className="d-flex align-items-center gap-3 ms-auto">
            {/* Dark / Light Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-sm rounded-circle p-2"
              style={{
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
              }}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Quick Site Link */}
            <Link
              to="/"
              target="_blank"
              className="btn btn-sm d-none d-sm-inline-flex align-items-center gap-2"
              style={{
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.75rem',
                padding: '0.4rem 0.8rem',
                fontSize: '0.85rem',
              }}
            >
              <ExternalLink size={14} />
              <span>Preview Site</span>
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  )
}