import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TbCompass, TbPlus, TbLogout, TbHistory,
  TbBriefcase, TbRoad, TbCalendar,
  TbCheck, TbStar, TbTrendingUp, TbBook,
  TbSchool, TbChevronRight, TbX, TbAward,
  TbTarget, TbSparkles, TbArrowUpRight
} from 'react-icons/tb'
import { HiOutlineAcademicCap, HiOutlineSparkles } from 'react-icons/hi2'
import { MdOutlineScience, MdBusinessCenter, MdColorLens } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'
import { getQuizHistory } from '../utils/firestore'

const gradeStyle = {
  '10': { bg:'rgba(99,102,241,0.15)', border:'rgba(99,102,241,0.35)', text:'#a5b4fc', label:'Class 10', gradient:'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.1))' },
  '12': { bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.35)', text:'#6ee7b7', label:'Class 12', gradient:'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(5,150,105,0.1))' },
}

const streamStyle = {
  Science: { icon: MdOutlineScience, color:'#6ee7b7', bg:'rgba(16,185,129,0.12)' },
  Commerce:{ icon: MdBusinessCenter,  color:'#fcd34d', bg:'rgba(245,158,11,0.12)' },
  Arts:    { icon: MdColorLens,       color:'#f9a8d4', bg:'rgba(236,72,153,0.12)' },
}

const growthColor = {
  'Very High':{ bg:'rgba(16,185,129,0.13)', text:'#6ee7b7' },
  'High':     { bg:'rgba(99,102,241,0.13)', text:'#a5b4fc' },
  'Moderate': { bg:'rgba(245,158,11,0.13)', text:'#fcd34d' },
  'Stable':   { bg:'rgba(156,163,175,0.13)',text:'#d1d5db' },
}

function timeAgo(ts) {
  if (!ts) return 'Just now'
  const d    = ts.toDate ? ts.toDate() : new Date(ts)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60)     return 'Just now'
  if (diff < 3600)   return `${Math.floor(diff/60)}m ago`
  if (diff < 86400)  return `${Math.floor(diff/3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff/86400)}d ago`
  return d.toLocaleDateString('en-IN',{ day:'numeric', month:'short', year:'numeric' })
}

function getTitle(quiz) {
  if (quiz.grade==='10') return quiz.result?.recommended ? `${quiz.result.recommended} Stream` : 'Stream Result'
  return quiz.result?.courses?.[0]?.name || 'Course Result'
}

function getMatch(quiz) {
  if (quiz.grade==='10') return quiz.result?.match
  return quiz.result?.courses?.[0]?.match
}

// Result Modal 
function ResultModal({ quiz, onClose }) {
  const [tab, setTab] = useState('overview')
  const gs     = gradeStyle[quiz.grade] || gradeStyle['12']
  const is10   = quiz.grade === '10'
  const data   = is10 ? quiz.result : quiz.result?.courses?.[0]
  const allCourses = quiz.result?.courses || []
  if (!data) return null
  const ss         = is10 ? (streamStyle[data.recommended] || streamStyle.Science) : null
  const StreamIcon = ss?.icon

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={e => { if(e.target===e.currentTarget) onClose() }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.8)', backdropFilter:'blur(10px)' }} />
      <div style={{ position:'relative', zIndex:1, background:'#0f0f18', border:'1px solid rgba(255,255,255,0.1)', borderRadius:24, width:'100%', maxWidth:680, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:gs.bg, border:`1px solid ${gs.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {is10 && StreamIcon ? <StreamIcon size={18} color={ss.color} /> : <HiOutlineAcademicCap size={18} color={gs.text} />}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:'1rem' }}>{getTitle(quiz)}</div>
              <div style={{ fontSize:'0.75rem', color:'rgba(240,239,232,0.4)', display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
                <span style={{ background:gs.bg, color:gs.text, border:`1px solid ${gs.border}`, borderRadius:100, padding:'1px 8px', fontSize:'0.68rem', fontWeight:600 }}>{gs.label}</span>
                <TbCalendar size={11} /> {timeAgo(quiz.createdAt)}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#f0efe8', flexShrink:0 }}>
            <TbX size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:6, padding:'14px 24px 0', overflowX:'auto', flexShrink:0 }}>
          {[['overview','Overview'],['answers','Answers'],...(is10?[['tips','Tips']]:[['jobs','Jobs & Salary'],['roadmap','Roadmap']])].map(([k,label]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding:'8px 16px', borderRadius:100, border:`1px solid ${tab===k?'rgba(99,102,241,0.5)':'rgba(255,255,255,0.08)'}`, background:tab===k?'rgba(99,102,241,0.18)':'transparent', color:tab===k?'#a5b4fc':'rgba(240,239,232,0.45)', fontFamily:"'Sora',sans-serif", fontSize:'0.82rem', fontWeight:500, cursor:'pointer', whiteSpace:'nowrap', transition:'all 0.18s', flexShrink:0 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ overflowY:'auto', padding:'20px 24px', flex:1 }}>
          {tab==='overview' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ background:is10?`linear-gradient(135deg,${ss?.bg},rgba(255,255,255,0.02))`:gs.gradient, border:`1px solid ${is10?ss?.color+'33':gs.border}`, borderRadius:18, padding:'22px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
                <div>
                  <div style={{ fontSize:'0.72rem', color:is10?ss?.color:gs.text, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>{is10?'Recommended Stream':'Top Course'}</div>
                  <div style={{ fontFamily:"'Roboto',sans-serif", fontSize:'clamp(1.3rem,3vw,1.75rem)', fontWeight:700, marginBottom:8 }}>{is10?data.recommended:data.name}</div>
                  {data.why && <p style={{ fontSize:'0.86rem', color:'rgba(240,239,232,0.6)', lineHeight:1.65, maxWidth:400 }}>{data.why}</p>}
                </div>
                <div style={{ textAlign:'center', flexShrink:0 }}>
                  <div style={{ fontSize:'3rem', fontWeight:800, background:`linear-gradient(135deg,${is10?ss?.color:gs.text},#fff)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{getMatch(quiz)}%</div>
                  <div style={{ fontSize:'0.72rem', color:'rgba(240,239,232,0.38)', marginTop:2 }}>AI Match</div>
                </div>
              </div>
              {is10 && data.strengths && (
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'18px' }}>
                  <h4 style={{ fontSize:'0.88rem', fontWeight:600, marginBottom:12, display:'flex', alignItems:'center', gap:6 }}><TbStar size={15} color={ss?.color} /> Your Strengths</h4>
                  {data.strengths.map((s,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:8 }}>
                      <div style={{ width:20, height:20, borderRadius:'50%', background:ss?.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><TbCheck size={11} color={ss?.color} /></div>
                      <span style={{ fontSize:'0.86rem', color:'rgba(240,239,232,0.7)' }}>{s}</span>
                    </div>
                  ))}
                </div>
              )}
              {!is10 && allCourses.length > 0 && (
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:'18px' }}>
                  <h4 style={{ fontSize:'0.88rem', fontWeight:600, marginBottom:14, display:'flex', alignItems:'center', gap:6 }}><HiOutlineAcademicCap size={15} color="#a5b4fc" /> All Recommended Courses</h4>
                  {allCourses.map((c,i) => (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:i<allCourses.length-1?'1px solid rgba(255,255,255,0.05)':'none', gap:10 }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
                          {i===0 && <span style={{ background:'rgba(16,185,129,0.15)', color:'#6ee7b7', fontSize:'0.65rem', fontWeight:700, padding:'2px 8px', borderRadius:100 }}>Top Pick</span>}
                          <span style={{ fontSize:'0.76rem', color:'rgba(240,239,232,0.4)' }}>{c.tag} · {c.duration}</span>
                        </div>
                        <div style={{ fontWeight:600, fontSize:'0.92rem' }}>{c.name}</div>
                      </div>
                      <div style={{ fontSize:'1.2rem', fontWeight:700, color:gs.text, flexShrink:0 }}>{c.match}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab==='answers' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <p style={{ fontSize:'0.82rem', color:'rgba(240,239,232,0.4)', marginBottom:4 }}>Your responses to the quiz</p>
              {Object.entries(quiz.answers||{}).map(([q,a],i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'14px 16px' }}>
                  <div style={{ fontSize:'0.72rem', color:'rgba(240,239,232,0.35)', marginBottom:5, fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' }}>Question {q}</div>
                  <div style={{ fontSize:'0.9rem', color:'rgba(240,239,232,0.82)', fontWeight:500 }}>{a}</div>
                </div>
              ))}
            </div>
          )}
          {tab==='tips' && is10 && data.tips && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {data.tips.map((t,i) => (
                <div key={i} style={{ display:'flex', gap:14, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'16px' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700, color:'#fff', flexShrink:0 }}>{i+1}</div>
                  <p style={{ fontSize:'0.88rem', color:'rgba(240,239,232,0.72)', lineHeight:1.65, paddingTop:3 }}>{t}</p>
                </div>
              ))}
            </div>
          )}
          {tab==='jobs' && !is10 && data.jobs && (
            <div>
              {data.jobs.map((j,i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'13px 0', borderBottom:i<data.jobs.length-1?'1px solid rgba(255,255,255,0.05)':'none', gap:12, flexWrap:'wrap' }}>
                  <div>
                    <div style={{ fontWeight:500, fontSize:'0.92rem', marginBottom:3 }}>{j.title}</div>
                    <div style={{ fontSize:'0.8rem', color:'rgba(240,239,232,0.45)' }}>Avg: <strong style={{ color:'#f0efe8' }}>{j.salary}</strong></div>
                  </div>
                  <span style={{ background:growthColor[j.growth]?.bg||'rgba(255,255,255,0.05)', color:growthColor[j.growth]?.text||'#f0efe8', borderRadius:100, padding:'4px 12px', fontSize:'0.75rem', fontWeight:600, flexShrink:0 }}>{j.growth}</span>
                </div>
              ))}
            </div>
          )}
          {tab==='roadmap' && !is10 && data.roadmap && (
            <div style={{ position:'relative' }}>
              <div style={{ position:'absolute', left:15, top:10, bottom:10, width:2, background:'rgba(99,102,241,0.2)', borderRadius:2 }} />
              <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                {data.roadmap.map((r,i) => (
                  <div key={i} style={{ display:'flex', gap:18, alignItems:'flex-start' }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.78rem', fontWeight:700, color:'#fff', flexShrink:0, zIndex:1 }}>{i+1}</div>
                    <div style={{ flex:1, paddingTop:4 }}>
                      <div style={{ fontWeight:600, fontSize:'0.9rem', color:'#a5b4fc', marginBottom:4 }}>{r.year}</div>
                      <div style={{ fontSize:'0.86rem', color:'rgba(240,239,232,0.62)', lineHeight:1.6 }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Main Dashboard 
export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logOut } = useAuth()
  const [history,  setHistory]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null)
  const [countVals,setCountVals]= useState([0,0,0,0])

  const displayName  = user?.displayName || user?.email?.split('@')[0] || 'Student'
  const avatarLetter = displayName[0]?.toUpperCase()

  useEffect(() => {
    if (!user) return
    getQuizHistory(user.uid).then(d => { setHistory(d); setLoading(false) })
  }, [user])

  // Animate stat counters whenever history loads
  useEffect(() => {
    if (loading || history.length === 0) return

    const targets = [
      history.length,
      history.filter(q => q.grade === '10').length,
      history.filter(q => q.grade === '12').length,
      Math.max(0, ...history.map(q => getMatch(q) || 0)),
    ]

    // Set final values immediately as fallback
    setCountVals(targets)

    // Then animate from 0
    const duration = 1200
    const steps    = 50
    const interval = duration / steps
    let step = 0

    setCountVals([0, 0, 0, 0])

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased    = 1 - Math.pow(1 - progress, 3)
      setCountVals(targets.map(t => Math.round(t * eased)))
      if (step >= steps) {
        setCountVals(targets)
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [loading, history])

  const handleLogout = async () => { await logOut(); navigate('/') }

  const bestMatch = Math.max(0,...history.map(q=>getMatch(q)||0))

  return (
    <div style={{ fontFamily:"'Sora',sans-serif", background:'#080810', color:'#f0efe8', minHeight:'100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Roboto:wght@700;900&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes floatUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }

        .fade-up { animation:fadeUp 0.55s cubic-bezier(.16,1,.3,1) both; }

        .quiz-card {
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:20px; cursor:pointer;
          transition:all 0.25s cubic-bezier(.16,1,.3,1);
          overflow:hidden; position:relative;
        }
        .quiz-card::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(99,102,241,0.06),transparent);
          opacity:0; transition:opacity 0.25s;
        }
        .quiz-card:hover { border-color:rgba(99,102,241,0.45); transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,0.35); }
        .quiz-card:hover::before { opacity:1; }

        .stat-card {
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(255,255,255,0.07);
          border-radius:20px; padding:22px;
          transition:all 0.25s; position:relative; overflow:hidden;
        }
        .stat-card::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
          opacity:0; transition:opacity 0.25s;
        }
        .stat-card:hover { transform:translateY(-3px); box-shadow:0 8px 32px rgba(0,0,0,0.3); }
        .stat-card.s0:hover { border-color:rgba(99,102,241,0.4); }
        .stat-card.s1:hover { border-color:rgba(245,158,11,0.4); }
        .stat-card.s2:hover { border-color:rgba(16,185,129,0.4); }
        .stat-card.s3:hover { border-color:rgba(236,72,153,0.4); }

        .nav-btn {
          background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
          border-radius:100px; padding:8px 18px; color:#f0efe8;
          font-family:'Sora',sans-serif; font-size:0.84rem; cursor:pointer;
          display:flex; align-items:center; gap:7px; transition:all 0.2s;
        }
        .nav-btn:hover { background:rgba(255,255,255,0.1); }

        .new-quiz-btn {
          display:flex; align-items:center; gap:7px;
          background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff;
          font-family:'Sora',sans-serif; font-size:0.84rem; font-weight:600;
          padding:9px 18px; border-radius:100px; border:none; cursor:pointer;
          transition:all 0.2s; white-space:nowrap; flex-shrink:0;
          box-shadow:0 0 20px rgba(99,102,241,0.35);
        }
        .new-quiz-btn:hover { transform:translateY(-1px); box-shadow:0 4px 24px rgba(99,102,241,0.55); }

        .grade-badge {
          display:inline-flex; align-items:center;
          border-radius:100px; padding:3px 10px;
          font-size:0.7rem; font-weight:600;
        }

        @media(max-width:640px) {
          .stats-grid  { grid-template-columns:1fr 1fr !important; }
          .cards-grid  { grid-template-columns:1fr !important; }
          .nav-wrap    { padding:12px 16px !important; }
          .page-wrap   { padding:16px !important; }
        }
      `}</style>

      {modal && <ResultModal quiz={modal} onClose={() => setModal(null)} />}

      {/* Background */}
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(99,102,241,0.13) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(236,72,153,0.08) 0%, transparent 60%)', pointerEvents:'none', zIndex: -1 }} />
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize:'52px 52px', pointerEvents:'none', zIndex: -1 }} />

      {/* ── Navbar ── */}
      <nav className="nav-wrap" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 24px', borderBottom:'1px solid rgba(255,255,255,0.05)', position:'sticky', top:0, zIndex:10, background:'rgba(8,8,16,0.95)', backdropFilter:'blur(20px)', gap:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 14px rgba(99,102,241,0.4)' }}>
            <TbCompass size={18} color="#fff" />
          </div>
          <span style={{ fontWeight:700, fontSize:'1rem', letterSpacing:'-0.02em' }}>Eduvora</span>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {/* <button className="new-quiz-btn" onClick={() => navigate('/quiz')}>
            <TbPlus size={14} /> New Quiz
          </button> */}
          <button className="nav-btn" onClick={handleLogout}>
            <TbLogout size={14} />
          </button>
        </div>
      </nav>

      <div className="page-wrap" style={{ maxWidth:1080, margin:'0 auto', padding:'24px 20px' }}>

        {/* ── Welcome Hero ── */}
        <div className="fade-up" style={{ position:'relative', borderRadius:24, overflow:'hidden', marginBottom:24, background:'linear-gradient(135deg,rgba(99,102,241,0.2) 0%,rgba(139,92,246,0.15) 40%,rgba(16,185,129,0.08) 100%)', border:'1px solid rgba(99,102,241,0.25)', padding:'28px 28px' }}>
          {/* Background grid */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none' }} />
          {/* Glow orb */}
          <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'rgba(99,102,241,0.15)', filter:'blur(60px)', pointerEvents:'none' }} />

          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:16, flexWrap:'nowrap' }}>
            {/* Avatar */}
            <div style={{ width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', fontWeight:700, color:'#fff', flexShrink:0, boxShadow:'0 0 24px rgba(99,102,241,0.5)', border:'2px solid rgba(255,255,255,0.2)' }}>
              {avatarLetter}
            </div>

            {/* Text */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                <h1 style={{ fontFamily:"'Roboto',sans-serif", fontSize:'clamp(1rem,3.5vw,1.55rem)', fontWeight:900, lineHeight:1.1, letterSpacing:'-0.02em', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  Welcome back, {displayName}!
                </h1>
                {history.length > 0 && (
                  <span style={{ background:'rgba(16,185,129,0.15)', color:'#6ee7b7', border:'1px solid rgba(16,185,129,0.3)', borderRadius:100, padding:'2px 10px', fontSize:'0.7rem', fontWeight:600, flexShrink:0 }}>
                    🎯 {bestMatch}% Best Match
                  </span>
                )}
              </div>
              <p style={{ fontSize:'0.82rem', color:'rgba(240,239,232,0.55)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {loading ? 'Loading your progress...' :
                 history.length > 0 ? `${history.length} quiz${history.length>1?'zes':''} completed — tap any card to review your AI results` :
                 'Start your career journey — take your first quiz!'}
              </p>
            </div>

            {/* CTA */}
            <button className="new-quiz-btn" onClick={() => navigate('/quiz')} style={{ display:'flex' }}>
              <TbPlus size={14} /> New Quiz
            </button>
          </div>
        </div>

        {/* Stats Grid  */}
        {history.length > 0 && (
          <div className="stats-grid fade-up" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28, animationDelay:'0.1s' }}>
            {[
              { label:'Total Quizzes',    value:countVals[0], suffix:'',  icon:TbHistory,    color:'#a5b4fc', cls:'s0', desc:'All time' },
              { label:'Class 10',         value:countVals[1], suffix:'',  icon:TbBook,       color:'#fcd34d', cls:'s1', desc:'Stream quizzes' },
              { label:'Class 12',         value:countVals[2], suffix:'',  icon:TbSchool,     color:'#6ee7b7', cls:'s2', desc:'Course quizzes' },
              { label:'Best Match',       value:countVals[3], suffix:'%', icon:TbAward,      color:'#f9a8d4', cls:'s3', desc:'AI accuracy' },
            ].map((s,i) => {
              const Icon = s.icon
              return (
                <div key={s.label} className={`stat-card ${s.cls}`} style={{ animationDelay:`${0.1+i*0.06}s` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                    <div style={{ width:40, height:40, borderRadius:12, background:`${s.color}15`, border:`1px solid ${s.color}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={19} color={s.color} />
                    </div>
                    <TbArrowUpRight size={14} color="rgba(240,239,232,0.2)" />
                  </div>
                  <div style={{ fontSize:'2.2rem', fontWeight:800, color:s.color, lineHeight:1, marginBottom:6, fontFamily:"'Roboto',sans-serif" }}>
                    {s.value}{s.suffix}
                  </div>
                  <div style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(240,239,232,0.7)', marginBottom:2 }}>{s.label}</div>
                  <div style={{ fontSize:'0.72rem', color:'rgba(240,239,232,0.3)' }}>{s.desc}</div>
                </div>
              )
            })}
          </div>
        )}

        {/*  History Header */}
        <div className="fade-up" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, animationDelay:'0.2s' }}>
          <div>
            <h2 style={{ fontFamily:"'Roboto',sans-serif", fontSize:'1.1rem', fontWeight:700, display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
              <TbHistory size={18} color="#a5b4fc" /> Quiz History
            </h2>
            {history.length > 0 && <p style={{ fontSize:'0.78rem', color:'rgba(240,239,232,0.35)' }}>Click any card to view your full AI result</p>}
          </div>
          {history.length > 0 && (
            <span style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', borderRadius:100, padding:'4px 12px', fontSize:'0.76rem', color:'#a5b4fc', fontWeight:500 }}>
              {history.length} result{history.length>1?'s':''}
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'56px 0', gap:12 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', border:'2px solid rgba(99,102,241,0.2)', borderTopColor:'#6366f1', animation:'spin 0.8s linear infinite' }} />
            <span style={{ color:'rgba(240,239,232,0.4)', fontSize:'0.9rem' }}>Loading your history...</span>
          </div>
        )}

        {/* Empty state */}
        {!loading && history.length === 0 && (
          <div className="fade-up" style={{ textAlign:'center', padding:'64px 24px', background:'rgba(255,255,255,0.02)', border:'1px dashed rgba(255,255,255,0.08)', borderRadius:24 }}>
            <div style={{ width:72, height:72, borderRadius:20, background:'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))', border:'1px solid rgba(99,102,241,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', animation:'floatUp 3s ease-in-out infinite' }}>
              <HiOutlineSparkles size={32} color="#a5b4fc" />
            </div>
            <h3 style={{ fontFamily:"'Roboto',sans-serif", fontSize:'1.3rem', fontWeight:700, marginBottom:10 }}>Your journey starts here</h3>
            <p style={{ color:'rgba(240,239,232,0.4)', fontSize:'0.9rem', marginBottom:28, lineHeight:1.7, maxWidth:320, margin:'0 auto 28px' }}>
              Take a quiz and get personalized AI career recommendations for your future
            </p>
            <button onClick={() => navigate('/quiz')} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', fontFamily:"'Sora',sans-serif", fontSize:'0.95rem', fontWeight:600, padding:'13px 28px', borderRadius:100, border:'none', cursor:'pointer', boxShadow:'0 0 28px rgba(99,102,241,0.4)' }}>
              <TbSparkles size={16} /> Take Your First Quiz
            </button>
          </div>
        )}

        {/* Quiz Cards Grid  */}
        {!loading && history.length > 0 && (
          <div className="cards-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
            {history.map((quiz, i) => {
              const gs     = gradeStyle[quiz.grade] || gradeStyle['12']
              const title  = getTitle(quiz)
              const match  = getMatch(quiz)
              const is10   = quiz.grade === '10'
              const ss     = is10 ? (streamStyle[quiz.result?.recommended] || streamStyle.Science) : null
              const StreamIcon = ss?.icon
              const accentColor = is10 ? (ss?.color || gs.text) : gs.text

              return (
                <div key={quiz.id} className="quiz-card fade-up" style={{ animationDelay:`${0.25+i*0.05}s` }} onClick={() => setModal(quiz)}>

                  {/* Top accent line */}
                  <div style={{ height:3, background:`linear-gradient(90deg,${accentColor},${accentColor}44,transparent)` }} />

                  <div style={{ padding:'18px 20px' }}>
                    {/* Header row */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:40, height:40, borderRadius:12, background:is10?(ss?.bg||gs.bg):gs.bg, border:`1px solid ${accentColor}33`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {is10 && StreamIcon ? <StreamIcon size={20} color={ss?.color} /> : <HiOutlineAcademicCap size={20} color={gs.text} />}
                        </div>
                        <div>
                          <span className="grade-badge" style={{ background:gs.bg, color:gs.text, border:`1px solid ${gs.border}` }}>{gs.label}</span>
                          <div style={{ fontSize:'0.7rem', color:'rgba(240,239,232,0.35)', marginTop:3, display:'flex', alignItems:'center', gap:3 }}>
                            <TbCalendar size={10} /> {timeAgo(quiz.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* Match score */}
                      {match && (
                        <div style={{ textAlign:'right', background:`${accentColor}10`, border:`1px solid ${accentColor}25`, borderRadius:12, padding:'6px 10px' }}>
                          <div style={{ fontSize:'1.35rem', fontWeight:800, color:accentColor, lineHeight:1 }}>{match}%</div>
                          <div style={{ fontSize:'0.6rem', color:'rgba(240,239,232,0.35)', marginTop:1 }}>AI Match</div>
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <h3 style={{ fontWeight:700, fontSize:'0.98rem', marginBottom:4, lineHeight:1.3, color:'#f0efe8' }}>{title}</h3>
                    <p style={{ fontSize:'0.76rem', color:'rgba(240,239,232,0.4)', marginBottom:16 }}>
                      {is10 ? 'Stream recommendation' : 'Course recommendation'} · {Object.keys(quiz.answers||{}).length} questions
                    </p>

                    {/* Footer */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize:'0.78rem', color:accentColor, fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
                        <TbTarget size={13} /> View full result
                      </span>
                      <div style={{ width:28, height:28, borderRadius:8, background:`${accentColor}15`, border:`1px solid ${accentColor}25`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <TbChevronRight size={14} color={accentColor} />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}