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
          <div className="empty-icon">🔗</div>
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
                  📊 {link.clickCount} clicks
                </span>

                <div className="link-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handleCopy(link.id, link.shortUrl)}
                    title="Copy shortened link"
                  >
                    {copiedId === link.id ? '✓' : '📋'}
                  </button>
                  <Link
                    to={`/links/${link.id}`}
                    className="btn-icon"
                    title="View Analytics"
                  >
                    📈
                  </Link>
                  <Link
                    to={`/links/${link.id}/edit`}
                    className="btn-icon"
                    title="Edit Link"
                  >
                    ✏️
                  </Link>
                  <button
                    className="btn-icon btn-icon-danger"
                    onClick={() => handleDelete(link.id, link.title)}
                    title="Delete Link"
                  >
                    🗑️
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
