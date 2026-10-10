import { useEffect, useState } from 'react'
import {
  User,
  Save,
  Image as ImageIcon,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Award,
  Upload,
} from 'lucide-react'
import { Button, Form, Row, Col, Card, Badge, InputGroup } from 'react-bootstrap'
import toast from 'react-hot-toast'
import api, { getUploadUrl } from '../../services/apis/api_config'

export default function AboutPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    professionalTitle: '',
    currentRole: '',
    location: '',
    email: '',
    phone: '',
    bio: '',
    passion: '',
    yearsExperience: 0,
    projectsCompleted: 0,
    technologiesCount: 0,
    animatedTitles: '',
    profileImage: '',
  })

  useEffect(() => {
    setFetching(true)
    api
      .get('/about')
      .then((res) => {
        const d = res.data?.data || {}
        setFormData({
          name: d.name || '',
          professionalTitle: d.professionalTitle || '',
          currentRole: d.currentRole || '',
          location: d.location || '',
          email: d.email || '',
          phone: d.phone || '',
          bio: d.bio || '',
          passion: d.passion || '',
          yearsExperience: d.yearsExperience ?? 0,
          projectsCompleted: d.projectsCompleted ?? 0,
          technologiesCount: d.technologiesCount ?? 0,
          animatedTitles: Array.isArray(d.animatedTitles)
            ? d.animatedTitles.join(', ')
            : d.animatedTitles || '',
          profileImage: d.profileImage || '',
        })
        if (d.profileImage) {
          setImagePreview(getUploadUrl(d.profileImage))
        }
      })
      .catch(() => {
        toast.error('Failed to load About profile')
      })
      .finally(() => {
        setFetching(false)
      })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        ['yearsExperience', 'projectsCompleted', 'technologiesCount'].includes(name)
          ? (value === '' ? '' : Number(value))
          : value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      return toast.error('Full Name is required')
    }

    setLoading(true)
    try {
      // Use FormData to support image upload and text fields together
      const fd = new FormData()
      fd.append('name', formData.name.trim())
      fd.append('professionalTitle', formData.professionalTitle.trim())
      fd.append('currentRole', formData.currentRole.trim())
      fd.append('location', formData.location.trim())
      fd.append('email', formData.email.trim())
      fd.append('phone', formData.phone.trim())
      fd.append('bio', formData.bio.trim())
      fd.append('passion', formData.passion.trim())
      fd.append('yearsExperience', Number(formData.yearsExperience) || 0)
      fd.append('projectsCompleted', Number(formData.projectsCompleted) || 0)
      fd.append('technologiesCount', Number(formData.technologiesCount) || 0)

      const titles = formData.animatedTitles
        ? formData.animatedTitles.split(',').map((t) => t.trim()).filter(Boolean)
        : []
      fd.append('animatedTitles', JSON.stringify(titles))

      if (imageFile) {
        fd.append('profileImage', imageFile)
      } else if (formData.profileImage) {
        fd.append('profileImage', formData.profileImage)
      }

      const res = await api.put('/about', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.data?.success) {
        toast.success('About details updated successfully!')
        if (res.data?.data?.profileImage) {
          setImagePreview(getUploadUrl(res.data.data.profileImage))
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update About profile')
    } finally {
      setLoading(false)
    }
  }

  const titlesArray = formData.animatedTitles
    ? formData.animatedTitles.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <span className="eyebrow">
            <User size={15} /> Personal Brand
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            About & Profile Settings
          </h1>
          <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
            Manage the biography, metrics, contact info, and animated hero titles seen on your homepage.
          </p>
        </div>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row className="g-4">
          {/* Left Column: Photo & Stats Preview */}
          <Col lg={4}>
            {/* Profile Avatar Card */}
            <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <Card.Body className="p-4 text-center">
                <div
                  className="mx-auto mb-3 position-relative rounded-4 overflow-hidden shadow"
                  style={{
                    width: '160px',
                    height: '160px',
                    border: '3px solid var(--color-primary)',
                    backgroundColor: 'var(--bg-secondary)',
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="w-100 h-100 d-grid place-items-center text-muted">
                      <ImageIcon size={48} className="opacity-50" />
                    </div>
                  )}
                </div>

                <h5 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {formData.name || 'Your Name'}
                </h5>
                <p className="small mb-3 text-muted">
                  {formData.professionalTitle || 'Full Stack Developer'}
                </p>

                <div className="d-grid">
                  <Form.Label
                    htmlFor="profile-image-upload"
                    className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center gap-2 mb-0"
                    style={{
                      borderRadius: '0.75rem',
                      borderColor: 'var(--border-color)',
                      cursor: 'pointer',
                    }}
                  >
                    <Upload size={15} />
                    <span>Change Profile Picture</span>
                  </Form.Label>
                  <input
                    id="profile-image-upload"
                    type="file"
                    accept="image/*"
                    className="d-none"
                    onChange={handleFileChange}
                  />
                </div>
              </Card.Body>
            </Card>

            {/* Metrics Counters Card */}
            <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
              <Card.Header
                className="bg-transparent border-bottom"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Award size={18} className="text-primary" /> Key Numbers & Highlights
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-3">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="field-label">Years of Experience</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        name="yearsExperience"
                        value={formData.yearsExperience}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="field-label">Projects Completed</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        name="projectsCompleted"
                        value={formData.projectsCompleted}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="field-label">Core Technologies Count</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        name="technologiesCount"
                        value={formData.technologiesCount}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column: Profile Details & Bio */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
              <Card.Header
                className="bg-transparent border-bottom"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div className="fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <User size={18} className="text-primary" /> General Information
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-3">
                  {/* Name */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="field-label">Full Name *</Form.Label>
                      <Form.Control
                        name="name"
                        placeholder="e.g. Bikram Nahak"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  {/* Professional Title */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="field-label">Professional Title</Form.Label>
                      <Form.Control
                        name="professionalTitle"
                        placeholder="e.g. Full Stack Developer"
                        value={formData.professionalTitle}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Current Role */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="field-label">Current Role / Status</Form.Label>
                      <Form.Control
                        name="currentRole"
                        placeholder="e.g. Full Stack Developer at Tech Inc."
                        value={formData.currentRole}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Location */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="field-label">Location</Form.Label>
                      <InputGroup>
                        <InputGroup.Text
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <MapPin size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          name="location"
                          placeholder="e.g. Bhubaneswar, India"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  {/* Email */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="field-label">Contact Email</Form.Label>
                      <InputGroup>
                        <InputGroup.Text
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <Mail size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="bikramnahak9714@gmail.com"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  {/* Phone */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="field-label">Phone Number</Form.Label>
                      <InputGroup>
                        <InputGroup.Text
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <Phone size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          name="phone"
                          placeholder="+91 9876543210"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  {/* Animated Titles (for Hero Banner Typing Effect) */}
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="field-label d-flex align-items-center gap-2">
                        <Sparkles size={16} className="text-warning" />
                        Rotating Hero Titles (comma-separated)
                      </Form.Label>
                      <Form.Control
                        name="animatedTitles"
                        placeholder="Full Stack Developer, MERN Stack Developer, React Native Developer, UI/UX Enthusiast"
                        value={formData.animatedTitles}
                        onChange={handleInputChange}
                      />
                      <div className="mt-2 d-flex flex-wrap gap-1">
                        {titlesArray.map((title, i) => (
                          <Badge
                            key={i}
                            bg="primary"
                            style={{
                              backgroundColor: 'rgba(139, 92, 246, 0.15)',
                              color: '#7c3aed',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.75rem',
                            }}
                          >
                            {title}
                          </Badge>
                        ))}
                      </div>
                    </Form.Group>
                  </Col>

                  {/* Bio */}
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="field-label">About Biography</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="bio"
                        placeholder="Write a compelling overview of who you are, what you build, and what drives you..."
                        value={formData.bio}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* Passion Statement */}
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="field-label">Passion & Philosophy</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="passion"
                        placeholder="e.g. Building scalable architectures and delightful user experiences..."
                        value={formData.passion}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>

              <Card.Footer
                className="bg-transparent border-top p-3 d-flex justify-content-end"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Button
                  type="submit"
                  disabled={loading || fetching}
                  className="action-primary border-0 d-inline-flex align-items-center gap-2 px-4 py-2"
                >
                  <Save size={18} />
                  <span>{loading ? 'Saving Changes...' : 'Save Profile Information'}</span>
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
