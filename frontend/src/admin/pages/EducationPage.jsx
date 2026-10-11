import { useEffect, useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  GraduationCap,
  Search,
  Calendar,
  Building,
  Award,
  BookOpen,
} from 'lucide-react'
import { Modal, Button, Form, Row, Col, Badge, Card, Table, InputGroup } from 'react-bootstrap'
import toast from 'react-hot-toast'
import api from '../../services/apis/api_config'

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

export default function EducationPage() {
  const [educationList, setEducationList] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const initialForm = {
    id: '',
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false,
    grade: '',
    description: '',
  }

  const [formData, setFormData] = useState(initialForm)

  const fetchEducation = async () => {
    setLoading(true)
    try {
      const res = await api.get('/education')
      setEducationList(res.data?.data || [])
    } catch {
      toast.error('Failed to load education qualifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEducation()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const openAddModal = () => {
    setFormData(initialForm)
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setFormData({
      id: item._id,
      institution: item.institution || '',
      degree: item.degree || '',
      fieldOfStudy: item.fieldOfStudy || '',
      startDate: toInputDate(item.startDate),
      endDate: toInputDate(item.endDate),
      current: Boolean(item.current),
      grade: item.grade || '',
      description: item.description || '',
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.institution.trim()) {
      return toast.error('Institution / College name is required')
    }
    if (!formData.degree.trim()) {
      return toast.error('Degree / Qualification is required')
    }
    if (!formData.startDate) {
      return toast.error('Start date is required')
    }
    if (!formData.current && !formData.endDate) {
      return toast.error('End date is required (or check "Currently studying")')
    }

    setSaving(true)
    try {
      const payload = {
        institution: formData.institution.trim(),
        degree: formData.degree.trim(),
        fieldOfStudy: formData.fieldOfStudy.trim(),
        startDate: formData.startDate,
        endDate: formData.current ? null : formData.endDate,
        current: formData.current,
        grade: formData.grade.trim(),
        description: formData.description.trim(),
      }

      if (formData.id) {
        await api.put(`/education/${formData.id}`, payload)
        toast.success('Qualification updated successfully!')
      } else {
        await api.post('/education', payload)
        toast.success('Qualification added successfully!')
      }

      setShowModal(false)
      fetchEducation()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save qualification')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/education/${id}`)
      toast.success('Qualification deleted successfully')
      setDeleteConfirmId(null)
      fetchEducation()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete qualification')
    }
  }

  const filtered = educationList.filter(
    (e) =>
      e.degree?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.institution?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.fieldOfStudy?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <span className="eyebrow">
            <GraduationCap size={15} /> Academic Background
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Education & Qualifications
          </h1>
          <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
            Manage your degrees, certifications, schooling, and academic milestones shown on your portfolio.
          </p>
        </div>

        <Button
          onClick={openAddModal}
          className="action-primary border-0 d-inline-flex align-items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Qualification</span>
        </Button>
      </div>

      {/* Main Card with Search and Table */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
        <Card.Header
          className="bg-transparent border-bottom p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>
              All Qualifications
            </span>
            <Badge bg="primary" pill>
              {educationList.length}
            </Badge>
          </div>

          <div style={{ maxWidth: '320px', width: '100%' }}>
            <InputGroup size="sm">
              <InputGroup.Text
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-muted)',
                }}
              >
                <Search size={14} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by degree or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              />
            </InputGroup>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary spinner-border-sm me-2" role="status" />
              <span className="text-muted small">Loading academic qualifications...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5">
              <GraduationCap size={48} className="text-muted opacity-50 mb-3" />
              <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                {searchTerm ? 'No matching qualifications found' : 'No qualifications added yet'}
              </h5>
              <p className="text-muted small mb-3">
                {searchTerm
                  ? 'Try searching with different keywords.'
                  : 'Click the button below to add your degree, diploma, or school qualification.'}
              </p>
              {!searchTerm && (
                <Button onClick={openAddModal} variant="outline-primary" size="sm">
                  <Plus size={16} className="me-1" /> Add Your First Degree
                </Button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)',
                  }}
                >
                  <tr className="small text-muted">
                    <th style={{ paddingLeft: '1.25rem' }}>Degree & Field</th>
                    <th>Institution / Board</th>
                    <th>Duration</th>
                    <th>Score / Grade</th>
                    <th className="text-end" style={{ paddingRight: '1.25rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item._id} style={{ borderColor: 'var(--border-color)' }}>
                      <td style={{ paddingLeft: '1.25rem' }}>
                        <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                          {item.degree}
                        </div>
                        {item.fieldOfStudy && (
                          <div className="small text-muted d-flex align-items-center gap-1">
                            <BookOpen size={12} />
                            <span>{item.fieldOfStudy}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Building size={15} className="text-primary flex-shrink-0" />
                          <span className="small fw-semibold" style={{ color: 'var(--text-secondary)' }}>
                            {item.institution}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="small d-flex align-items-center gap-1 text-muted">
                          <Calendar size={13} />
                          <span>
                            {formatDate(item.startDate)} &mdash;{' '}
                            {item.current ? (
                              <Badge bg="success" className="ms-1">Pursuing</Badge>
                            ) : (
                              formatDate(item.endDate)
                            )}
                          </span>
                        </div>
                      </td>
                      <td>
                        {item.grade ? (
                          <Badge bg="info" className="text-dark fw-bold">
                            <Award size={12} className="me-1" />
                            {item.grade}
                          </Badge>
                        ) : (
                          <span className="text-muted small">&mdash;</span>
                        )}
                      </td>
                      <td className="text-end" style={{ paddingRight: '1.25rem' }}>
                        <div className="d-inline-flex gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="p-1 px-2 border-0"
                            onClick={() => openEditModal(item)}
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="p-1 px-2 border-0"
                            onClick={() => setDeleteConfirmId(item._id)}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add / Edit Qualification Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
        data-bs-theme="dark"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            <Modal.Title className="h5 fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <GraduationCap className="text-primary" size={20} />
              <span>{formData.id ? 'Edit Qualification' : 'Add New Qualification'}</span>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Degree / Course Name *</Form.Label>
                  <Form.Control
                    name="degree"
                    placeholder="e.g. B.Tech in Computer Science, BCA, 12th Science"
                    value={formData.degree}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Institution / College / University *</Form.Label>
                  <Form.Control
                    name="institution"
                    placeholder="e.g. Berhampur University, NIST, CBSE"
                    value={formData.institution}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={7}>
                <Form.Group>
                  <Form.Label className="field-label">Field of Study / Stream</Form.Label>
                  <Form.Control
                    name="fieldOfStudy"
                    placeholder="e.g. Computer Science, Science, PCM"
                    value={formData.fieldOfStudy}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={5}>
                <Form.Group>
                  <Form.Label className="field-label">Grade / CGPA / %</Form.Label>
                  <Form.Control
                    name="grade"
                    placeholder="e.g. 8.6 CGPA, 85%"
                    value={formData.grade}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

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

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">End Date (Passing Year)</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    disabled={formData.current}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  id="current-checkbox"
                  label="I am currently pursuing this degree"
                  name="current"
                  checked={formData.current}
                  onChange={handleInputChange}
                  className="small text-secondary"
                />
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Details / Key Achievements (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Relevant coursework, academic projects, honors, societies, etc."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
            <Button variant="secondary" size="sm" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={saving}>
              {saving ? 'Saving...' : formData.id ? 'Save Changes' : 'Add Qualification'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={Boolean(deleteConfirmId)}
        onHide={() => setDeleteConfirmId(null)}
        centered
        data-bs-theme="dark"
      >
        <Modal.Header closeButton style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <Modal.Title className="h6 fw-bold text-danger">Delete Qualification?</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--bg-secondary)' }}>
          Are you sure you want to delete this educational record? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <Button variant="secondary" size="sm" onClick={() => setDeleteConfirmId(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirmId)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
