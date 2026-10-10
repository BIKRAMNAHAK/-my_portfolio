import { Heart, Github, Linkedin, Twitter, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { NAV_LINKS, SITE } from '../../utils/constants'

const socialLinks = [
  { icon: Github, href: SITE.github, label: 'GitHub' },
  { icon: Linkedin, href: SITE.linkedin, label: 'LinkedIn' },
  { icon: Twitter, href: SITE.twitter, label: 'Twitter' },
  { icon: Mail, href: `mailto:${SITE.email}`, label: 'Email' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="position-relative border-top py-5 mt-auto"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div
        className="position-absolute top-0 start-0 end-0 gradient-bg opacity-50"
        style={{ height: '1px' }}
      />

      <Container>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 text-center text-md-start">
          {/* Brand info */}
          <div>
            <Link to="/" className="d-inline-flex align-items-center gap-2 mb-1 text-decoration-none">
              <div
                className="gradient-bg rounded-3 d-flex align-items-center justify-content-center text-white fw-bold small"
                style={{ width: '28px', height: '28px' }}
              >
                BN
              </div>
              <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                {SITE.name}
              </span>
            </Link>
            <div className="small text-muted">{SITE.title}</div>
          </div>

          {/* Nav links */}
          <div className="d-flex flex-wrap justify-content-center gap-3 gap-md-4 small">
            {NAV_LINKS.filter((link) =>
              ['About', 'Skills', 'Experience', 'Projects', 'Contact'].includes(link.name)
            ).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-decoration-none fw-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Social Icons */}
          <div className="d-flex align-items-center gap-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="social-button"
                style={{ width: '2.4rem', height: '2.4rem' }}
                aria-label={label}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          className="mt-4 pt-4 border-top text-center small text-muted"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="d-flex align-items-center justify-content-center gap-1">
            <span>&copy; {year} {SITE.name}. Built with</span>
            <Heart size={14} className="text-danger" fill="currentColor" />
            <span>using React &amp; Bootstrap</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
