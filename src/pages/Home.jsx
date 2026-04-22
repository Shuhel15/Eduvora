import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { HiOutlineChartBar, HiOutlineMap, HiOutlineSparkles, HiOutlineAcademicCap } from 'react-icons/hi2'
import { MdOutlineScience, MdBusinessCenter, MdColorLens, MdComputer, MdLocalHospital, MdManageAccounts } from 'react-icons/md'
import { TbTargetArrow, TbRocket, TbCompass, TbBulb, TbTrendingUp, TbSchool } from 'react-icons/tb'
import { FiArrowRight } from 'react-icons/fi'

const features = [
  { icon: HiOutlineAcademicCap, color: '#a5b4fc', bg: 'rgba(99,102,241,0.12)',  title: 'AI-Powered Quiz',             desc: 'Answer 15–20 smart questions about your interests and strengths.' },
  { icon: TbTargetArrow,        color: '#6ee7b7', bg: 'rgba(16,185,129,0.12)',   title: 'Personalized Recommendation', desc: 'Our AI maps your answers to the perfect stream or course.' },
  { icon: TbTrendingUp,         color: '#fcd34d', bg: 'rgba(245,158,11,0.12)',   title: 'Career & Salary Insights',    desc: 'Explore future jobs, average salaries, and growth scope.' },
  { icon: HiOutlineMap,         color: '#f9a8d4', bg: 'rgba(236,72,153,0.12)',   title: 'Find Colleges Near You',      desc: 'Google Maps shows top colleges offering your course nearby.' },
]

const steps = [
  { num: '01', label: 'Take the Quiz',       icon: TbBulb },
  { num: '02', label: 'Get AI Suggestions',  icon: HiOutlineSparkles },
  { num: '03', label: 'Explore Careers',     icon: TbTrendingUp },
  { num: '04', label: 'Find Colleges',       icon: TbSchool },
]

const streams = [
  { name: 'Science',    icon: MdOutlineScience,  color: '#6ee7b7', bg: 'rgba(16,185,129,0.1)',  courses: 'Engineering · Medicine · Research' },
  { name: 'Commerce',   icon: MdBusinessCenter,  color: '#fcd34d', bg: 'rgba(245,158,11,0.1)',  courses: 'CA · MBA · Finance · Banking' },
  { name: 'Arts',       icon: MdColorLens,       color: '#f9a8d4', bg: 'rgba(236,72,153,0.1)',  courses: 'Design · Law · Journalism · Psychology' },
  { name: 'Technology', icon: MdComputer,        color: '#a5b4fc', bg: 'rgba(99,102,241,0.1)',  courses: 'CS · Data Science · AI · Cybersecurity' },
  { name: 'Management', icon: MdManageAccounts,  color: '#fdba74', bg: 'rgba(249,115,22,0.1)',  courses: 'BBA · Marketing · HR · Entrepreneurship' },
  { name: 'Paramedical',icon: MdLocalHospital,   color: '#86efac', bg: 'rgba(34,197,94,0.1)',   courses: 'Pharmacy · Nursing · Physiotherapy' },
]

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", background: '#0a0a0f', color: '#f0efe8', overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Roboto:wght@700;900&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        /* Reveal */
        .reveal { opacity:0; transform:translateY(26px); transition:opacity 0.65s cubic-bezier(.16,1,.3,1), transform 0.65s cubic-bezier(.16,1,.3,1); }
        .reveal.visible { opacity:1; transform:none; }
        .d1{transition-delay:0.08s} .d2{transition-delay:0.16s} .d3{transition-delay:0.24s} .d4{transition-delay:0.32s}

        /* Background */
        .mesh-bg {
          position:fixed; inset:0; z-index:-1;
          background:
            radial-gradient(ellipse 80% 60% at 10% 20%, rgba(99,102,241,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 90% 80%, rgba(236,72,153,0.1)  0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(16,185,129,0.07) 0%, transparent 70%);
        }
        .grid-bg {
          position:fixed; inset:0; z-index:-1;
          background-image: linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 52px 52px;
        }

        /* Float */
        @keyframes float  { 0%,100%{transform:translateY(0)}    50%{transform:translateY(-10px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(5deg)} }
        .fi  { animation: float  5s ease-in-out infinite; }
        .fib { animation: floatB 6s ease-in-out 1.5s infinite; }

        /* Buttons */
        .cta-btn {
          display:inline-flex; align-items:center; gap:9px;
          background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff;
          font-family:'Sora',sans-serif; font-size:1rem; font-weight:600;
          padding:14px 32px; border-radius:100px; border:none; cursor:pointer;
          transition:transform 0.2s, box-shadow 0.2s;
          box-shadow:0 0 32px rgba(99,102,241,0.38);
        }
        .cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 44px rgba(99,102,241,0.55); }
        .ghost-btn {
          display:inline-flex; align-items:center; gap:8px;
          background:transparent; color:#f0efe8;
          font-family:'Sora',sans-serif; font-size:1rem; font-weight:500;
          padding:13px 28px; border-radius:100px;
          border:1px solid rgba(240,239,232,0.18); cursor:pointer;
          transition:background 0.2s, border-color 0.2s;
        }
        .ghost-btn:hover { background:rgba(255,255,255,0.06); border-color:rgba(240,239,232,0.38); }

        /* Cards */
        .feature-card {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          border-radius:20px; padding:28px;
          transition:background 0.25s, border-color 0.25s, transform 0.25s;
        }
        .feature-card:hover { background:rgba(255,255,255,0.07); border-color:rgba(99,102,241,0.38); transform:translateY(-4px); }

        .how-grid { grid-template-columns:repeat(4,1fr) !important; }
        .step-connector { display:block; }
        .step-circle:hover { transform:scale(1.1); box-shadow:0 0 24px rgba(99,102,241,0.3); }

        .step-pill {
          display:flex; align-items:center; gap:14px;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          border-radius:100px; padding:14px 22px; transition:all 0.2s;
        }
        .step-pill:hover { background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.3); }

        .stream-card {
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07);
          border-radius:16px; padding:22px; transition:all 0.25s; cursor:pointer;
        }
        .stream-card:hover { background:rgba(255,255,255,0.06); border-color:rgba(255,255,255,0.18); transform:translateY(-3px); }

        .stat-card {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          border-radius:16px; padding:24px 16px; text-align:center;
        }

        .grad-text {
          background:linear-gradient(135deg,#a5b4fc,#f9a8d4,#6ee7b7);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }

        /*  RESPONSIVE */
        .section-inner { max-width:1140px; margin:0 auto; padding:0 24px; }

        .hero-section  { padding:100px 24px 60px; }
        .feat-section  { padding:88px 0; }
        .how-section   { padding:88px 0; }
        .stream-section{ padding:88px 0; }
        .stats-section { padding:64px 0; }
        .cta-section   { padding:110px 24px; }

        .hero-title    { font-size:3.8rem; }
        .hero-sub      { font-size:1.08rem; }
        .feat-grid     { grid-template-columns:repeat(2,1fr); }
        .steps-grid    { grid-template-columns:repeat(2,1fr); }
        .streams-grid  { grid-template-columns:repeat(3,1fr); }
        .stats-grid    { grid-template-columns:repeat(4,1fr); }
        .section-title { font-size:2.6rem; }

        /* Tablet */
        @media(max-width:900px){
          .streams-grid  { grid-template-columns:repeat(2,1fr) !important; }
          .stats-grid    { grid-template-columns:repeat(2,1fr) !important; }
          .hero-title    { font-size:3rem !important; }
          .section-title { font-size:2.1rem !important; }
          .footer-grid   { grid-template-columns:1fr 1fr !important; gap:32px !important; }
        }

        /* Mobile */
        @media(max-width:600px){
          .hero-section  { padding:56px 18px 40px !important; }
          .footer-grid   { grid-template-columns:1fr !important; gap:32px !important; }
          .feat-section  { padding:64px 0 !important; }
          .how-section   { padding:64px 0 !important; }
          .stream-section{ padding:64px 0 !important; }
          .stats-section { padding:48px 0 !important; }
          .cta-section   { padding:72px 18px !important; }
          .section-inner { padding:0 18px !important; }

          .hero-title    { font-size:2.8rem !important; line-height:1.1 !important; }
          .hero-sub      { font-size:0.95rem !important; }
          .section-title { font-size:1.85rem !important; }

          .feat-grid     { grid-template-columns:1fr !important; }
          .how-grid      { grid-template-columns:repeat(2,1fr) !important; }
          .step-connector{ display:none !important; }
          .streams-grid  { grid-template-columns:repeat(2,1fr) !important; }
          .stats-grid    { grid-template-columns:repeat(2,1fr) !important; }

          .hero-btns     { flex-direction:column !important; align-items:stretch !important; }
          .hero-btns button { width:100% !important; justify-content:center !important; }

          .hero-stats    { gap:20px !important; }
          .float-icons   { display:none !important; }

          .step-pill     { border-radius:14px !important; }
          .stream-card   { padding:16px !important; }
          .cta-btn, .ghost-btn { font-size:0.95rem !important; }
        }
      `}</style>

      <div className="mesh-bg" />
      <div className="grid-bg" />

      {/*  HERO*/}
      <section className="hero-section" style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center' }}>

        {/* Floating icons */}
        <div className="float-icons">
          <div className="fi"  style={{ position:'absolute', top:'22%', left:'6%',  width:50, height:50, borderRadius:13, background:'rgba(99,102,241,0.14)', border:'1px solid rgba(99,102,241,0.24)', display:'flex', alignItems:'center', justifyContent:'center' }}><MdOutlineScience size={24} color="#a5b4fc" /></div>
          <div className="fib" style={{ position:'absolute', top:'28%', right:'6%', width:46, height:46, borderRadius:12, background:'rgba(16,185,129,0.11)',  border:'1px solid rgba(16,185,129,0.22)',  display:'flex', alignItems:'center', justifyContent:'center' }}><TbTargetArrow    size={21} color="#6ee7b7" /></div>
          <div className="fi"  style={{ position:'absolute', bottom:'28%', left:'9%',  width:44, height:44, borderRadius:12, background:'rgba(245,158,11,0.11)', border:'1px solid rgba(245,158,11,0.2)',  display:'flex', alignItems:'center', justifyContent:'center' }}><HiOutlineChartBar size={21} color="#fcd34d" /></div>
          <div className="fib" style={{ position:'absolute', bottom:'32%', right:'9%', width:46, height:46, borderRadius:12, background:'rgba(236,72,153,0.1)',  border:'1px solid rgba(236,72,153,0.2)',  display:'flex', alignItems:'center', justifyContent:'center' }}><HiOutlineAcademicCap size={21} color="#f9a8d4" /></div>
        </div>

        <div style={{ position:'relative', zIndex:1, maxWidth:800, width:'100%' }}>


          <h1 className="hero-title reveal" style={{ fontFamily:"'Roboto', sans-serif", fontWeight:700, lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:20 }}>
            Discover the career<br />
            <span className="grad-text">built for you</span>
          </h1>

          <p className="hero-sub reveal d1" style={{ color:'rgba(240,239,232,0.56)', lineHeight:1.75, maxWidth:520, margin:'0 auto 34px' }}>
            Class 10 or 12 student? Take our AI quiz and get a personalized stream or course recommendation — with career paths, salary insights, and colleges near you.
          </p>

          <div className="hero-btns reveal d2" style={{ display:'flex', gap:11, justifyContent:'center', flexWrap:'wrap' }}>
            <button className="cta-btn" onClick={() => navigate('/login')}>
              Start Free Quiz <FiArrowRight size={15} />
            </button>
            <button className="ghost-btn" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior:'smooth' })}>
              See how it works
            </button>
          </div>

          {/* Mini stats */}
          <div className="hero-stats reveal d3" style={{ display:'flex', gap:28, justifyContent:'center', marginTop:48, flexWrap:'wrap' }}>
            {[['10K+','Students guided'],['95%','Satisfaction rate'],['500+','Colleges mapped']].map(([n,l]) => (
              <div key={l} style={{ textAlign:'center' }}>
                <div style={{ fontSize:'1.5rem', fontWeight:700, background:'linear-gradient(135deg,#a5b4fc,#c4b5fd)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{n}</div>
                <div style={{ fontSize:'0.76rem', color:'rgba(240,239,232,0.36)', marginTop:3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  FEATURES  */}
      <section className="feat-section">
        <div className="section-inner">
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <p className="reveal" style={{ fontSize:'0.76rem', color:'#6366f1', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>What we offer</p>
            <h2 className="section-title reveal d1" style={{ fontFamily:"'Roboto', sans-serif", fontWeight:700, letterSpacing:'-0.02em' }}>
              Everything you need to<br />choose your path
            </h2>
          </div>
          <div className="feat-grid" style={{ display:'grid', gap:16 }}>
            {features.map((f,i) => {
              const Icon = f.icon
              return (
                <div key={f.title} className={`feature-card reveal d${i+1}`}>
                  <div style={{ width:46, height:46, borderRadius:12, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                    <Icon size={23} color={f.color} />
                  </div>
                  <h3 style={{ fontSize:'1rem', fontWeight:600, marginBottom:8 }}>{f.title}</h3>
                  <p style={{ fontSize:'0.9rem', color:'rgba(240,239,232,0.5)', lineHeight:1.65 }}>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/*  HOW IT WORKS */}
      <section id="how-it-works" className="how-section" style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.05)', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div className="section-inner" style={{ maxWidth:960 }}>
          <div style={{ textAlign:'center', marginBottom:56 }}>
            <p className="reveal" style={{ fontSize:'0.76rem', color:'#10b981', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Simple process</p>
            <h2 className="section-title reveal d1" style={{ fontFamily:"'Roboto', sans-serif", fontWeight:700, letterSpacing:'-0.02em' }}>4 steps to your future</h2>
          </div>

          {/* Animated step cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }} className="how-grid">
            {steps.map((s, i) => {
              const Icon = s.icon
              const colors = ['#a5b4fc','#6ee7b7','#fcd34d','#f9a8d4']
              const bgs    = ['rgba(99,102,241,0.12)','rgba(16,185,129,0.12)','rgba(245,158,11,0.12)','rgba(236,72,153,0.12)']
              return (
                <div key={s.num} className={`reveal d${i+1}`} style={{ position:'relative', textAlign:'center' }}>
                  {/* Connector line */}
                  {i < 3 && (
                    <div style={{ position:'absolute', top:28, left:'calc(50% + 28px)', right:'-50%', height:2, background:'linear-gradient(90deg,rgba(99,102,241,0.4),rgba(99,102,241,0.05))', zIndex:0 }} className="step-connector" />
                  )}
                  {/* Icon circle */}
                  <div style={{ position:'relative', zIndex:1, width:56, height:56, borderRadius:'50%', background:bgs[i], border:`2px solid ${colors[i]}33`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', transition:'transform 0.3s, box-shadow 0.3s' }}
                    className="step-circle">
                    <span style={{ position:'absolute', top:-8, right:-8, width:22, height:22, borderRadius:'50%', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:800, color:'#fff' }}>{s.num}</span>
                    <Icon size={24} color={colors[i]} />
                  </div>
                  <div style={{ fontWeight:600, fontSize:'0.92rem', marginBottom:6, color:'#f0efe8' }}>{s.label}</div>
                  <div style={{ fontSize:'0.78rem', color:'rgba(240,239,232,0.42)', lineHeight:1.55 }}>
                    {['Answer 15 smart questions about your interests','AI analyses and finds your best career match','See jobs, salary & growth potential','Get colleges near you offering that course'][i]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/*  STREAMS */}
      <section id="about" className="stream-section">
        <div className="section-inner">
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <p className="reveal" style={{ fontSize:'0.76rem', color:'#f472b6', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>Explore options</p>
            <h2 className="section-title reveal d1" style={{ fontFamily:"'Roboto', sans-serif", fontWeight:700, letterSpacing:'-0.02em' }}>Every stream, every career</h2>
            <p className="reveal d2" style={{ marginTop:10, color:'rgba(240,239,232,0.43)', fontSize:'0.93rem' }}>Our AI covers all major streams and hundreds of courses.</p>
          </div>
          <div className="streams-grid" style={{ display:'grid', gap:13 }}>
            {streams.map((s,i) => {
              const Icon = s.icon
              return (
                <div key={s.name} className={`stream-card reveal d${(i%4)+1}`} onClick={() => navigate('/login')}>
                  <div style={{ width:42, height:42, borderRadius:11, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
                    <Icon size={21} color={s.color} />
                  </div>
                  <div style={{ fontWeight:600, fontSize:'0.95rem', marginBottom:5 }}>{s.name}</div>
                  <div style={{ fontSize:'0.76rem', color:'rgba(240,239,232,0.4)', lineHeight:1.55 }}>{s.courses}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/*STATS */}
      <section className="stats-section" style={{ background:'rgba(99,102,241,0.05)', borderTop:'1px solid rgba(99,102,241,0.13)', borderBottom:'1px solid rgba(99,102,241,0.13)' }}>
        <div className="section-inner" style={{ maxWidth:860 }}>
          <div className="stats-grid" style={{ display:'grid', gap:16 }}>
            {[['15+','Smart questions'],['50+','Career paths'],['500+','Colleges'],['3 min','To get results']].map(([n,l],i) => (
              <div key={l} className={`stat-card reveal d${i+1}`}>
                <div style={{ fontSize:'1.85rem', fontWeight:800, background:'linear-gradient(135deg,#a5b4fc,#f9a8d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{n}</div>
                <div style={{ fontSize:'0.8rem', color:'rgba(240,239,232,0.43)', marginTop:6 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  CTA  */}
      <section className="cta-section" style={{ textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.13) 0%, transparent 70%)' }} />
        <div style={{ position:'relative', zIndex:1, maxWidth:600, margin:'0 auto' }}>
          <h2 className="section-title reveal" style={{ fontFamily:"'Roboto', sans-serif", fontWeight:700, letterSpacing:'-0.02em', marginBottom:16, lineHeight:1.15 }}>
            Your future starts<br />with one quiz
          </h2>
          <p className="reveal d1" style={{ fontSize:'0.97rem', color:'rgba(240,239,232,0.5)', marginBottom:34, lineHeight:1.72 }}>
            Free. Takes 3 minutes. Powered by AI.<br />No career counsellor needed.
          </p>
          <div className="reveal d2">
            <button className="cta-btn" style={{ fontSize:'1rem', padding:'16px 40px' }} onClick={() => navigate('/login')}>
              <TbRocket size={17} /> Take the Quiz — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER  */}
      <footer style={{ background:'rgba(255,255,255,0.015)', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth:1140, margin:'0 auto', padding:'64px 24px 32px' }}>

          {/* Main grid */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:48, marginBottom:52, flexWrap:'wrap' }} className="footer-grid">

            {/* Brand */}
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <TbCompass size={20} color="#fff" />
                </div>
                <span style={{ fontWeight:700, fontSize:'1.15rem', letterSpacing:'-0.02em' }}>Eduvora</span>
              </div>
              <p style={{ fontSize:'0.88rem', color:'rgba(240,239,232,0.42)', lineHeight:1.72, maxWidth:280, marginBottom:24 }}>
                AI-powered career guidance for Class 10 &amp; 12 students in India. Discover your perfect stream, course, and colleges near you.
              </p>
              {/* Badges */}
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['Free to use', 'AI Powered', 'No Ads'].map(b => (
                  <span key={b} style={{ background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.22)', borderRadius:100, padding:'4px 12px', fontSize:'0.74rem', color:'#a5b4fc', fontWeight:500 }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize:'0.78rem', fontWeight:600, color:'rgba(240,239,232,0.4)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:18 }}>Quick Links</h4>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { label:'Take Quiz',      path:'/quiz' },
                  { label:'My Dashboard',   path:'/dashboard' },
                  { label:'Find Colleges',  path:'/colleges' },
                  { label:'View Results',   path:'/results' },
                  { label:'Login',        path:'/login' },
                ].map(l => (
                  <button key={l.label} onClick={() => navigate(l.path)}
                    style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.88rem', color:'rgba(240,239,232,0.48)', textAlign:'left', padding:0, fontFamily:"'Sora',sans-serif", transition:'color 0.18s', display:'flex', alignItems:'center', gap:6 }}
                    onMouseEnter={e => e.currentTarget.style.color='#f0efe8'}
                    onMouseLeave={e => e.currentTarget.style.color='rgba(240,239,232,0.48)'}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* For Students */}
            <div>
              <h4 style={{ fontSize:'0.78rem', fontWeight:600, color:'rgba(240,239,232,0.4)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:18 }}>For Students</h4>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {['Class 10 Stream Guide', 'Class 12 Course Guide', 'Career Path Explorer', 'Salary Insights', 'College Finder'].map(l => (
                  <span key={l} style={{ fontSize:'0.88rem', color:'rgba(240,239,232,0.48)', cursor:'default' }}>{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height:1, background:'rgba(255,255,255,0.06)', marginBottom:28 }} />

          {/* Bottom row */}
          <div style={{ display:'flex', justifyContent:'center', alignItems:'center', textAlign:'center', flexWrap:'wrap', gap:14 }}>
            <p style={{ fontSize:'0.8rem', color:'rgba(240,239,232,0.28)' }}>
              © 2026 Eduvora. Made with ❤️ for Indian students.
              by Shuhel Ahmed<br></br>
            </p>
            <div style={{ display:'flex', gap:20 }}>
              {['Privacy Policy', 'Terms of Use', 'Contact'].map(l => (
                <span key={l} style={{ fontSize:'0.8rem', color:'rgba(240,239,232,0.32)', cursor:'pointer', transition:'color 0.18s' }}
                  onMouseEnter={e => e.target.style.color='rgba(240,239,232,0.7)'}
                  onMouseLeave={e => e.target.style.color='rgba(240,239,232,0.32)'}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}