import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownToLine,
  ArrowUpRight,
  Code2,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
  Sparkles,
  Phone,
  CheckCircle2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import BackToTop from '../components/layout/BackToTop'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import SectionTitle from '../components/ui/SectionTitle'
import api, { getUploadUrl } from '../services/apis/api_config'
import { SERVICES, SKILL_CATEGORIES } from '../utils/constants'

const fallback = {
  name: 'Bikram Nahak',
  professionalTitle: 'Full Stack Developer',
  bio: 'I create polished, useful web and mobile products that feel simple to use and scale with confidence.',
  location: 'India',
  yearsExperience: 3,
  projectsCompleted: 15,
  technologiesCount: 20,
  passion: 'Building scalable applications and delightful user interfaces',
  animatedTitles: [
    'Full Stack Developer',
    'MERN Stack Specialist',
    'React Native Developer',
    'Problem Solver',
  ],
}

function Reveal({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function HomePage() {
  const [about, setAbout] = useState(fallback)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [experiences, setExperiences] = useState([])
  const [social, setSocial] = useState({})
  const [resume, setResume] = useState(null)
  const [titleIndex, setTitleIndex] = useState(0)
  const [sending, setSending] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)

  useEffect(() => {
    // Record public visitor analytics (once per browsing session)
    try {
      const hasTracked = sessionStorage.getItem('portfolio_visited')
      if (!hasTracked) {
        api.post('/visitors').catch(() => {})
        sessionStorage.setItem('portfolio_visited', 'true')
      }
    } catch {
      // ignore storage access errors
    }

    Promise.allSettled([
      api.get('/about'),
      api.get('/skills'),
      api.get('/projects'),
      api.get('/experiences'),
      api.get('/resume'),
      api.get('/social'),
    ]).then(([aboutRes, skillsRes, projectsRes, expRes, resumeRes, socialRes]) => {
      if (aboutRes.status === 'fulfilled' && aboutRes.value.data?.data) {
        setAbout(aboutRes.value.data.data)
      }
      if (skillsRes.status === 'fulfilled' && skillsRes.value.data?.data) {
        setSkills(skillsRes.value.data.data)
      }
      if (projectsRes.status === 'fulfilled' && projectsRes.value.data?.data) {
        setProjects(projectsRes.value.data.data)
      }
      if (expRes.status === 'fulfilled' && expRes.value.data?.data) {
        setExperiences(expRes.value.data.data)
      }
      if (resumeRes.status === 'fulfilled' && resumeRes.value.data?.data) {
        setResume(resumeRes.value.data.data)
      }
      if (socialRes.status === 'fulfilled' && socialRes.value.data?.data) {
        setSocial(socialRes.value.data.data)
      }
    })
  }, [])

  const titles = about.animatedTitles?.length ? about.animatedTitles : fallback.animatedTitles

  useEffect(() => {
    const timer = setInterval(() => {
      setTitleIndex((idx) => (idx + 1) % Math.max(titles.length, 1))
    }, 2800)
    return () => clearInterval(timer)
  }, [titles.length])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    setSending(true)
    setSentSuccess(false)

    const formElement = e.currentTarget
    const raw = Object.fromEntries(new FormData(formElement))

    try {
      const res = await api.post('/messages', raw)
      if (res.data?.success) {
        formElement.reset()
        setSentSuccess(true)
        toast.success('Your message has been sent! Check your email for confirmation.')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to send message right now.')
    } finally {
      setSending(false)
    }
  }

  const grouped = SKILL_CATEGORIES.map((category) => ({
    category,
    items: skills.filter((skill) => skill.category === category),
  })).filter((group) => group.items.length)

  return (
    <>
      <Navbar />
      <BackToTop />

      <main>
        {/* =========================================================================
            HERO SECTION
            ========================================================================= */}
        <section
          id="home"
          className="position-relative overflow-hidden d-flex align-items-center"
          style={{ minHeight: '100vh', paddingTop: '6rem' }}
        >
          <div className="position-absolute inset-0 grid-bg" style={{ zIndex: -1 }} />
          <div className="orb orb-one" />
          <div className="orb orb-two" />

          <Container className="py-5">
            <Row className="align-items-center g-5">
              {/* Left Column: Intro */}
              <Col lg={7}>
                <Reveal>
                  <span className="eyebrow">
                    <Sparkles size={16} /> Available for Selected Work
                  </span>

                  <h1
                    className="display-3 fw-bold mt-3 mb-2"
                    style={{ letterSpacing: '-0.05em', lineHeight: 1.05 }}
                  >
                    Hi, I&apos;m <span className="gradient-text">{about.name}</span>.
                  </h1>

                  <div
                    className="my-3 fs-3 fw-semibold text-secondary"
                    style={{ minHeight: '2.5rem' }}
                  >
                    <motion.span
                      key={titles[titleIndex]}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {titles[titleIndex]}
                    </motion.span>
                  </div>

                  <p
                    className="lead fs-5 text-secondary my-4"
                    style={{ maxWidth: '34rem', lineHeight: 1.7 }}
                  >
                    {about.bio || fallback.bio}
                  </p>

                  <div className="d-flex flex-wrap gap-3 mt-4">
                    <a href="#projects" className="action-primary">
                      <span>View My Work</span>
                      <ArrowUpRight size={18} />
                    </a>
                    <a href="#contact" className="action-secondary">
                      Contact Me
                    </a>
                    {resume && (
                      <a
                        href={getUploadUrl(resume.path)}
                        target="_blank"
                        rel="noreferrer"
                        className="action-secondary"
                      >
                        <ArrowDownToLine size={17} />
                        <span>Resume</span>
                      </a>
                    )}
                  </div>

                  {/* Social Buttons */}
                  <div className="d-flex align-items-center gap-2 mt-4 pt-2">
                    {about.email && (
                      <a
                        aria-label="Email"
                        href={`mailto:${about.email}`}
                        className="social-button d-inline-flex align-items-center justify-content-center"
                      >
                        <Mail size={18} />
                      </a>
                    )}
                    {social.github && (
                      <a
                        aria-label="GitHub"
                        href={social.github}
                        target="_blank"
                        rel="noreferrer"
                        className="social-button d-inline-flex align-items-center justify-content-center"
                      >
                        <Github size={18} />
                      </a>
                    )}
                    {social.linkedin && (
                      <a
                        aria-label="LinkedIn"
                        href={social.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="social-button d-inline-flex align-items-center justify-content-center"
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                  </div>
                </Reveal>
              </Col>

              {/* Right Column: Hero Portrait */}
              <Col lg={5} className="text-center">
                <Reveal>
                  <div className="portrait-shell">
                    {about.profileImage ? (
                      <img
                        src={getUploadUrl(about.profileImage)}
                        alt={about.name || 'Profile'}
                        className="portrait"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const fb = e.currentTarget.parentElement?.querySelector('.portrait-placeholder-fallback')
                          if (fb) fb.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div
                      className="portrait-placeholder portrait-placeholder-fallback justify-content-center"
                      style={{ display: about.profileImage ? 'none' : 'flex' }}
                    >
                      {about.name?.slice(0, 2).toUpperCase() || 'BN'}
                    </div>
                    <div className="floating-note d-inline-flex align-items-center">
                      <span className="pulse-dot" />
                      Building thoughtful products
                    </div>
                    <div className="code-tag d-inline-flex align-items-center">&lt;developer /&gt;</div>
                  </div>
                </Reveal>
              </Col>
            </Row>
          </Container>
        </section>

        {/* =========================================================================
            ABOUT SECTION
            ========================================================================= */}
        <section id="about" className="section-padding">
          <Container>
            <SectionTitle
              subtitle="A little more"
              title="Built around curiosity and craft."
            />

            <Row className="g-4 mt-2 align-items-stretch">
              <Col lg={5}>
                <Reveal className="glass-card p-4 p-md-5 h-100 d-flex flex-column justify-content-center">
                  <div className="d-flex align-items-center gap-2 text-secondary mb-3 small fw-bold">
                    <MapPin size={18} className="text-primary" />
                    <span>{about.location || 'India'}</span>
                  </div>
                  <h4 className="fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    {about.currentRole || about.professionalTitle}
                  </h4>
                  <p className="text-secondary leading-relaxed mb-0">
                    {about.passion ||
                      'I care about the invisible details: robust software architecture, fluid interactions, and maintainable codebases that stand the test of time.'}
                  </p>
                </Reveal>
              </Col>

              <Col lg={7}>
                <Row className="g-3 h-100">
                  {[
                    [about.yearsExperience || 3, 'Years of Experience'],
                    [about.projectsCompleted || 15, 'Projects Shipped'],
                    [about.technologiesCount || 20, 'Core Technologies'],
                    [100, 'Commitment to Quality'],
                  ].map(([value, label]) => (
                    <Col sm={6} key={label}>
                      <Reveal className="metric-card h-100 d-flex flex-column justify-content-center">
                        <AnimatedCounter
                          value={value}
                          suffix={label.includes('Commitment') ? '%' : '+'}
                        />
                        <p className="mt-2 fw-semibold text-secondary">{label}</p>
                      </Reveal>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Container>
        </section>

        {/* =========================================================================
            SKILLS SECTION
            ========================================================================= */}
        <section id="skills" className="section-padding surface">
          <Container>
            <SectionTitle
              subtitle="Toolkit & Capabilities"
              title="Technologies and frameworks with intention."
            />

            <Row className="g-4 mt-2">
              {(grouped.length ? grouped : SKILL_CATEGORIES.map((c) => ({ category: c, items: [] }))).map(
                (group) => (
                  <Col md={6} xl={grouped.length === 5 ? 'auto' : 4} className="flex-fill" key={group.category}>
                    <Reveal className="skill-group h-100">
                      <h6 className="fw-bold text-primary mb-3 text-uppercase small letter-spacing-1">
                        {group.category}
                      </h6>
                      {group.items.length ? (
                        group.items.map((skill) => (
                          <div key={skill._id} className="skill-chip d-flex justify-content-between align-items-center">
                            <span>{skill.name}</span>
                            {skill.icon && <span className="small text-muted font-monospace">{skill.icon}</span>}
                          </div>
                        ))
                      ) : (
                        <p className="small text-muted mb-0">Technologies coming soon</p>
                      )}
                    </Reveal>
                  </Col>
                )
              )}
            </Row>
          </Container>
        </section>

        {/* =========================================================================
            EXPERIENCE SECTION
            ========================================================================= */}
        <section id="experience" className="section-padding">
          <Container>
            <SectionTitle
              subtitle="Trajectory"
              title="Career journey & industry experience."
            />

            <div className="mt-4 mx-auto" style={{ maxWidth: '52rem' }}>
              {experiences.length ? (
                experiences.map((exp, idx) => (
                  <Reveal key={exp._id} className="timeline-card mb-4">
                    <div className="timeline-index">0{idx + 1}</div>
                    <div>
                      <div className="small text-primary fw-bold mb-1">
                        {exp.startDate ? new Date(exp.startDate).getFullYear() : '2022'} —{' '}
                        {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                      </div>
                      <h4 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {exp.position}{' '}
                        <span className="text-secondary fw-normal fs-6">/ {exp.company}</span>
                      </h4>
                      <p className="text-secondary my-3" style={{ lineHeight: 1.65 }}>
                        {exp.description}
                      </p>
                      <div className="d-flex flex-wrap gap-1 mt-2">
                        {exp.technologies?.map((tech) => (
                          <span className="tag" key={tech}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                ))
              ) : (
                <div className="empty-card">
                  Milestones and work history will appear here.
                </div>
              )}
            </div>
          </Container>
        </section>

        {/* =========================================================================
            PROJECTS SECTION
            ========================================================================= */}
        <section id="projects" className="section-padding surface">
          <Container>
            <SectionTitle
              subtitle="Selected Work"
              title="Ideas turned into scalable software."
            />

            <Row className="g-4 mt-2">
              {projects.length ? (
                projects.map((proj) => (
                  <Col md={6} lg={4} key={proj._id}>
                    <Reveal className="h-100">
                      <article className="project-card">
                        {proj.image ? (
                          <img
                            src={getUploadUrl(proj.image)}
                            alt={proj.title}
                            className="project-image"
                          />
                        ) : (
                          <div className="project-image project-fallback">
                            <Code2 size={42} />
                          </div>
                        )}

                        <div className="p-4 d-flex flex-column flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                            <h5 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                              {proj.title}
                            </h5>
                            {proj.liveUrl ? (
                              <a
                                href={proj.liveUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="circle-link"
                                title="Open Live Demo"
                              >
                                <ArrowUpRight size={17} />
                              </a>
                            ) : (
                              <Link
                                to={`/projects/${proj._id}`}
                                className="circle-link"
                                title="View Details"
                              >
                                <ArrowUpRight size={17} />
                              </Link>
                            )}
                          </div>

                          <p className="small text-secondary mb-3 flex-grow-1" style={{ lineHeight: 1.6 }}>
                            {proj.description}
                          </p>

                          <div className="d-flex flex-wrap gap-1 mt-auto">
                            {proj.technologies?.slice(0, 4).map((tech) => (
                              <span className="tag" key={tech}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>
                    </Reveal>
                  </Col>
                ))
              ) : (
                <Col xs={12}>
                  <div className="empty-card">
                    Projects added from your admin panel will be showcased here.
                  </div>
                </Col>
              )}
            </Row>
          </Container>
        </section>

        {/* =========================================================================
            SERVICES SECTION
            ========================================================================= */}
        <section id="services" className="section-padding">
          <Container>
            <SectionTitle
              subtitle="Capabilities"
              title="From concept to high-performance launch."
            />

            <Row className="g-4 mt-2">
              {SERVICES.map((serv) => (
                <Col md={6} lg={4} key={serv.title}>
                  <Reveal className="service-card h-100">
                    <Code2 className="text-primary mb-3" size={26} />
                    <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                      {serv.title}
                    </h5>
                    <p className="small text-secondary mb-0" style={{ lineHeight: 1.6 }}>
                      {serv.description}
                    </p>
                  </Reveal>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* =========================================================================
            RESUME BANNER
            ========================================================================= */}
        <section id="resume" className="section-padding">
          <Container>
            <Reveal className="resume-banner flex-column flex-md-row text-center text-md-start">
              <div>
                <span className="eyebrow">My Experience</span>
                <h3 className="fw-bold mb-2 mt-1" style={{ color: 'var(--text-primary)' }}>
                  Interested in the full picture?
                </h3>
                <p className="text-secondary mb-0">
                  Download or preview my full professional resume.
                </p>
              </div>

              {resume ? (
                <a
                  href={getUploadUrl(resume.path)}
                  target="_blank"
                  rel="noreferrer"
                  className="action-primary text-decoration-none"
                >
                  <ArrowDownToLine size={18} />
                  <span>Download Resume</span>
                </a>
              ) : (
                <span className="text-muted small">Resume update coming soon</span>
              )}
            </Reveal>
          </Container>
        </section>

        {/* =========================================================================
            CONTACT SECTION (NODEMAILER INTEGRATED)
            ========================================================================= */}
        <section id="contact" className="section-padding surface">
          <Container>
            <Row className="g-5 align-items-start">
              {/* Left Column: Direct Info */}
              <Col lg={5}>
                <SectionTitle
                  subtitle="Let’s Connect"
                  title="Have a project in mind?"
                  align="left"
                />

                <p className="lead fs-6 text-secondary mt-3 mb-4" style={{ lineHeight: 1.7 }}>
                  Fill out the form to contact me directly. With Nodemailer integrated, your enquiry will reach my inbox instantly, and you&apos;ll receive an immediate acknowledgment.
                </p>

                {about.email && (
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center text-primary flex-shrink-0"
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: 'rgba(139, 92, 246, 0.12)',
                      }}
                    >
                      <Mail size={20} />
                    </div>
                    <div>
                      <div className="small text-muted">Direct Email</div>
                      <a
                        href={`mailto:${about.email}`}
                        className="fw-bold text-decoration-none"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {about.email}
                      </a>
                    </div>
                  </div>
                )}

                {about.phone && (
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center text-primary flex-shrink-0"
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: 'rgba(139, 92, 246, 0.12)',
                      }}
                    >
                      <Phone size={20} />
                    </div>
                    <div>
                      <div className="small text-muted">Phone Number</div>
                      <a
                        href={`tel:${about.phone}`}
                        className="fw-bold text-decoration-none"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {about.phone}
                      </a>
                    </div>
                  </div>
                )}
              </Col>

              {/* Right Column: Contact Form */}
              <Col lg={7}>
                <Reveal>
                  <Card
                    className="border-0 shadow-lg p-3 p-sm-4 glass-card"
                    style={{ backgroundColor: 'var(--bg-card)' }}
                  >
                    <Card.Body>
                      {sentSuccess && (
                        <div
                          className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-3"
                          role="alert"
                        >
                          <CheckCircle2 size={20} />
                          <div>
                            <strong>Thank you!</strong> Your message has been sent directly to my inbox. I will reply to you as soon as possible.
                          </div>
                        </div>
                      )}

                      <Form onSubmit={handleSendMessage}>
                        <Row className="g-3">
                          {/* Name */}
                          <Col sm={6}>
                            <Form.Group>
                              <Form.Label className="field-label">Your Name *</Form.Label>
                              <Form.Control
                                name="name"
                                placeholder="John Doe"
                                required
                              />
                            </Form.Group>
                          </Col>

                          {/* Email */}
                          <Col sm={6}>
                            <Form.Group>
                              <Form.Label className="field-label">Your Email *</Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                required
                              />
                            </Form.Group>
                          </Col>

                          {/* Phone */}
                          <Col sm={6}>
                            <Form.Group>
                              <Form.Label className="field-label">Phone Number (Optional)</Form.Label>
                              <Form.Control
                                type="tel"
                                name="phone"
                                placeholder="+1 234 567 890"
                              />
                            </Form.Group>
                          </Col>

                          {/* Subject */}
                          <Col sm={6}>
                            <Form.Group>
                              <Form.Label className="field-label">Subject *</Form.Label>
                              <Form.Control
                                name="subject"
                                placeholder="Project Consultation / Inquiry"
                                required
                              />
                            </Form.Group>
                          </Col>

                          {/* Message */}
                          <Col xs={12}>
                            <Form.Group>
                              <Form.Label className="field-label">Message *</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={5}
                                name="message"
                                placeholder="Tell me about your project, timeline, budget, or ideas..."
                                required
                              />
                            </Form.Group>
                          </Col>

                          {/* Submit Button */}
                          <Col xs={12}>
                            <Button
                              type="submit"
                              disabled={sending}
                              className="action-primary border-0 w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                            >
                              <Send size={18} />
                              <span>{sending ? 'Sending Message via Nodemailer...' : 'Send Message'}</span>
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </Card.Body>
                  </Card>
                </Reveal>
              </Col>
            </Row>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  )
}
