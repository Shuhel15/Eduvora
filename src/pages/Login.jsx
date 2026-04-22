import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbCompass, TbArrowLeft, TbEye, TbEyeOff, TbAlertCircle, TbCheck } from 'react-icons/tb'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const isValidPass  = (v) => v.length >= 6

export default function Login() {
  const navigate = useNavigate()
  const { user, loading, signInEmail, signUpEmail, signInGoogle } = useAuth()

  const [tab,         setTab]         = useState('login')
  const [showPass,    setShowPass]    = useState(false)
  const [name,        setName]        = useState('')
  const [email,       setEmail]       = useState('')
  const [pass,        setPass]        = useState('')
  const [errors,      setErrors]      = useState({})
  const [touched,     setTouched]     = useState({})
  const [submitting,  setSubmitting]  = useState(false)
  const [firebaseErr, setFirebaseErr] = useState('')

  //Redirect to quiz once Firebase confirms user is logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/quiz', { replace: true })
    }
  }, [user, loading, navigate])

  const switchTab = (t) => {
    setTab(t); setErrors({}); setTouched({})
    setName(''); setEmail(''); setPass(''); setFirebaseErr('')
  }

  const validateField = (field, value) => {
    if (field === 'name'  && tab === 'signup' && !value.trim()) return 'Full name is required'
    if (field === 'email' && !value.trim())                     return 'Email address is required'
    if (field === 'email' && value.trim() && !isValidEmail(value)) return 'Enter a valid email address'
    if (field === 'pass'  && !value)                            return 'Password is required'
    if (field === 'pass'  && value && !isValidPass(value))      return 'Password must be at least 6 characters'
    return ''
  }

  const validateAll = () => {
    const e = {}
    if (tab === 'signup') e.name = validateField('name', name)
    e.email = validateField('email', email)
    e.pass  = validateField('pass', pass)
    Object.keys(e).forEach(k => { if (!e[k]) delete e[k] })
    return e
  }

  const handleBlur = (field, value) => {
    setTouched(p => ({ ...p, [field]: true }))
    const err = validateField(field, value)
    setErrors(p => ({ ...p, [field]: err || undefined }))
  }

  const handleChange = (field, value) => {
    if (field === 'name')  setName(value)
    if (field === 'email') setEmail(value)
    if (field === 'pass')  setPass(value)
    setFirebaseErr('')
    if (touched[field]) {
      const err = validateField(field, value)
      setErrors(p => ({ ...p, [field]: err || undefined }))
    }
  }

  const handleSubmit = async () => {
    // Mark all fields as touched
    const allTouched = tab === 'signup'
      ? { name: true, email: true, pass: true }
      : { email: true, pass: true }
    setTouched(allTouched)

    const errs = validateAll()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    setFirebaseErr('')

    const result = tab === 'login'
      ? await signInEmail(email, pass)
      : await signUpEmail(email, pass, name)

    setSubmitting(false)

    if (!result.success) {
      setFirebaseErr(result.error)
    }
    // On success — useEffect watches user state and navigates automatically
    // No manual navigate() call needed here
  }

  const handleGoogle = async () => {
    setSubmitting(true)
    setFirebaseErr('')
    const result = await signInGoogle()
    setSubmitting(false)
    if (!result.success) {
      setFirebaseErr(result.error)
    }
    // Navigation handled by useEffect
  }

  const hasError = (f) => touched[f] && errors[f]
  const isOk     = (f) => touched[f] && !errors[f] && (f === 'name' ? name : f === 'email' ? email : pass)

  const inputStyle = (field) => ({
    width: '100%',
    background: hasError(field) ? 'rgba(239,68,68,0.07)' : isOk(field) ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${hasError(field) ? 'rgba(239,68,68,0.6)' : isOk(field) ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 12, padding: '13px 42px',
    color: '#f0efe8', fontFamily: "'Sora', sans-serif", fontSize: '0.9rem',
    outline: 'none', transition: 'border-color 0.2s, background 0.2s',
  })

  // Show full-screen spinner while Firebase restores session on refresh
  if (loading) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: '#0a0a0f', color: '#f0efe8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Roboto:wght@700;900&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .login-card { animation:fadeUp 0.55s cubic-bezier(.16,1,.3,1) forwards; }
        .google-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:10px; background:#fff; color:#1a1a2e; font-family:'Sora',sans-serif; font-size:0.92rem; font-weight:600; padding:13px 20px; border-radius:100px; border:none; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 2px 20px rgba(0,0,0,0.35); }
        .google-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 6px 28px rgba(0,0,0,0.45); }
        .google-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .input-wrap  { position:relative; margin-bottom:4px; }
        .input-icon  { position:absolute; left:14px;  top:50%; transform:translateY(-50%); pointer-events:none; }
        .status-icon { position:absolute; right:14px; top:50%; transform:translateY(-50%); pointer-events:none; }
        .eye-btn { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:rgba(240,239,232,0.35); padding:0; display:flex; }
        .error-msg { display:flex; align-items:center; gap:5px; font-size:0.76rem; color:#f87171; margin-bottom:10px; margin-top:4px; padding-left:2px; }
        .firebase-error { display:flex; align-items:center; gap:8px; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); padding:11px 14px; font-size:0.84rem; color:#f87171; margin-bottom:14px; border-radius:10px; }
        .submit-btn { width:100%; display:flex; align-items:center; justify-content:center; gap:8px; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; font-family:'Sora',sans-serif; font-size:0.95rem; font-weight:600; padding:14px; border-radius:100px; border:none; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s,opacity 0.2s; margin-top:6px; box-shadow:0 0 28px rgba(99,102,241,0.35); }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 6px 38px rgba(99,102,241,0.52); }
        .submit-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .tab-btn { flex:1; padding:9px; border:none; background:transparent; font-family:'Sora',sans-serif; font-size:0.88rem; font-weight:500; color:rgba(240,239,232,0.4); cursor:pointer; border-radius:9px; transition:all 0.2s; }
        .tab-btn.active { background:rgba(99,102,241,0.18); color:#a5b4fc; }
        .divider { display:flex; align-items:center; gap:10px; margin:20px 0; color:rgba(240,239,232,0.28); font-size:0.78rem; }
        .divider::before,.divider::after { content:''; flex:1; height:1px; background:rgba(255,255,255,0.07); }
        .back-btn { position:fixed; top:20px; left:20px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:100px; padding:8px 16px; color:#f0efe8; font-family:'Sora',sans-serif; font-size:0.82rem; cursor:pointer; display:flex; align-items:center; gap:6px; z-index:10; transition:background 0.2s; }
        .back-btn:hover { background:rgba(255,255,255,0.1); }
        @media(max-width:480px) { .login-card { padding:28px 20px !important; } }
      `}</style>

      {/* Background */}
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(99,102,241,0.13) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(236,72,153,0.08) 0%, transparent 60%)', pointerEvents:'none', zIndex: -1 }} />
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize:'52px 52px', pointerEvents:'none', zIndex: -1 }} />

      <button className="back-btn" onClick={() => navigate('/')}><TbArrowLeft size={14} /> Back</button>

      <div className="login-card" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:24, padding:'40px 36px', width:'100%', maxWidth:440, position:'relative', zIndex:1, backdropFilter:'blur(20px)' }}>

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:28 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <TbCompass size={18} color="#fff" />
          </div>
          <span style={{ fontWeight:700, fontSize:'1rem' }}>Eduvora</span>
        </div>

        <h1 style={{ fontFamily:"'Roboto', sans-serif", fontSize:'1.8rem', fontWeight:700, marginBottom:6, lineHeight:1.2 }}>
          {tab === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p style={{ fontSize:'0.88rem', color:'rgba(240,239,232,0.45)', marginBottom:28 }}>
          {tab === 'login' ? 'Login to continue your career journey' : 'Join Eduvora for free'}
        </p>

        {/* Google */}
        <button className="google-btn" onClick={handleGoogle} disabled={submitting}>
          {submitting
            ? <div style={{ width:18, height:18, border:'2px solid rgba(0,0,0,0.15)', borderTopColor:'#333', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
            : <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
          }
          Continue with Google
        </button>

        <div className="divider">or continue with email</div>

        {/* Tabs */}
        <div style={{ display:'flex', background:'rgba(255,255,255,0.04)', borderRadius:11, padding:4, marginBottom:20 }}>
          <button className={`tab-btn ${tab==='login'?'active':''}`} onClick={() => switchTab('login')}>Login</button>
          <button className={`tab-btn ${tab==='signup'?'active':''}`} onClick={() => switchTab('signup')}>Sign Up</button>
        </div>

        {/* Firebase error */}
        {firebaseErr && (
          <div className="firebase-error">
            <TbAlertCircle size={16} /> {firebaseErr}
          </div>
        )}

        {/* Name — signup only */}
        {tab === 'signup' && (
          <>
            <div className="input-wrap">
              <span className="input-icon" style={{ color: hasError('name') ? '#f87171' : isOk('name') ? '#6ee7b7' : 'rgba(240,239,232,0.35)' }}><FiUser size={15} /></span>
              <input style={{ ...inputStyle('name'), paddingLeft:42, paddingRight:16 }} type="text" placeholder="Full name" value={name} onChange={e => handleChange('name', e.target.value)} onBlur={e => handleBlur('name', e.target.value)} />
              {isOk('name')     && <span className="status-icon"><TbCheck size={16} color="#6ee7b7" /></span>}
              {hasError('name') && <span className="status-icon"><TbAlertCircle size={16} color="#f87171" /></span>}
            </div>
            {hasError('name') && <div className="error-msg"><TbAlertCircle size={13} /> {errors.name}</div>}
          </>
        )}

        {/* Email */}
        <div className="input-wrap">
          <span className="input-icon" style={{ color: hasError('email') ? '#f87171' : isOk('email') ? '#6ee7b7' : 'rgba(240,239,232,0.35)' }}><FiMail size={15} /></span>
          <input style={{ ...inputStyle('email'), paddingLeft:42, paddingRight:42 }} type="email" placeholder="Email address" value={email} onChange={e => handleChange('email', e.target.value)} onBlur={e => handleBlur('email', e.target.value)} />
          {isOk('email')     && <span className="status-icon"><TbCheck size={16} color="#6ee7b7" /></span>}
          {hasError('email') && <span className="status-icon"><TbAlertCircle size={16} color="#f87171" /></span>}
        </div>
        {hasError('email') && <div className="error-msg"><TbAlertCircle size={13} /> {errors.email}</div>}

        {/* Password */}
        <div className="input-wrap">
          <span className="input-icon" style={{ color: hasError('pass') ? '#f87171' : isOk('pass') ? '#6ee7b7' : 'rgba(240,239,232,0.35)' }}><FiLock size={15} /></span>
          <input style={{ ...inputStyle('pass'), paddingLeft:42, paddingRight:42 }} type={showPass ? 'text' : 'password'} placeholder={tab === 'signup' ? 'Password (min. 6 characters)' : 'Password'} value={pass} onChange={e => handleChange('pass', e.target.value)} onBlur={e => handleBlur('pass', e.target.value)} />
          <button className="eye-btn" onClick={() => setShowPass(!showPass)}>
            {showPass ? <TbEyeOff size={16} /> : <TbEye size={16} />}
          </button>
        </div>
        {hasError('pass') && <div className="error-msg"><TbAlertCircle size={13} /> {errors.pass}</div>}

        {/* Forgot password */}
        {tab === 'login' && (
          <div style={{ textAlign:'right', marginBottom:16, marginTop:6 }}>
            <span style={{ fontSize:'0.8rem', color:'#a5b4fc', cursor:'pointer' }}>Forgot password?</span>
          </div>
        )}

        {/* Password strength */}
        {tab === 'signup' && pass.length > 0 && (
          <div style={{ marginBottom:14, marginTop:6 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontSize:'0.72rem', color:'rgba(240,239,232,0.4)' }}>Password strength</span>
              <span style={{ fontSize:'0.72rem', fontWeight:600, color: pass.length < 6 ? '#f87171' : pass.length < 10 ? '#fcd34d' : '#6ee7b7' }}>
                {pass.length < 6 ? 'Weak' : pass.length < 10 ? 'Medium' : 'Strong'}
              </span>
            </div>
            <div style={{ display:'flex', gap:4 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ flex:1, height:3, borderRadius:100, transition:'background 0.3s',
                  background: i===1&&pass.length>=1 ? (pass.length<6?'#f87171':pass.length<10?'#fcd34d':'#6ee7b7') : i===2&&pass.length>=6 ? (pass.length<10?'#fcd34d':'#6ee7b7') : i===3&&pass.length>=10 ? '#6ee7b7' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
                {tab === 'login' ? 'Logging in...' : 'Creating account...'}
              </>
            : tab === 'login' ? 'Login → Start Quiz' : 'Create Account'
          }
        </button>

        {/* Switch tab hint */}
        <p style={{ textAlign:'center', fontSize:'0.82rem', color:'rgba(240,239,232,0.35)', marginTop:18 }}>
          {tab === 'login'
            ? <>Don't have an account? <span style={{ color:'#a5b4fc', cursor:'pointer' }} onClick={() => switchTab('signup')}>Sign Up</span></>
            : <>Already have an account? <span style={{ color:'#a5b4fc', cursor:'pointer' }} onClick={() => switchTab('login')}>Login</span></>
          }
        </p>

        <p style={{ textAlign:'center', fontSize:'0.76rem', color:'rgba(240,239,232,0.25)', marginTop:10, lineHeight:1.5 }}>
          By continuing, you agree to our Terms &amp; Privacy Policy
        </p>
      </div>
    </div>
  )
}