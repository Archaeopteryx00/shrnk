import { useState } from 'react'
import { Routes, Route, Link, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ToastContainer from './components/Toast'
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
      <ToastContainer />
      <header className="navbar">
        <div className="nav-left-group">
          <Link to="/" className="logo">
            <img src="/logo%20type.png" alt="shrnk" />
          </Link>
          {token && (
            <nav className="nav-links">
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
              <NavLink to="/links/new" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Shorten Link
              </NavLink>
            </nav>
          )}
        </div>

        <div className="nav-right-group">
          {token ? (
            <div className="profile-dropdown-wrapper">
              <button className="nav-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="nav-avatar-badge">{getInitials()}</div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

      <Routes>
        <Route path="/" element={<main className="main-content"><LandingPage /></main>} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" replace />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute><main className="main-content"><Dashboard /></main></ProtectedRoute>} />
        <Route path="/links/new" element={<ProtectedRoute><main className="main-content"><CreateLink /></main></ProtectedRoute>} />
        <Route path="/links/:id/edit" element={<ProtectedRoute><main className="main-content"><EditLink /></main></ProtectedRoute>} />
        <Route path="/links/:id" element={<ProtectedRoute><main className="main-content"><LinkDetail /></main></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
