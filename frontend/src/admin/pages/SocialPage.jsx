import { useEffect, useState } from 'react'
import {
  Share2,
  Save,
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  ExternalLink,
} from 'lucide-react'
import { Button, Form, Row, Col, Card, InputGroup } from 'react-bootstrap'
import toast from 'react-hot-toast'
import api from '../../services/apis/api_config'

export default function SocialPage() {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [formData, setFormData] = useState({
    github: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    twitter: '',
    email: '',
  })

  useEffect(() => {
    setFetching(true)
    api
      .get('/social')
      .then((res) => {
        const d = res.data?.data || {}
        setFormData({
          github: d.github || '',
          linkedin: d.linkedin || '',
          instagram: d.instagram || '',
          facebook: d.facebook || '',
          twitter: d.twitter || '',
          email: d.email || '',
        })
      })
      .catch(() => {
        toast.error('Failed to load social links')
      })
      .finally(() => {
        setFetching(false)
      })
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await api.put('/social', formData)
      if (res.data?.success) {
        toast.success('Social links updated successfully!')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update social links')
    } finally {
      setLoading(false)
    }
  }

  const socialFields = [
    {
      name: 'github',
      label: 'GitHub Profile URL',
      icon: Github,
      placeholder: 'https://github.com/bikramnahak',
    },
    {
      name: 'linkedin',
      label: 'LinkedIn Profile URL',
      icon: Linkedin,
      placeholder: 'https://linkedin.com/in/bikramnahak',
    },
    {
      name: 'twitter',
      label: 'X / Twitter Profile URL',
      icon: Twitter,
      placeholder: 'https://twitter.com/bikramnahak',
    },
    {
      name: 'instagram',
      label: 'Instagram Profile URL',
      icon: Instagram,
      placeholder: 'https://instagram.com/bikramnahak',
    },
    {
      name: 'facebook',
      label: 'Facebook Profile URL',
      icon: Facebook,
      placeholder: 'https://facebook.com/bikramnahak',
    },
    {
      name: 'email',
      label: 'Direct Email Address',
      icon: Mail,
      placeholder: 'bikramnahak9714@gmail.com',
    },
  ]

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <span className="eyebrow">
            <Share2 size={15} /> Social Presence
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Social Media & Contact Links
          </h1>
          <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
            Configure your public profile links displayed in the footer and hero sections.
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--bg-card)', maxWidth: '900px' }}>
        <Form onSubmit={handleSubmit}>
          <Card.Body className="p-4">
            <Row className="g-4">
              {socialFields.map(({ name, label, icon: Icon, placeholder }) => (
                <Col md={6} key={name}>
                  <Form.Group>
                    <Form.Label className="field-label d-flex align-items-center gap-2">
                      <Icon size={16} className="text-primary" />
                      {label}
                    </Form.Label>
                    <InputGroup>
                      <Form.Control
                        name={name}
                        type={name === 'email' ? 'email' : 'url'}
                        placeholder={placeholder}
                        value={formData[name]}
                        onChange={handleInputChange}
                      />
                      {formData[name] && (
                        <Button
                          variant="outline-secondary"
                          as="a"
                          href={name === 'email' ? `mailto:${formData[name]}` : formData[name]}
                          target="_blank"
                          rel="noreferrer"
                          title="Test Link"
                          style={{
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          <ExternalLink size={15} />
                        </Button>
                      )}
                    </InputGroup>
                  </Form.Group>
                </Col>
              ))}
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
              <span>{loading ? 'Saving Changes...' : 'Save Social Links'}</span>
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </div>
  )
}
