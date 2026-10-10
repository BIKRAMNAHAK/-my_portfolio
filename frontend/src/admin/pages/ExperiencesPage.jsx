import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Plus,
  Pencil,
  Trash2,
  BriefcaseBusiness,
  Search,
  Calendar,
  Building,
  CheckCircle2,
} from 'lucide-react'
import { Modal, Button, Form, Row, Col, Badge, Card, Table, InputGroup } from 'react-bootstrap'
import toast from 'react-hot-toast'
import {
  addExperienceAsync,
  deleteExperienceAsync,
  getMyExperiences,
  updateExperienceAsync,
} from '../../services/apis/experiencesManagement'

const formatDate = (dateStr) => {
  if (!dateStr) return 'Present'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const toInputDate = (dateVal) => {
  if (!dateVal) return ''
  try {
    const d = new Date(dateVal)
    return d.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

export default function ExperiencesPage() {
  const dispatch = useDispatch()
  const { experiences = [] } = useSelector((state) => state.my_experiences || {})

  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const initialForm = {
    id: '',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    technologies: '',
  }

  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    dispatch(getMyExperiences())
  }, [dispatch])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleOpenAdd = () => {
    setFormData(initialForm)
    setShowModal(true)
  }

  const handleOpenEdit = (exp) => {
    setFormData({
      id: exp._id,
      company: exp.company || '',
      position: exp.position || '',
      startDate: toInputDate(exp.startDate),
      endDate: toInputDate(exp.endDate),
      isCurrent: !exp.endDate,
      description: exp.description || '',
      technologies: Array.isArray(exp.technologies)
        ? exp.technologies.join(', ')
        : exp.technologies || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.company.trim()) {
      return toast.error('Company name is required')
    }
    if (!formData.position.trim()) {
      return toast.error('Position title is required')
    }
    if (!formData.startDate) {
      return toast.error('Start date is required')
    }

    const payload = {
      company: formData.company.trim(),
      position: formData.position.trim(),
      startDate: formData.startDate,
      endDate: formData.isCurrent ? null : (formData.endDate || null),
      description: formData.description.trim(),
      technologies: formData.technologies
        ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    }

    setLoading(true)
    try {
      if (formData.id) {
        const res = await dispatch(updateExperienceAsync(formData.id, payload))
        if (res && (res.success === true || res.success === 'true')) {
          setShowModal(false)
          dispatch(getMyExperiences())
        }
      } else {
        const res = await dispatch(addExperienceAsync(payload))
        if (res && (res.success === true || res.success === 'true')) {
          toast.success('Experience added successfully')
          setShowModal(false)
          dispatch(getMyExperiences())
        }
      }
    } catch {
      toast.error('Failed to save experience')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      const res = await dispatch(deleteExperienceAsync(id))
      if (res && (res.success === true || res.success === 'true')) {
        toast.success('Experience deleted successfully')
        setDeleteConfirmId(null)
        dispatch(getMyExperiences())
      }
    } catch {
      toast.error('Failed to delete experience')
    } finally {
      setLoading(false)
    }
  }

  const filteredExperiences = experiences.filter((exp) => {
    const q = searchTerm.toLowerCase()
    return (
      exp.company?.toLowerCase().includes(q) ||
      exp.position?.toLowerCase().includes(q) ||
      exp.description?.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <span className="eyebrow">
            <BriefcaseBusiness size={15} /> Career Timeline
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Experience & Roles
          </h1>
          <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
            Keep track of past and current positions, companies, and roles.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="action-primary d-inline-flex align-items-center gap-2 border-0 px-3 py-2"
        >
          <Plus size={18} />
          <span>New Experience</span>
        </Button>
      </div>

      {/* Search Input */}
      <Card className="border-0 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
        <Card.Body className="p-3">
          <InputGroup>
            <InputGroup.Text
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-muted)',
              }}
            >
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by company, position, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm('')}
                style={{ borderColor: 'var(--border-color)' }}
              >
                Clear
              </Button>
            )}
          </InputGroup>
        </Card.Body>
      </Card>

      {/* Experience Table */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Company</th>
                <th>Position</th>
                <th>Duration</th>
                <th>Technologies</th>
                <th style={{ width: '120px' }} className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExperiences.length > 0 ? (
                filteredExperiences.map((exp, idx) => (
                  <tr key={exp._id}>
                    <td className="fw-semibold text-muted">{idx + 1}</td>
                    <td>
                      <div className="fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Building size={16} className="text-primary" />
                        {exp.company}
                      </div>
                    </td>
                    <td>
                      <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                        {exp.position}
                      </div>
                      {exp.description && (
                        <div
                          className="small text-truncate"
                          style={{ color: 'var(--text-secondary)', maxWidth: '280px' }}
                        >
                          {exp.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="small fw-semibold" style={{ color: 'var(--text-primary)' }}>
                        {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                      </div>
                      {!exp.endDate && (
                        <Badge bg="success" className="mt-1" style={{ fontSize: '0.7rem' }}>
                          Current
                        </Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '260px' }}>
                        {Array.isArray(exp.technologies) && exp.technologies.length > 0 ? (
                          exp.technologies.map((tech, i) => (
                            <Badge
                              key={i}
                              bg="light"
                              text="dark"
                              style={{
                                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                                color: '#7c3aed',
                                border: '1px solid var(--border-color)',
                                fontSize: '0.72rem',
                              }}
                            >
                              {tech}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </div>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Button
                          variant="light"
                          size="sm"
                          className="p-1 rounded-2"
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--color-primary)',
                          }}
                          onClick={() => handleOpenEdit(exp)}
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="p-1 rounded-2"
                          style={{
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                          }}
                          onClick={() => setDeleteConfirmId(exp._id)}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <BriefcaseBusiness size={32} className="mb-2 opacity-50" />
                    <div>No experiences added yet. Click &quot;New Experience&quot; above!</div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Add / Edit Experience Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        backdrop="static"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold fs-5">
              {formData.id ? 'Edit Experience' : 'Add New Experience'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            <Row className="g-3">
              {/* Company */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">Company / Organization *</Form.Label>
                  <Form.Control
                    name="company"
                    placeholder="e.g. Google, Tech Solutions Inc."
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Position */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">Position / Job Title *</Form.Label>
                  <Form.Control
                    name="position"
                    placeholder="e.g. Senior Full Stack Developer"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Start Date */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">Start Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* End Date with Present Switch */}
              <Col md={6}>
                <Form.Group>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <Form.Label className="field-label mb-0">End Date</Form.Label>
                    <Form.Check
                      type="checkbox"
                      id="is-current-checkbox"
                      name="isCurrent"
                      label="Present (Current role)"
                      checked={formData.isCurrent}
                      onChange={handleInputChange}
                      className="small fw-semibold"
                    />
                  </div>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    disabled={formData.isCurrent}
                    placeholder={formData.isCurrent ? 'Present' : ''}
                  />
                </Form.Group>
              </Col>

              {/* Description */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Responsibilities & Achievements</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Describe your role, projects led, impact, and achievements..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              {/* Technologies */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Technologies Used (comma-separated)</Form.Label>
                  <Form.Control
                    name="technologies"
                    placeholder="React, Node.js, Express, AWS, Docker, MongoDB"
                    value={formData.technologies}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    List relevant technologies separated by commas.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={() => setShowModal(false)}
              style={{ borderRadius: '0.75rem' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="action-primary border-0"
              disabled={loading}
              style={{ borderRadius: '0.75rem' }}
            >
              {loading ? 'Saving...' : formData.id ? 'Save Changes' : 'Add Experience'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={Boolean(deleteConfirmId)}
        onHide={() => setDeleteConfirmId(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold text-danger">Delete Experience</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this experience entry?
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
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}