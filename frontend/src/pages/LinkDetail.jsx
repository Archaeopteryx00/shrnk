import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getLinkStats } from '../api/links'

const LinkDetail = () => {
  const { id } = useParams()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getLinkStats(id)
        setStats(data)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch link statistics.')
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [id])

  const handleCopy = async () => {
    if (!stats) return
    try {
      await navigator.clipboard.writeText(stats.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div className="alert alert-error">{error || 'Unable to retrieve statistics.'}</div>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="stats-header">
        <Link to="/dashboard" className="btn-text" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '1rem', textDecoration: 'none' }}>
          ← Back to Dashboard
        </Link>
        <h2 className="dashboard-title">Link Analytics</h2>
      </div>

      <div className="stats-grid">
        <div className="card" style={{ maxWidth: '100%', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Configuration</h3>
          
          <div style={{ marginBottom: '1.25rem' }}>
            <span className="form-label" style={{ marginBottom: '0.2rem' }}>Short Link</span>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <a href={stats.shortUrl} target="_blank" rel="noopener noreferrer" className="link-short" style={{ fontSize: '1.15rem' }}>
                {stats.shortUrl}
              </a>
              <button className="btn-icon" onClick={handleCopy} title="Copy link" style={{ width: '32px', height: '32px' }}>
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-success)' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <span className="form-label" style={{ marginBottom: '0.2rem' }}>Original URL</span>
            <span style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
              {stats.originalUrl}
            </span>
          </div>

          <div>
            <span className="form-label" style={{ marginBottom: '0.2rem' }}>Created At</span>
            <span style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
              {new Date(stats.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Performance</h3>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                {stats.totalClicks}
              </span>
              <span style={{ color: 'var(--color-text-secondary)', fontWeight: '500' }}>total clicks</span>
            </div>

            <div>
              <span className="form-label" style={{ marginBottom: '0.2rem' }}>Last Click Registered</span>
              <span style={{ fontSize: '1rem', fontWeight: '500', color: stats.lastClickedAt ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                {stats.lastClickedAt ? new Date(stats.lastClickedAt).toLocaleString() : 'Never clicked'}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <Link to={`/links/${stats.id}/edit`} className="btn btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
              Edit Configuration
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LinkDetail
