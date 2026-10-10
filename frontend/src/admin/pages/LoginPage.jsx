import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Form, Button, Card, InputGroup, Alert } from 'react-bootstrap'
import { userLoginAsync } from '../../services/apis/authValidation'
import Loader from '../../components/ui/Loader'
import { useTheme } from '../../context/ThemeContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isDark } = useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const success = await dispatch(userLoginAsync({ email, password }))
      if (success) {
        navigate('/admin/dashboard', { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className={`admin-login-page ${isDark ? 'dark' : ''}`}
      data-bs-theme={isDark ? 'dark' : 'light'}
    >
      {/* Decorative Orbs */}
      <div className="orb orb-one" style={{ top: '-10%', left: '-10%' }} />
      <div className="orb orb-two" style={{ bottom: '-10%', right: '-10%' }} />

      {/* Top Return Link */}
      <div className="position-absolute top-0 start-0 p-4">
        <Link
          to="/"
          className="d-inline-flex align-items-center gap-2 text-decoration-none fw-semibold"
          style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="login-shell">
        {/* Left Intro Column */}
        <div className="pe-md-4">
          <div
            className="w-12 h-12 rounded-3 gradient-bg d-inline-flex align-items-center justify-content-center text-white fw-bold fs-5 mb-4 shadow"
            style={{ width: '48px', height: '48px' }}
          >
            BN
          </div>

          <div className="eyebrow d-flex align-items-center gap-2">
            <ShieldCheck size={16} /> Private Admin Workspace
          </div>

          <h1 className="display-6 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Manage your work with clarity.
          </h1>

          <p className="lead fs-6 text-secondary mb-4">
            Update projects, technical skills, career timeline, and review direct inquiries in one centralized workspace.
          </p>

          <div
            className="d-inline-flex align-items-center gap-2 p-2 px-3 rounded-3"
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
            }}
          >
            <LockKeyhole size={15} />
            <span>Protected with JWT Authentication</span>
          </div>
        </div>

        {/* Right Form Card Column */}
        <div>
          <Card
            className="border-0 shadow-lg login-card"
            style={{ backgroundColor: 'var(--bg-card)' }}
          >
            <Card.Body className="p-4 p-sm-5">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-3 d-grid place-items-center text-primary"
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  }}
                >
                  <LockKeyhole size={20} />
                </div>
                <div>
                  <h4 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                    Admin Sign In
                  </h4>
                  <div className="small text-muted">
                    Enter your credentials to continue
                  </div>
                </div>
              </div>

              <Form onSubmit={handleSubmit}>
                {/* Email Field */}
                <Form.Group className="mb-3">
                  <Form.Label className="field-label">Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: errors.email ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Mail size={17} />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="admin@portfolio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      isInvalid={Boolean(errors.email)}
                      autoComplete="username"
                    />
                  </InputGroup>
                  {errors.email && (
                    <div className="text-danger small mt-1">{errors.email}</div>
                  )}
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-4">
                  <Form.Label className="field-label">Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: errors.password ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <LockKeyhole size={17} />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      isInvalid={Boolean(errors.password)}
                      autoComplete="current-password"
                    />
                    <Button
                      variant="outline-secondary"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        borderColor: errors.password ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </InputGroup>
                  {errors.password && (
                    <div className="text-danger small mt-1">{errors.password}</div>
                  )}
                </Form.Group>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="action-primary border-0 w-100 py-2 fs-6 fw-bold justify-content-center"
                >
                  {loading ? 'Authenticating...' : 'Sign In Securely'}
                </Button>
              </Form>

              <div
                className="mt-4 pt-3 border-top text-center small text-muted"
                style={{ borderColor: 'var(--border-color)' }}
              >
                Authorized administrators only
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </main>
  )
}