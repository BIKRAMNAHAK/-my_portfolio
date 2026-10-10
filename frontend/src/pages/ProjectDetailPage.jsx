import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  FolderOpen,
  Github,
  Globe,
  Code2,
  Calendar,
  CheckCircle2,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import BackToTop from '../components/layout/BackToTop'
import PageTransition from '../components/layout/PageTransition'
import api, { getUploadUrl } from '../services/apis/api_config'
import Loader from '../components/ui/Loader'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get(`/projects/${slug}`)
      .then((res) => {
        setProject(res.data?.data)
      })
      .catch(() => {
        // If not found by ID, attempt finding by title or show placeholder
        setProject(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [slug])

  return (
    <PageTransition>
      <Navbar />
      <BackToTop />

      <main className="py-5" style={{ minHeight: '85vh', marginTop: '4rem' }}>
        <Container style={{ maxWidth: '900px' }}>
          <Link
            to="/#projects"
            className="d-inline-flex align-items-center gap-2 mb-4 text-decoration-none fw-semibold"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Projects</span>
          </Link>

          {loading ? (
            <div className="py-5 text-center">
              <Loader text="Loading project details" />
            </div>
          ) : project ? (
            <Card className="border-0 shadow-sm glass-card overflow-hidden">
              {project.image ? (
                <img
                  src={getUploadUrl(project.image)}
                  alt={project.title}
                  style={{ width: '100%', maxHeight: '420px', objectFit: 'cover' }}
                />
              ) : (
                <div
                  className="p-5 text-center"
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.08)',
                  }}
                >
                  <Code2 size={64} className="text-primary mb-2" />
                </div>
              )}

              <Card.Body className="p-4 p-md-5">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
                  <div>
                    <h1 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {project.title}
                    </h1>
                    <p className="lead fs-6 text-secondary mb-0">
                      {project.description}
                    </p>
                  </div>

                  <div className="d-flex gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-secondary d-inline-flex align-items-center gap-2 rounded-pill px-3"
                      >
                        <Github size={16} />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="action-primary text-decoration-none rounded-pill px-3 py-2"
                      >
                        <Globe size={16} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Tech Stack Badges */}
                <div className="d-flex flex-wrap gap-2 my-4">
                  {project.technologies?.map((tech) => (
                    <Badge
                      key={tech}
                      bg="light"
                      text="dark"
                      className="px-3 py-2"
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.12)',
                        color: '#7c3aed',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.82rem',
                      }}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Detailed description */}
                {project.detailedDescription && (
                  <div className="my-4">
                    <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Project Overview
                    </h5>
                    <p className="text-secondary" style={{ lineHeight: 1.75 }}>
                      {project.detailedDescription}
                    </p>
                  </div>
                )}

                {/* Features */}
                {Array.isArray(project.features) && project.features.length > 0 && (
                  <div className="my-4">
                    <h5 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                      Key Features
                    </h5>
                    <Row className="g-2">
                      {project.features.map((feat, i) => (
                        <Col sm={6} key={i}>
                          <div className="d-flex align-items-start gap-2 text-secondary">
                            <CheckCircle2 size={16} className="text-primary mt-1 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Challenges and Solutions */}
                {(project.challenges || project.solutions) && (
                  <Row className="g-4 my-3">
                    {project.challenges && (
                      <Col md={6}>
                        <Card className="border-0 p-3" style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)' }}>
                          <h6 className="fw-bold text-warning d-flex align-items-center gap-2 mb-2">
                            <AlertTriangle size={16} /> Challenges
                          </h6>
                          <p className="small text-secondary mb-0">{project.challenges}</p>
                        </Card>
                      </Col>
                    )}
                    {project.solutions && (
                      <Col md={6}>
                        <Card className="border-0 p-3" style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)' }}>
                          <h6 className="fw-bold text-success d-flex align-items-center gap-2 mb-2">
                            <Lightbulb size={16} /> Solutions
                          </h6>
                          <p className="small text-secondary mb-0">{project.solutions}</p>
                        </Card>
                      </Col>
                    )}
                  </Row>
                )}
              </Card.Body>
            </Card>
          ) : (
            <Card className="border-0 p-5 text-center glass-card">
              <FolderOpen size={48} className="text-muted mx-auto mb-3" />
              <h4 className="fw-bold mb-2">Project Not Found</h4>
              <p className="text-secondary mb-4">
                The requested project details could not be found or have been moved.
              </p>
              <div>
                <Link to="/#projects" className="action-primary text-decoration-none">
                  Return to Home
                </Link>
              </div>
            </Card>
          )}
        </Container>
      </main>

      <Footer />
    </PageTransition>
  )
}
