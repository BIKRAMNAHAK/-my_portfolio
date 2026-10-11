import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  FolderKanban,
  Wrench,
  BriefcaseBusiness,
  Mail,
  Users,
  Plus,
  ArrowUpRight,
  Sparkles,
  Inbox,
  Clock,
  Eye,
  ExternalLink,
} from 'lucide-react'
import { Row, Col, Card, Badge, Button, Table } from 'react-bootstrap'
import api from '../../services/apis/api_config'
import { checkAuthAsync } from '../../services/apis/authValidation'

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.my_data || {})

  const [stats, setStats] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(checkAuthAsync())

    setLoading(true)
    Promise.allSettled([
      api.get('/dashboard/stats'),
      api.get('/messages?limit=5'),
    ])
      .then(([statsRes, messagesRes]) => {
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data?.data || {})
        }
        if (messagesRes.status === 'fulfilled') {
          setMessages(messagesRes.value.data?.data || [])
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [dispatch])

  const statCards = [
    {
      key: 'projects',
      label: 'Total Projects',
      value: stats?.projects ?? 0,
      detail: 'Case studies & applications',
      icon: FolderKanban,
      color: 'violet',
      link: '/admin/projects',
    },
    {
      key: 'skills',
      label: 'Skills Listed',
      value: stats?.skills ?? 0,
      detail: 'Across 5 technology domains',
      icon: Wrench,
      color: 'cyan',
      link: '/admin/skills',
    },
    {
      key: 'experiences',
      label: 'Experience Milestones',
      value: stats?.experiences ?? 0,
      detail: 'Career trajectory history',
      icon: BriefcaseBusiness,
      color: 'amber',
      link: '/admin/experiences',
    },
    {
      key: 'messages',
      label: 'Contact Enquiries',
      value: stats?.messages ?? 0,
      detail: `${stats?.unreadMessages ?? 0} unread requiring reply`,
      icon: Mail,
      color: 'rose',
      link: '/admin/messages',
    },
  ]

  return (
    <div>
      {/* Hero Welcome Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <span className="eyebrow">
            <Sparkles size={15} /> Admin Workspace
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Welcome back, {user?.name || 'Bikram'}!
          </h1>
          <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
            Overview of your portfolio activity, project case studies, and incoming inquiries.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/projects" className="action-primary border-0 px-3 py-2 text-decoration-none">
            <Plus size={17} />
            <span>New Project</span>
          </Link>
          <Link to="/" target="_blank" className="action-secondary px-3 py-2 text-decoration-none">
            <ExternalLink size={16} />
            <span>View Site</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <Row className="g-3 mb-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Col sm={6} xl={3} key={card.key}>
              <Card
                className={`border-0 shadow-sm h-100 dashboard-stat stat-${card.color}`}
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <Card.Body className="p-4 d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="stat-icon">
                      <Icon size={22} />
                    </div>
                    <Link
                      to={card.link}
                      className="text-muted hover-underline"
                      title={`Manage ${card.label}`}
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>

                  <div>
                    <div className="stat-value" style={{ color: 'var(--text-primary)' }}>
                      {loading ? '...' : card.value}
                    </div>
                    <div className="stat-label">{card.label}</div>
                    <div className="stat-detail">{card.detail}</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      {/* Two Column Layout: Inbox Summary & Traffic Analytics */}
      <Row className="g-4 mb-4">
        {/* Inbox Quick Overview */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--bg-card)' }}>
            <Card.Header
              className="bg-transparent border-bottom p-3 d-flex justify-content-between align-items-center"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Inbox size={18} className="text-primary" /> Recent Enquiries
              </div>
              <Link to="/admin/messages" className="small text-decoration-none fw-semibold" style={{ color: 'var(--color-primary)' }}>
                View All Messages
              </Link>
            </Card.Header>

            <Card.Body className="p-0">
              {messages.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <tbody>
                      {messages.map((m) => (
                        <tr key={m._id}>
                          <td style={{ width: '48px', paddingLeft: '1.25rem' }}>
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small"
                              style={{
                                width: '34px',
                                height: '34px',
                                minWidth: '34px',
                                backgroundColor: m.status === 'unread' ? '#7c3aed' : '#94a3b8',
                              }}
                            >
                              {m.name?.slice(0, 1).toUpperCase()}
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold small" style={{ color: 'var(--text-primary)' }}>
                              {m.name}
                            </div>
                            <div className="text-muted small text-truncate" style={{ maxWidth: '280px' }}>
                              {m.subject} &bull; {m.message}
                            </div>
                          </td>
                          <td className="text-end" style={{ paddingRight: '1.25rem' }}>
                            {m.status === 'unread' ? (
                              <Badge bg="danger" style={{ fontSize: '0.7rem' }}>
                                Unread
                              </Badge>
                            ) : (
                              <span className="text-muted small">Read</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="p-4 text-center text-muted">
                  <Mail size={32} className="opacity-50 mb-2" />
                  <p className="small mb-0">No messages received yet.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Traffic & Quick Actions */}
        <Col lg={5}>
          <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
            <Card.Header
              className="bg-transparent border-bottom p-3 d-flex justify-content-between align-items-center"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Users size={18} className="text-primary" /> Traffic & Engagement
              </div>
            </Card.Header>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <div className="text-muted small">Total Unique Visitors</div>
                  <h2 className="fw-bold mb-0" style={{ color: 'var(--color-primary)' }}>
                    {stats?.visitors ?? 0}
                  </h2>
                </div>
                <div className="text-end">
                  <div className="text-muted small">Today&apos;s Visits</div>
                  <h4 className="fw-semibold mb-0" style={{ color: 'var(--text-primary)' }}>
                    {stats?.todayVisitors ?? 0}
                  </h4>
                </div>
              </div>
              <p className="small text-muted mb-0">
                Visitor metrics automatically log visits to your live portfolio.
              </p>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
            <Card.Header
              className="bg-transparent border-bottom p-3"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                Quick Shortcuts
              </div>
            </Card.Header>
            <Card.Body className="p-3 d-flex flex-column gap-2">
              <Link
                to="/admin/projects"
                className="btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center p-2 rounded-3"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <span>Add new project case study</span>
                <ArrowUpRight size={15} />
              </Link>
              <Link
                to="/admin/skills"
                className="btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center p-2 rounded-3"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <span>Add new technical skill</span>
                <ArrowUpRight size={15} />
              </Link>
              <Link
                to="/admin/experiences"
                className="btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center p-2 rounded-3"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <span>Update career experience</span>
                <ArrowUpRight size={15} />
              </Link>
              <Link
                to="/admin/about"
                className="btn btn-sm btn-outline-secondary text-start d-flex justify-content-between align-items-center p-2 rounded-3"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              >
                <span>Edit bio & animated titles</span>
                <ArrowUpRight size={15} />
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}