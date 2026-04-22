import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        background: '#0a0a0f', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          border: '3px solid rgba(99,102,241,0.2)',
          borderTopColor: '#6366f1',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: 'rgba(240,239,232,0.35)', fontFamily: "'Sora',sans-serif", fontSize: '0.85rem' }}>
          Loading...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Only redirect AFTER loading is false and user is still null
  if (!user) return <Navigate to="/login" replace />

  // If user is logged in but email is not verified, redirect to verification page
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />
  }

  return children
}