import { useState } from 'react'
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateLink from './pages/CreateLink'
import EditLink from './pages/EditLink'
import LinkDetail from './pages/LinkDetail'
import LandingPage from './pages/LandingPage'

function App() {
  const { token, user, logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setDropdownOpen(false)
    logout()
    navigate('/login')
  }

  const getInitials = () => {
    if (!user || !user.username) return 'U'
    const name = user.username.toUpperCase()
    return name.slice(0, 2)
  }

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="nav-left-group">
          <Link to="/" className="logo">
            <img src="/logo%20type.png" alt="shrnk" style={{ height: '24px', objectFit: 'contain' }} />
          </Link>
          {token && (
            <nav className="nav-links">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/links/new" className="nav-link">
                Shorten Link
              </Link>
            </nav>
          )}
        </div>

        <div className="nav-right-group">
          {token ? (
            <>
              <button className="nav-icon-btn" title="Notifications">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
              </button>
              <div className="profile-dropdown-wrapper">
                <button className="nav-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="nav-avatar-badge">{getInitials()}</div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="profile-dropdown-menu">
                    <button onClick={handleLogout} className="profile-dropdown-item">
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '14px', width: 'auto' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/links/new" element={<ProtectedRoute><CreateLink /></ProtectedRoute>} />
          <Route path="/links/:id/edit" element={<ProtectedRoute><EditLink /></ProtectedRoute>} />
          <Route path="/links/:id" element={<ProtectedRoute><LinkDetail /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Shrnk. All rights reserved.
      </footer>
    </div>
  )
}

export default App
