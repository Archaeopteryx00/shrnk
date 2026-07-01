import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLinks, deleteLink } from '../api/links'

const Dashboard = () => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copiedId, setCopiedId] = useState(null)

  const fetchLinks = async () => {
    try {
      setLoading(true)
      const data = await getLinks()
      setLinks(data)
    } catch (err) {
      setError('Failed to fetch links. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  const handleCopy = async (id, shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      alert('Failed to copy to clipboard')
    }
  }

  const handleDelete = async (id, title) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the link "${title || 'Untitled'}"?`)
    if (!isConfirmed) return

    try {
      await deleteLink(id)
      setLinks(links.filter((link) => link.id !== id))
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete the link.')
    }
  }

  const totalLinks = links.length
  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0)

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="summary-grid">
        <div className="summary-card">
          <span className="summary-label">Total Links</span>
          <span className="summary-value">{totalLinks}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Clicks</span>
          <span className="summary-value">{totalClicks}</span>
        </div>
      </div>

      <div className="dashboard-header">
        <h2 className="dashboard-title">Your Shortened Links</h2>
        <Link to="/links/new" className="btn btn-primary" style={{ width: 'auto' }}>
          Shorten New Link
        </Link>
      </div>

      {links.length === 0 ? (
        <div className="empty-state">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <h3>No links shortened yet</h3>
          <p>Create your very first shortened link now to see click analytics!</p>
          <Link to="/links/new" className="btn btn-primary" style={{ width: 'auto', marginTop: '0.5rem' }}>
            Get Started
          </Link>
        </div>
      ) : (
        <div className="links-grid">
          {links.map((link) => (
            <div key={link.id} className="link-card">
              <div className="link-info">
                <h3 className="link-title">{link.title || 'Untitled Link'}</h3>
                <a
                  href={link.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-short"
                >
                  {link.shortUrl}
                </a>
                <span className="link-original" title={link.originalUrl}>
                  {link.originalUrl}
                </span>
              </div>

              <div className="link-meta">
                <span className="link-clicks">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  {link.clickCount} clicks
                </span>

                <div className="link-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleCopy(link.id, link.shortUrl)}
                    title="Copy shortened link"
                  >
                    {copiedId === link.id ? (
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
                  <Link
                    to={`/links/${link.id}`}
                    className="btn-icon"
                    title="View Analytics"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 3v18h18"></path>
                      <path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3"></path>
                    </svg>
                  </Link>
                  <Link
                    to={`/links/${link.id}/edit`}
                    className="btn-icon"
                    title="Edit Link"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                    </svg>
                  </Link>
                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleDelete(link.id, link.title)}
                    title="Delete Link"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
