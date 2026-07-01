import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createLink } from '../api/links'

const CreateLink = () => {
  const [originalUrl, setOriginalUrl] = useState('')
  const [title, setTitle] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await createLink({ originalUrl, title })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create link. Make sure the URL is valid.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="card" style={{ maxWidth: '100%' }}>
        <h2 className="card-title">Shorten a Link</h2>
        <p className="card-subtitle">Convert your long URL into a short, trackable link</p>

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
