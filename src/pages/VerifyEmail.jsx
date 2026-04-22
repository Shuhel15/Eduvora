import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function VerifyEmail() {
  const { user, sendVerification, reloadUser, logOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/quiz')
    }
  }, [user, navigate])

  const handleResend = async () => {
    setLoading(true)
    setMessage('')
    setError('')
    const result = await sendVerification()
    if (result.success) {
      setMessage('Verification email sent! Check your inbox.')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleRefresh = async () => {
    setLoading(true)
    await reloadUser()
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      {/* Background */}
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(99,102,241,0.13) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(236,72,153,0.08) 0%, transparent 60%)', pointerEvents:'none', zIndex: -1 }} />
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize:'52px 52px', pointerEvents:'none', zIndex: -1 }} />
      
      <div style={styles.card}>
        <div style={styles.iconContainer}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>

        <h1 style={styles.title}>Verify your email</h1>
        <p style={styles.text}>
          We've sent a verification link to <span style={styles.email}>{user?.email}</span>. 
          Please click the link in that email to continue.
        </p>

        {message && <div style={styles.success}>{message}</div>}
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.buttonGroup}>
          <button 
            onClick={handleRefresh} 
            disabled={loading}
            style={styles.primaryButton}
          >
            {loading ? 'Checking...' : "I've Verified"}
          </button>
          
          <button 
            onClick={handleResend} 
            disabled={loading}
            style={styles.secondaryButton}
          >
            Resend Email
          </button>
        </div>

        <button onClick={logOut} style={styles.linkButton}>
          Sign out and try another email
        </button>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0f',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Sora', sans-serif",
  },
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    textAlign: 'center',
    animation: 'fadeIn 0.6s ease-out forwards',
  },
  iconContainer: {
    width: '80px',
    height: '80px',
    background: 'rgba(99, 102, 241, 0.1)',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  title: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  text: {
    color: 'rgba(240, 239, 232, 0.6)',
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  email: {
    color: '#6366f1',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  primaryButton: {
    background: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  secondaryButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: 'rgba(240, 239, 232, 0.4)',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  success: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#22c55e',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '20px',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    marginBottom: '20px',
  }
}
