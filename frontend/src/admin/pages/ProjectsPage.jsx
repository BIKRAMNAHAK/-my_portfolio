import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  XCircle,
  FolderKanban,
  Star,
  Github,
  Globe,
  Image as ImageIcon,
  Upload,
} from 'lucide-react'
import { Modal, Button, Form, Row, Col, Badge, Card, Table, InputGroup } from 'react-bootstrap'
import toast from 'react-hot-toast'
import Loader from '../../components/ui/Loader'
import {
  addProjectAsync,
  deleteProjectAsync,
  getMyprojects,
  updateProjectAsync,
} from '../../services/apis/projectsManagement'
import { getUploadUrl } from '../../services/apis/api_config'
import { compressImageToBase64 } from '../../utils/imageCompressor'

export default function ProjectsPage() {
  const dispatch = useDispatch()
  const { projects = [] } = useSelector((state) => state.my_projects || {})

  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const initialForm = {
    id: '',
    title: '',
    description: '',
    detailedDescription: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    image: '',
    features: '',
    challenges: '',
    solutions: '',
    featured: false,
  }

  const [formData, setFormData] = useState(initialForm)

  useEffect(() => {
    dispatch(getMyprojects())
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

  const handleOpenEdit = (project) => {
    setFormData({
      id: project._id,
      title: project.title || '',
      description: project.description || '',
      detailedDescription: project.detailedDescription || '',
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(', ')
        : project.technologies || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      image: project.image || '',
      features: Array.isArray(project.features)
        ? project.features.join('\n')
        : project.features || '',
      challenges: project.challenges || '',
      solutions: project.solutions || '',
      featured: Boolean(project.featured),
    })
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      return toast.error('Project title is required')
    }
    if (!formData.description.trim()) {
      return toast.error('Project description is required')
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      detailedDescription: formData.detailedDescription.trim(),
      technologies: formData.technologies
        ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      features: formData.features
        ? formData.features.split('\n').map((f) => f.trim()).filter(Boolean)
        : [],
      challenges: formData.challenges.trim(),
      solutions: formData.solutions.trim(),
      githubUrl: formData.githubUrl.trim(),
      liveUrl: formData.liveUrl.trim(),
      image: formData.image.trim(),
      featured: formData.featured,
    }

    setLoading(true)
    try {
      if (formData.id) {
        const res = await dispatch(updateProjectAsync(formData.id, payload))
        if (res && (res.success === true || res.success === 'true')) {
          toast.success('Project updated successfully')
          setShowModal(false)
          dispatch(getMyprojects())
        }
      } else {
        const res = await dispatch(addProjectAsync(payload))
        if (res && (res.success === true || res.success === 'true')) {
          toast.success('Project added successfully')
          setShowModal(false)
          dispatch(getMyprojects())
        }
      }
    } catch (err) {
      toast.error('An error occurred while saving the project')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    setLoading(true)
    try {
      const res = await dispatch(deleteProjectAsync(id))
      if (res && (res.success === true || res.success === 'true')) {
        toast.success('Project deleted successfully')
        setDeleteConfirmId(null)
        dispatch(getMyprojects())
      }
    } catch {
      toast.error('Failed to delete project')
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter((p) => {
    const q = searchTerm.toLowerCase()
    const titleMatch = p.title?.toLowerCase().includes(q)
    const descMatch = p.description?.toLowerCase().includes(q)
    const techMatch = Array.isArray(p.technologies) && p.technologies.some((t) => t.toLowerCase().includes(q))
    return titleMatch || descMatch || techMatch
  })

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <span className="eyebrow">
            <FolderKanban size={15} /> Portfolio Showcase
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Project Management
          </h1>
          <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
            Add, update, or showcase your works with live demos and repository links.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="action-primary d-inline-flex align-items-center gap-2 border-0 px-3 py-2"
        >
          <Plus size={18} />
          <span>New Project</span>
        </Button>
      </div>

      {/* Search and Filters */}
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
              placeholder="Search by project name, description, or technology..."
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

      {/* Projects Table */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Project Title</th>
                <th>Technologies</th>
                <th style={{ width: '110px' }} className="text-center">Featured</th>
                <th>Links</th>
                <th style={{ width: '120px' }} className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((p, idx) => (
                  <tr key={p._id}>
                    <td className="fw-semibold text-muted">{idx + 1}</td>
                    <td>
                      <div className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                        {p.title}
                      </div>
                      <div
                        className="small text-truncate"
                        style={{ color: 'var(--text-secondary)', maxWidth: '300px' }}
                      >
                        {p.description}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '320px' }}>
                        {Array.isArray(p.technologies) && p.technologies.length > 0
                          ? p.technologies.map((tech, i) => (
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
                          : <span className="text-muted small">-</span>}
                      </div>
                    </td>
                    <td className="text-center">
                      {p.featured ? (
                        <Badge
                          bg="warning"
                          text="dark"
                          className="d-inline-flex align-items-center gap-1"
                        >
                          <Star size={12} fill="currentColor" /> Yes
                        </Badge>
                      ) : (
                        <span className="text-muted small">No</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2 align-items-center">
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="social-button"
                            style={{ width: '2rem', height: '2rem' }}
                            title="GitHub Repo"
                          >
                            <Github size={14} />
                          </a>
                        )}
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="social-button"
                            style={{ width: '2rem', height: '2rem' }}
                            title="Live Demo"
                          >
                            <Globe size={14} />
                          </a>
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
                          onClick={() => handleOpenEdit(p)}
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
                          onClick={() => setDeleteConfirmId(p._id)}
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
                    <FolderKanban size={32} className="mb-2 opacity-50" />
                    <div>No projects found. Add one above!</div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Add / Edit Project Modal */}
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
              {formData.id ? 'Edit Project' : 'Add New Project'}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="p-4" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            <Row className="g-3">
              {/* Project Title */}
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="field-label">Project Title *</Form.Label>
                  <Form.Control
                    name="title"
                    placeholder="e.g. Full-Stack E-Commerce Platform"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Featured toggle */}
              <Col md={4} className="d-flex align-items-center pt-md-4">
                <Form.Check
                  type="switch"
                  id="featured-switch"
                  name="featured"
                  label="Featured on Homepage"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="fw-semibold"
                />
              </Col>

              {/* Short Description */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Short Description *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="description"
                    placeholder="Brief 1-2 sentence overview shown in project cards..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* Detailed Description */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Detailed Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="detailedDescription"
                    placeholder="In-depth explanation of the project, architecture, goals..."
                    value={formData.detailedDescription}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              {/* Technologies */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Technologies (comma-separated)</Form.Label>
                  <Form.Control
                    name="technologies"
                    placeholder="React, Node.js, Express, MongoDB, Redux, Bootstrap"
                    value={formData.technologies}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    Separate tech stack items using commas.
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* GitHub URL */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">GitHub Repository URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="githubUrl"
                    placeholder="https://github.com/username/project"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              {/* Live Demo URL */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">Live Demo URL</Form.Label>
                  <Form.Control
                    type="url"
                    name="liveUrl"
                    placeholder="https://myproject.dev"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              {/* Image URL & Upload */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label d-flex justify-content-between align-items-center">
                    <span>Project Image / Banner</span>
                    <label
                      htmlFor="project-img-upload"
                      className="btn btn-xs btn-outline-primary py-0 px-2 small mb-0 d-inline-flex align-items-center gap-1"
                      style={{ cursor: 'pointer', fontSize: '0.78rem' }}
                    >
                      <Upload size={13} />
                      <span>Upload from Device</span>
                    </label>
                  </Form.Label>
                  <input
                    id="project-img-upload"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={async (e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const loadToast = toast.loading('Optimizing project image...')
                        try {
                          const base64 = await compressImageToBase64(file, 900, 0.85)
                          toast.dismiss(loadToast)
                          setFormData((prev) => ({ ...prev, image: base64 }))
                          toast.success('Project image ready!')
                        } catch {
                          toast.dismiss(loadToast)
                          toast.error('Failed to process image')
                        }
                      }
                    }}
                  />
                  <Form.Control
                    name="image"
                    placeholder="https://images.unsplash.com/... or uploaded Base64 image"
                    value={formData.image?.startsWith('data:') ? '(Uploaded Device Image)' : formData.image}
                    onChange={handleInputChange}
                  />
                  {formData.image && (
                    <div className="mt-2 rounded-3 overflow-hidden border" style={{ maxHeight: '120px' }}>
                      <img
                        src={getUploadUrl(formData.image)}
                        alt="Project preview"
                        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </Form.Group>
              </Col>

              {/* Key Features */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="field-label">Key Features (one per line)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="features"
                    placeholder="User authentication with JWT&#10;Stripe payment gateway&#10;Real-time inventory updates"
                    value={formData.features}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              {/* Challenges */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">Technical Challenges Faced</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="challenges"
                    placeholder="Handling concurrent transactions and high traffic loads..."
                    value={formData.challenges}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              {/* Solutions */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="field-label">Solutions Implemented</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="solutions"
                    placeholder="Optimistic locking, Redis caching, and indexed queries..."
                    value={formData.solutions}
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
              {loading ? 'Saving...' : formData.id ? 'Save Changes' : 'Create Project'}
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
          <Modal.Title className="fs-6 fw-bold text-danger">Delete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this project? This action cannot be undone.
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