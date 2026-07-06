import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createLink } from '../api/links'
import { toast } from '../utils/toast'

const CreateLink = () => {
  const [originalUrl, setOriginalUrl] = useState('')
  const [title, setTitle] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [createdLink, setCreatedLink] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const data = await createLink({ 
        originalUrl, 
        title, 
        customCode: customCode ? customCode.trim() : undefined 
      })
      setCreatedLink(data)
      toast.success('Link shortened successfully!')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create link. Make sure the URL is valid.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setOriginalUrl('')
    setTitle('')
    setCustomCode('')
    setCreatedLink(null)
    setCopied(false)
  }

  const handleCopy = async () => {
    if (!createdLink) return
    try {
      await navigator.clipboard.writeText(createdLink.shortUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  if (createdLink) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Page Header */}
        <div className="dashboard-header-row" style={{ borderBottom: 'none', marginBottom: '1.25rem', paddingBottom: 0 }}>
          <div className="dashboard-title-group">
            <h1 className="dashboard-title">Link Shortened!</h1>
            <span className="dashboard-subtitle">Your new link is ready to be shared.</span>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '100%', padding: '2.25rem', textAlign: 'center' }}>
          {/* Success Check Icon */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--color-success-bg)', 
            border: '1px solid var(--color-success-border)',
            color: 'var(--color-success)',
            marginBottom: '1.25rem'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '0.5rem' }}>
            {createdLink.title || 'Untitled Link'}
          </h2>

          {/* Shareable Link Box */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            backgroundColor: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-input)', 
            padding: '0.75rem 1rem', 
            marginTop: '1.25rem',
            marginBottom: '0.5rem',
            textAlign: 'left'
          }}>
            <a 
              href={createdLink.shortUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                flex: 1, 
                fontWeight: 600, 
                color: 'var(--color-accent)', 
                textDecoration: 'none',
                fontSize: '14.5px',
                wordBreak: 'break-all'
              }}
            >
              {createdLink.shortUrl.replace(/^https?:\/\//, '')}
            </a>
            <button 
              className="btn-icon" 
              onClick={handleCopy} 
              title="Copy link"
              style={{ backgroundColor: 'var(--bg-surface)' }}
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-success)' }}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              )}
            </button>
          </div>

          <p style={{ 
            fontSize: '12px', 
            color: 'var(--color-text-secondary)', 
            wordBreak: 'break-all', 
            margin: '0 auto 2rem auto',
            maxWidth: '100%' 
          }}>
            Destination: {createdLink.originalUrl}
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleReset} className="btn btn-secondary">
              Shorten Another
            </button>
            <Link to="/dashboard" className="btn btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="dashboard-header-row" style={{ borderBottom: 'none', marginBottom: '1.25rem', paddingBottom: 0 }}>
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Shorten a Link</h1>
          <span className="dashboard-subtitle">Convert your long URL into a short, trackable link</span>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '100%', padding: '2rem' }}>
        {error && <div className="alert alert-error">{typeof error === 'object' ? (error.message || error.error || JSON.stringify(error)) : error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="originalUrl">Destination URL *</label>
            <input
              id="originalUrl"
              type="url"
              className="form-input"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very/long/destination/path"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="title">Title (Optional)</label>
            <input
              id="title"
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Portfolio Website"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="customCode">Custom Link Path (Optional)</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                color: 'var(--color-text-secondary)', 
                marginRight: '0.35rem', 
                fontWeight: 600, 
                fontSize: '13.5px',
                userSelect: 'none'
              }}>
                shrnk.co/
              </span>
              <input
                id="customCode"
                type="text"
                className="form-input"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="e.g. google"
              />
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Alphanumeric, hyphens, and underscores allowed (3-30 chars).
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Shorten Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateLink
