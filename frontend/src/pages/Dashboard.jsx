import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getLinks, deleteLink } from '../api/links'
import { toast } from '../utils/toast'

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
      toast.error('Failed to fetch links.')
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
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDelete = async (id, title) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the link "${title || 'Untitled'}"?`)
    if (!isConfirmed) return

    try {
      await deleteLink(id)
      setLinks(links.filter((link) => link.id !== id))
      toast.success('Link deleted successfully')
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to delete the link.'
      toast.error(errMsg)
    }
  }

  const totalLinks = links.length
  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0)

  const timeAgo = (dateString) => {
    const diff = Date.now() - new Date(dateString).getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  if (loading) {
    return (
      <div>
        <div className="dashboard-header-row">
          <div className="dashboard-title-group">
            <span className="dashboard-title">Dashboard</span>
            <span className="dashboard-subtitle">Manage and track your shortened links.</span>
          </div>
          <div style={{ width: '100px', height: '34px' }} className="skeleton-box"></div>
        </div>

        <div className="summary-grid" style={{ marginTop: '1rem' }}>
          <div className="summary-card skeleton-box" style={{ height: '56px', border: 'none' }}></div>
          <div className="summary-card skeleton-box" style={{ height: '56px', border: 'none' }}></div>
        </div>

        <div className="workspace-container skeleton-box" style={{ height: '240px', marginTop: '1.5rem', border: 'none' }}></div>
      </div>
    )
  }

  return (
    <div>
      {error && <div className="alert alert-error">{typeof error === 'object' ? (error.message || error.error || JSON.stringify(error)) : error}</div>}

      {/* Main Page Header */}
      <div className="dashboard-header-row">
        <div className="dashboard-title-group">
          <h1 className="dashboard-title">Dashboard</h1>
          <span className="dashboard-subtitle">Manage and track your shortened links.</span>
        </div>
        <Link to="/links/new" className="btn btn-primary" style={{ width: 'auto', fontSize: '13px', padding: '0.45rem 0.9rem' }}>
          Shorten Link
        </Link>
      </div>

      {/* Compact Stat Cards */}
      <div className="summary-grid" style={{ marginTop: '1rem' }}>
        <div className="summary-card">
          <span className="summary-label">Total Links</span>
          <span className="summary-value">{totalLinks}</span>
        </div>
        <div className="summary-card">
          <span className="summary-label">Total Clicks</span>
          <span className="summary-value">{totalClicks}</span>
        </div>
      </div>

      {/* Workspace Links List Header */}
      <div className="section-header-row">
        <div className="dashboard-title-group">
          <h2 className="section-title">Your Links</h2>
          <span className="section-subtitle">List of shortened URLs and click counts.</span>
        </div>
      </div>

      {/* Workspace links container */}
      <div className="workspace-container">
        {links.length === 0 ? (
          <div className="workspace-empty-row">
            <div className="workspace-empty-content">
              <span className="workspace-empty-title">No links shortened yet</span>
              <span className="workspace-empty-desc">
                Generate your first shortened URL to see clicks and analytics. Click "Shorten Link" above to get started.
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="table-container">
              <table className="link-table">
                <thead>
                  <tr>
                    <th>Short Link</th>
                    <th>Clicks</th>
                    <th>Created At</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link) => (
                    <tr key={link.id}>
                      <td>
                        <div className="table-shortlink-cell">
                          <span className="table-title">{link.title || 'Untitled Link'}</span>
                          <a
                            href={link.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="table-short-url"
                          >
                            {link.shortUrl.replace(/^https?:\/\//, '')}
                          </a>
                          <span className="table-original-url" title={link.originalUrl}>
                            {link.originalUrl}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{link.clickCount}</span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--color-text-secondary)' }}>
                          {new Date(link.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </td>
                      <td>
                        <div className="link-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }}>
                          <button
                            className="btn-icon"
                            onClick={() => handleCopy(link.id, link.shortUrl)}
                            title="Copy shortened link"
                          >
                            {copiedId === link.id ? (
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
                          <Link
                            to={`/links/${link.id}`}
                            className="btn-icon"
                            title="View Analytics"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 3v18h18"></path>
                              <path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3"></path>
                            </svg>
                          </Link>
                          <Link
                            to={`/links/${link.id}/edit`}
                            className="btn-icon"
                            title="Edit Link"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"></path>
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                            </svg>
                          </Link>
                          <button
                            className="btn-icon btn-icon-danger"
                            onClick={() => handleDelete(link.id, link.title)}
                            title="Delete Link"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="mobile-cards-container">
              {links.map((link) => (
                <div key={link.id} className="stylekit-card">
                  <div className="card-header-row">
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                      <span className="card-title-text" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {link.title || 'Untitled Link'}
                      </span>
                      <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-short"
                      >
                        {link.shortUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', wordBreak: 'break-all' }}>
                    {link.originalUrl}
                  </div>

                  <div className="card-footer-row">
                    <div className="card-footer-item">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                      </svg>
                      <span>{link.clickCount} clicks</span>
                    </div>
                    <div className="card-footer-item">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{timeAgo(link.createdAt)}</span>
                    </div>
                  </div>

                  <div className="link-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem', marginTop: '0.25rem' }}>
                    <button
                      className="btn-icon"
                      onClick={() => handleCopy(link.id, link.shortUrl)}
                      title="Copy shortened link"
                    >
                      {copiedId === link.id ? (
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
                    <Link
                      to={`/links/${link.id}`}
                      className="btn-icon"
                      title="View Analytics"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 3v18h18"></path>
                        <path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3"></path>
                      </svg>
                    </Link>
                    <Link
                      to={`/links/${link.id}/edit`}
                      className="btn-icon"
                      title="Edit Link"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                      </svg>
                    </Link>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleDelete(link.id, link.title)}
                      title="Delete Link"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
