import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LandingPage = () => {
  const { token } = useAuth()

  return (
    <div>
      {/* Hero Section */}
      <section className="landing-hero">
        <h1 className="landing-headline">
          Shorten.<br />
          Manage. Track.
        </h1>
        <p className="landing-subheadline">
          Modern URL shortening for developers. High-performance redirection and clean click analytics in a minimal package.
        </p>
        <div className="landing-ctas">
          {token ? (
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
              <a
                href="https://github.com/Archaeopteryx00/shrnk.git"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                GitHub
              </a>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="landing-section-title">Features built for modern workflows</h2>
        <div className="landing-features">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 className="feature-title">Secure Authentication</h3>
            <p className="feature-desc">Robust user registration and sign-in powered by standard JSON Web Tokens (JWT).</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <h3 className="feature-title">Fast Redirect</h3>
            <p className="feature-desc">Temporary HTTP 302 redirects deliver visitors to destination paths in milliseconds.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
            </div>
            <h3 className="feature-title">Link Analytics</h3>
            <p className="feature-desc">Monitor total clicks, creation dates, and track precise last-clicked timestamps.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="9" y1="9" x2="21" y2="9"></line>
              </svg>
            </div>
            <h3 className="feature-title">Simple Dashboard</h3>
            <p className="feature-desc">Manage all shortened link records, copy codes, or clean obsolete URLs in one place.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="landing-how">
        <h2 className="landing-section-title">How it works</h2>
        <div className="how-grid">
          <div className="how-step">
            <div className="how-step-num">01</div>
            <h3 className="how-step-title">Create Account</h3>
            <p className="how-step-desc">Register in seconds to set up your personal, secure link management workspace.</p>
          </div>

          <div className="how-step">
            <div className="how-step-num">02</div>
            <h3 className="how-step-title">Shorten URLs</h3>
            <p className="how-step-desc">Submit long URLs with optional descriptive titles to generate unique shareable codes.</p>
          </div>

          <div className="how-step">
            <div className="how-step-num">03</div>
            <h3 className="how-step-title">Track Performance</h3>
            <p className="how-step-desc">Share short URLs and query detailed usage insights directly on your dashboard.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!token && (
        <section className="landing-cta-banner">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            Ready to shorten your links?
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', margin: 0 }}>
            Join Shrnk today and start managing your developer links with real-time statistics.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ width: 'auto', minWidth: '160px', marginTop: '0.25rem' }}>
            Get Started Free
          </Link>
        </section>
      )}

      <footer className="footer">
        &copy; {new Date().getFullYear()} Shrnk. All rights reserved.
      </footer>
    </div>
  )
}

export default LandingPage
