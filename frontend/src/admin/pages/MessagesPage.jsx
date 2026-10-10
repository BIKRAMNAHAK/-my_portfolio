import { useEffect, useState } from 'react'
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Search,
  Phone,
  Calendar,
  Clock,
  User,
  CheckCircle,
  Inbox,
  AlertCircle,
} from 'lucide-react'
import { Button, Form, Card, Badge, Row, Col, InputGroup, Modal } from 'react-bootstrap'
import toast from 'react-hot-toast'
import api from '../../services/apis/api_config'

export default function MessagesPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all') // 'all', 'unread', 'read'
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const loadMessages = () => {
    setLoading(true)
    api
      .get('/messages?limit=100')
      .then((r) => setMessages(r.data?.data || []))
      .catch(() => toast.error('Could not load messages'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadMessages()
  }, [])

  const handleUpdateStatus = async (m, newStatus) => {
    try {
      await api.put(`/messages/${m._id}`, { status: newStatus })
      toast.success(`Message marked as ${newStatus}`)
      loadMessages()
    } catch {
      toast.error('Failed to update message status')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/messages/${id}`)
      toast.success('Message deleted')
      setDeleteConfirmId(null)
      if (selectedMessage?._id === id) {
        setSelectedMessage(null)
      }
      loadMessages()
    } catch {
      toast.error('Failed to delete message')
    }
  }

  const filteredMessages = messages.filter((m) => {
    const matchesStatus =
      filterStatus === 'all' ? true : m.status === filterStatus

    const q = searchTerm.toLowerCase()
    const matchesSearch =
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q) ||
      m.phone?.toLowerCase().includes(q)

    return matchesStatus && matchesSearch
  })

  const unreadCount = messages.filter((m) => m.status === 'unread').length

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <span className="eyebrow">
            <Mail size={15} /> Communications
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Contact Enquiries & Inbox
          </h1>
          <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
            Read, manage, and reply to client inquiries sent via your portfolio contact form.
          </p>
        </div>

        {unreadCount > 0 && (
          <Badge bg="danger" className="p-2 fs-6 d-inline-flex align-items-center gap-1">
            <Inbox size={16} /> {unreadCount} Unread Message{unreadCount > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Filter Tabs and Search Bar */}
      <Card className="border-0 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
        <Card.Body className="p-3">
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <div className="d-flex gap-2">
                <Button
                  size="sm"
                  variant={filterStatus === 'all' ? 'primary' : 'outline-secondary'}
                  className={`rounded-pill px-3 ${filterStatus === 'all' ? 'action-primary border-0' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All ({messages.length})
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === 'unread' ? 'primary' : 'outline-secondary'}
                  className={`rounded-pill px-3 ${filterStatus === 'unread' ? 'action-primary border-0' : ''}`}
                  onClick={() => setFilterStatus('unread')}
                >
                  Unread ({unreadCount})
                </Button>
                <Button
                  size="sm"
                  variant={filterStatus === 'read' ? 'primary' : 'outline-secondary'}
                  className={`rounded-pill px-3 ${filterStatus === 'read' ? 'action-primary border-0' : ''}`}
                  onClick={() => setFilterStatus('read')}
                >
                  Read ({messages.length - unreadCount})
                </Button>
              </div>
            </Col>

            <Col md={6}>
              <InputGroup size="sm">
                <InputGroup.Text
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Search size={15} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search sender, email, subject, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Message Cards List */}
      <div className="d-flex flex-column gap-3">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((m) => (
            <Card
              key={m._id}
              className={`border-0 shadow-sm transition ${
                m.status === 'unread' ? 'border-start border-4 border-primary' : ''
              }`}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '1rem',
              }}
            >
              <Card.Body className="p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
                  {/* Sender Details */}
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                      <span className="fw-bold fs-6" style={{ color: 'var(--text-primary)' }}>
                        {m.name}
                      </span>
                      <span className="small text-muted">&bull;</span>
                      <a
                        href={`mailto:${m.email}`}
                        className="small text-decoration-none"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {m.email}
                      </a>
                      {m.phone && (
                        <>
                          <span className="small text-muted">&bull;</span>
                          <a
                            href={`tel:${m.phone}`}
                            className="small text-muted text-decoration-none d-inline-flex align-items-center gap-1"
                          >
                            <Phone size={13} /> {m.phone}
                          </a>
                        </>
                      )}
                      {m.status === 'unread' ? (
                        <Badge bg="danger" className="ms-md-2" style={{ fontSize: '0.68rem' }}>
                          Unread
                        </Badge>
                      ) : (
                        <Badge bg="secondary-subtle" text="secondary" className="ms-md-2" style={{ fontSize: '0.68rem' }}>
                          Read
                        </Badge>
                      )}
                    </div>

                    <h6 className="fw-bold mb-2 mt-2" style={{ color: 'var(--text-primary)' }}>
                      {m.subject}
                    </h6>

                    <p
                      className="mb-2 text-secondary"
                      style={{
                        lineHeight: '1.6',
                        fontSize: '0.92rem',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {m.message}
                    </p>

                    <div className="small text-muted d-flex align-items-center gap-1 mt-2">
                      <Clock size={13} />
                      {m.createdAt ? new Date(m.createdAt).toLocaleString() : 'Recent'}
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="d-flex align-items-center gap-2 pt-2 pt-md-0 border-top border-md-0">
                    {/* Reply via Email */}
                    <a
                      href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                      className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 rounded-pill px-3"
                      title="Reply via Email"
                    >
                      <Reply size={15} />
                      <span>Reply</span>
                    </a>

                    {/* Mark Read/Unread */}
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="rounded-pill p-2"
                      title={m.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}
                      onClick={() =>
                        handleUpdateStatus(m, m.status === 'read' ? 'unread' : 'read')
                      }
                    >
                      <MailOpen size={16} />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill p-2"
                      title="Delete Message"
                      onClick={() => setDeleteConfirmId(m._id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <Card className="border-0 shadow-sm p-5 text-center text-muted" style={{ backgroundColor: 'var(--bg-card)' }}>
            <Inbox size={42} className="mx-auto mb-3 opacity-50" />
            <h5>No messages found</h5>
            <p className="small mb-0">Messages sent through your portfolio contact form will arrive here.</p>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={Boolean(deleteConfirmId)}
        onHide={() => setDeleteConfirmId(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold text-danger">Delete Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to permanently delete this message?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setDeleteConfirmId(null)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(deleteConfirmId)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}