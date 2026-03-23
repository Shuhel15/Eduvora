import { useEffect, useState } from 'react'
import { TbCompass } from 'react-icons/tb'

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState('enter') // enter | hold | exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600)
    const t2 = setTimeout(() => setPhase('exit'), 2000)
    const t3 = setTimeout(() => onDone(), 2600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0a0f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      opacity: phase === 'exit' ? 0 : 1,
      transform: phase === 'exit' ? 'scale(1.04)' : 'scale(1)',
      transition: 'opacity 0.55s cubic-bezier(.16,1,.3,1), transform 0.55s cubic-bezier(.16,1,.3,1)',
      pointerEvents: phase === 'exit' ? 'none' : 'all',
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes splashGlow {
          0%   { box-shadow: 0 0 0px rgba(99,102,241,0); transform: scale(0.7); opacity: 0; }
          60%  { box-shadow: 0 0 60px rgba(99,102,241,0.5); transform: scale(1.08); opacity: 1; }
          100% { box-shadow: 0 0 30px rgba(99,102,241,0.3); transform: scale(1); opacity: 1; }
        }
        @keyframes splashText {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashDot {
          0%, 80%, 100% { transform: scale(0); opacity: 0; }
          40%            { transform: scale(1); opacity: 1; }
        }
        @keyframes splashRing {
          0%   { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .splash-icon {
          animation: splashGlow 0.7s cubic-bezier(.16,1,.3,1) 0.1s both;
        }
        .splash-name {
          animation: splashText 0.5s cubic-bezier(.16,1,.3,1) 0.5s both;
        }
        .splash-tag {
          animation: splashText 0.5s cubic-bezier(.16,1,.3,1) 0.75s both;
        }
        .splash-ring {
          animation: splashRing 1.4s ease-out 0.3s infinite;
        }
        .dot1 { animation: splashDot 1.2s ease-in-out 1.1s infinite; }
        .dot2 { animation: splashDot 1.2s ease-in-out 1.3s infinite; }
        .dot3 { animation: splashDot 1.2s ease-in-out 1.5s infinite; }
      `}</style>

      {/* Background mesh */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(99,102,241,0.18) 0%, transparent 70%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Ripple ring */}
      <div className="splash-ring" style={{
        position: 'absolute',
        width: 120, height: 120,
        borderRadius: '50%',
        border: '2px solid rgba(99,102,241,0.4)',
        zIndex: 1,
      }} />

      {/* Logo icon */}
      <div className="splash-icon" style={{
        position: 'relative', zIndex: 2,
        width: 80, height: 80, borderRadius: 22,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 30px rgba(99,102,241,0.4)',
      }}>
        <TbCompass size={40} color="#fff" />
      </div>

      {/* App name */}
      <div className="splash-name" style={{
        position: 'relative', zIndex: 2,
        fontFamily: "'Sora', sans-serif",
        fontSize: '2rem', fontWeight: 700,
        color: '#f0efe8', letterSpacing: '-0.03em',
      }}>
        Eduvora
      </div>

      {/* Tagline */}
      <div className="splash-tag" style={{
        position: 'relative', zIndex: 2,
        fontFamily: "'Sora', sans-serif",
        fontSize: '0.88rem', fontWeight: 400,
        color: 'rgba(240,239,232,0.45)', letterSpacing: '0.02em',
      }}>
        AI Career Guidance for Students
      </div>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: 7, marginTop: 8, position: 'relative', zIndex: 2 }}>
        {['dot1','dot2','dot3'].map(cls => (
          <div key={cls} className={cls} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'rgba(99,102,241,0.7)',
          }} />
        ))}
      </div>
    </div>
  )
}