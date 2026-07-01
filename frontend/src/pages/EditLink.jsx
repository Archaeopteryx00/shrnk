import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getLinkById, updateLink } from '../api/links'

const EditLink = () => {
  const { id } = useParams()
  const [originalUrl, setOriginalUrl] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const link = await getLinkById(id)
        setOriginalUrl(link.originalUrl)
        setTitle(link.title || '')
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch link details.')
      } finally {
        setLoading(false)
      }
    }
    fetchLink()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await updateLink(id, { originalUrl, title })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update link.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card" style={{ maxWidth: '100%' }}>
        <h2 className="card-title">Edit Link</h2>
        <p className="card-subtitle">Update your short link configurations</p>

        {error && <div className="alert alert-error">{error}</div>}

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

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditLink
