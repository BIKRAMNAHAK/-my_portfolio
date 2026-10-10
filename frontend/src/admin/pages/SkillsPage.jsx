import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Plus,
  Pencil,
  Trash2,
  Wrench,
  Search,
  Layers,
  ArrowUpDown,
  Tag,
} from 'lucide-react'
import { Modal, Button, Form, Row, Col, Badge, Card, Table, InputGroup } from 'react-bootstrap'
import toast from 'react-hot-toast'
import {
  addSkillAsync,
  deleteSkillAsync,
  getMySkills,
  updateSkillAsync,
} from '../../services/apis/skillsManagement'
import { SKILL_CATEGORIES } from '../../utils/constants'

export default function SkillsPage() {
  const dispatch = useDispatch()
  const { skills = [] } = useSelector((state) => state.my_skills || {})

  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const initialForm = {
    id: '',
    name: '',
    category: 'Frontend',
    icon: '',
    displayOrder: 1,
  }

  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    dispatch(getMySkills())
  }, [dispatch])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'displayOrder' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleOpenAdd = () => {
    setFormData({
      ...initialForm,
      category: selectedCategory !== 'All' ? selectedCategory : 'Frontend',
      displayOrder: skills.length + 1,
    })
    setShowModal(true)
  }

  const handleOpenEdit = (skill) => {
    setFormData({
      id: skill._id,
      name: skill.name || '',
      category: skill.category || 'Frontend',
      icon: skill.icon || '',
      displayOrder: skill.displayOrder ?? 1,
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      return toast.error('Skill name is required')
    }
    if (!formData.category) {
      return toast.error('Category is required')
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      icon: formData.icon.trim(),
      displayOrder: Number(formData.displayOrder) || 0,
    }

    setLoading(true)
    try {
      if (formData.id) {
        const res = await dispatch(updateSkillAsync(formData.id, payload))
        if (res && (res.success === true || res.success === 'true')) {
          setShowModal(false)
          dispatch(getMySkills())
        }
      } else {
        const res = await dispatch(addSkillAsync(payload))
        if (res && (res.success === true || res.success === 'true')) {
          toast.success('Skill added successfully')
          setShowModal(false)
          dispatch(getMySkills())
        }
      }
    } catch {
      toast.error('Failed to save skill')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      const res = await dispatch(deleteSkillAsync(id))
      if (res && (res.success === true || res.success === 'true')) {
        toast.success('Skill deleted successfully')
        setDeleteConfirmId(null)
        dispatch(getMySkills())
      }
    } catch {
      toast.error('Failed to delete skill')
    } finally {
      setLoading(false)
    }
  }

  const filteredSkills = skills.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <span className="eyebrow">
            <Wrench size={15} /> Technical Stack
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Skills & Capabilities
          </h1>
          <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
            Organize the technologies, frameworks, and tools you excel at.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="action-primary d-inline-flex align-items-center gap-2 border-0 px-3 py-2"
        >
          <Plus size={18} />
          <span>New Skill</span>
        </Button>
      </div>

      {/* Category Pills & Search */}
      <Card className="border-0 mb-4 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
        <Card.Body className="p-3">
          <Row className="g-3 align-items-center">
            <Col md={7}>
              <div className="d-flex flex-wrap gap-2">
                {['All', ...SKILL_CATEGORIES].map((cat) => (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedCategory === cat ? 'primary' : 'outline-secondary'}
                    className={`rounded-pill px-3 py-1 ${selectedCategory === cat ? 'action-primary border-0' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ fontSize: '0.82rem' }}
                  >
                    {cat}
                    {cat !== 'All' && (
                      <span className="ms-1 opacity-75">
                        ({skills.filter((s) => s.category === cat).length})
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            </Col>

            <Col md={5}>
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
                  placeholder="Filter skills by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Skills Table */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Icon / Identifier</th>
                <th style={{ width: '130px' }} className="text-center">Display Order</th>
                <th style={{ width: '120px' }} className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.length > 0 ? (
                filteredSkills.map((s, idx) => (
                  <tr key={s._id}>
                    <td className="fw-semibold text-muted">{idx + 1}</td>
                    <td>
                      <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                        {s.name}
                      </div>
                    </td>
                    <td>
                      <Badge
                        bg="light"
                        text="dark"
                        style={{
                          backgroundColor: 'rgba(6, 182, 212, 0.12)',
                          color: '#0891b2',
                          border: '1px solid var(--border-color)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {s.category}
                      </Badge>
                    </td>
                    <td>
                      <span className="font-monospace small text-muted">
                        {s.icon || '—'}
                      </span>
                    </td>
                    <td className="text-center fw-semibold">
                      <span
                        className="badge bg-secondary-subtle text-secondary"
                        style={{ fontSize: '0.78rem' }}
                      >
                        {s.displayOrder ?? idx + 1}
                      </span>
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
                          onClick={() => handleOpenEdit(s)}
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
                          onClick={() => setDeleteConfirmId(s._id)}
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
                    <Layers size={32} className="mb-2 opacity-50" />
                    <div>No skills matching criteria. Add a new skill above!</div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Add / Edit Skill Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        backdrop="static"
      >
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold fs-5">
              {formData.id ? 'Edit Skill' : 'Add New Skill'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4">
            <Row className="g-3">
              {/* Skill Name */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Skill Name *</Form.Label>
                  <Form.Control
                    name="name"
                    placeholder="e.g. React.js, Node.js, MongoDB"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Category */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Icon identifier */}
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="field-label">Icon Name / Class</Form.Label>
                  <Form.Control
                    name="icon"
                    placeholder="e.g. react, nodejs, SiMongodb"
                    value={formData.icon}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    Optional icon name or icon tag.
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Display Order */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="field-label">Display Order</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                  />
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
              {loading ? 'Saving...' : formData.id ? 'Save Changes' : 'Add Skill'}
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
          <Modal.Title className="fs-6 fw-bold text-danger">Delete Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this skill?
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