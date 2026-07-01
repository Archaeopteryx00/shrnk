import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateLink from './pages/CreateLink'
import EditLink from './pages/EditLink'
import LinkDetail from './pages/LinkDetail'

function App() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="app-container">
      <header className="navbar">
        <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo%20type.png" alt="shrnk" style={{ height: '32px', objectFit: 'contain' }} />
        </Link>
        <nav className="nav-links">
          {token ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/links/new" className="nav-link">
                Shorten Link
              </Link>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                {user?.username}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', width: 'auto' }}>
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', width: 'auto' }}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
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
