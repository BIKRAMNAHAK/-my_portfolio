import { useEffect, useState } from 'react'
import {
  FileText,
  UploadCloud,
  Trash2,
  CheckCircle2,
  ExternalLink,
  FileUp,
  Download,
  AlertCircle,
} from 'lucide-react'
import { Button, Form, Card, Table, Badge, Row, Col, Alert, Modal } from 'react-bootstrap'
import toast from 'react-hot-toast'
import api, { getUploadUrl } from '../../services/apis/api_config'

export default function ResumePage() {
  const [items, setItems] = useState([])
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const loadResumes = () => {
    api
      .get('/resumes')
      .then((r) => setItems(r.data?.data || []))
      .catch(() => toast.error('Could not load resumes'))
  }

  useEffect(() => {
    loadResumes()
  }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) {
      return toast.error('Please choose a PDF or document file first')
    }

    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('resume', file)

      const res = await api.post('/resumes', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.data?.success) {
        toast.success('Resume uploaded successfully!')
        setFile(null)
        // Reset file input element
        const fileInput = document.getElementById('resume-file-input')
        if (fileInput) fileInput.value = ''
        loadResumes()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  const handleSetActive = async (id) => {
    try {
      await api.put(`/resumes/${id}`)
      toast.success('Active resume updated!')
      loadResumes()
    } catch {
      toast.error('Failed to set active resume')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/resumes/${id}`)
      toast.success('Resume deleted')
      setDeleteConfirmId(null)
      loadResumes()
    } catch {
      toast.error('Failed to delete resume')
    }
  }

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <span className="eyebrow">
            <FileText size={15} /> Document Manager
          </span>
          <h1 className="h3 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Resume Management
          </h1>
          <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
            Upload new versions of your resume (PDF/DOC) and choose which version is published.
          </p>
        </div>
      </div>

      {/* Upload Card */}
      <Card className="border-0 shadow-sm mb-4" style={{ backgroundColor: 'var(--bg-card)' }}>
        <Card.Body className="p-4">
          <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <FileUp size={20} className="text-primary" /> Upload New Resume
          </h5>

          <Form onSubmit={handleUpload}>
            <Row className="g-3 align-items-end">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="field-label">Select PDF or Document</Form.Label>
                  <Form.Control
                    id="resume-file-input"
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <Form.Text className="text-muted">
                    Accepted formats: PDF, DOC, DOCX (Max 10MB).
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Button
                  type="submit"
                  disabled={busy || !file}
                  className="action-primary border-0 w-100 d-inline-flex align-items-center justify-content-center gap-2 py-2"
                >
                  <UploadCloud size={18} />
                  <span>{busy ? 'Uploading...' : 'Upload File'}</span>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Resumes List Table */}
      <Card className="border-0 shadow-sm" style={{ backgroundColor: 'var(--bg-card)' }}>
        <Card.Header
          className="bg-transparent border-bottom p-3 d-flex justify-content-between align-items-center"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>
            Available Resumes ({items.length})
          </span>
        </Card.Header>

        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>File Name</th>
                <th>Status</th>
                <th>Uploaded Date</th>
                <th style={{ width: '200px' }} className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, idx) => (
                  <tr key={item._id}>
                    <td className="fw-semibold text-muted">{idx + 1}</td>
                    <td>
                      <div className="fw-bold d-flex align-items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <FileText size={18} className="text-primary" />
                        <a
                          href={getUploadUrl(item.path)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-decoration-none hover-underline"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {item.originalName}
                        </a>
                      </div>
                    </td>
                    <td>
                      {item.isActive ? (
                        <Badge
                          bg="success"
                          className="d-inline-flex align-items-center gap-1"
                        >
                          <CheckCircle2 size={12} /> Active on Site
                        </Badge>
                      ) : (
                        <span className="text-muted small">Inactive</span>
                      )}
                    </td>
                    <td className="small text-muted">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end align-items-center gap-2">
                        {!item.isActive && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-pill px-3"
                            onClick={() => handleSetActive(item._id)}
                            style={{ fontSize: '0.78rem' }}
                          >
                            Set Active
                          </Button>
                        )}
                        <a
                          href={getUploadUrl(item.path)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-light p-1 rounded-2"
                          style={{
                            backgroundColor: 'transparent',
                            color: 'var(--color-primary)',
                          }}
                          title="Preview / Download"
                        >
                          <Download size={16} />
                        </a>
                        <Button
                          variant="light"
                          size="sm"
                          className="p-1 rounded-2"
                          style={{
                            backgroundColor: 'transparent',
                            color: '#ef4444',
                          }}
                          onClick={() => setDeleteConfirmId(item._id)}
                          title="Delete Resume"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <FileText size={32} className="mb-2 opacity-50" />
                    <div>No resumes uploaded yet. Upload your first PDF resume above.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        show={Boolean(deleteConfirmId)}
        onHide={() => setDeleteConfirmId(null)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-6 fw-bold text-danger">Delete Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this resume file?
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