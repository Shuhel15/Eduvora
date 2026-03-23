import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbCompass, TbArrowLeft, TbArrowRight, TbBook, TbSchool } from 'react-icons/tb'
import { HiOutlineAcademicCap } from 'react-icons/hi2'

const class10Questions = [
  { id:1, question:'Which subject do you enjoy the most?', options:['Mathematics & Physics','Biology & Chemistry','History & Geography','Art & Literature'] },
  { id:2, question:'What kind of problems do you enjoy solving?', options:['Logical & analytical problems','Experiments & discoveries','Social & creative challenges','Business & financial puzzles'] },
  { id:3, question:'How do you spend your free time?', options:['Coding or gaming','Reading or writing','Drawing or music','Sports or outdoor activities'] },
  { id:4, question:'What type of work environment excites you?', options:['Lab or research center','Office or corporate setting','Studio or creative space','Outdoor or field work'] },
  { id:5, question:'Which role sounds most exciting to you?', options:['Engineer or Scientist','Doctor or Nurse','Artist or Designer','Businessman or Manager'] },
  { id:6, question:'How do you prefer to work?', options:['Alone with focus','In a small team','Leading a group','Helping people directly'] },
  { id:7, question:'What motivates you most?', options:['Building new things','Helping others','Expressing creativity','Earning and growing wealth'] },
  { id:8, question:'Which skill comes most naturally to you?', options:['Numbers & logic','Communication & writing','Creativity & imagination','Empathy & understanding people'] },
]

const class12Questions = [
  { id:1, question:'What is your current stream in Class 12?', options:['Science (PCM)','Science (PCB)','Commerce','Arts / Humanities'] },
  { id:2, question:'Which subject is your strongest?', options:['Mathematics','Biology','Accountancy / Economics','English / Social Science'] },
  { id:3, question:'Which entrance exam are you preparing for?', options:['JEE (Engineering)','NEET (Medical)','CUET / Other','Not preparing for any'] },
  { id:4, question:'What kind of career do you see yourself in?', options:['Technical / Engineering','Healthcare / Medical','Business / Finance','Creative / Media / Law'] },
  { id:5, question:'How important is job stability to you?', options:['Very important — secure job','Moderately — balance is good','Not much — I want to grow fast','I want to start my own business'] },
  { id:6, question:'Preferred study duration after Class 12?', options:["3 years (Bachelor's)",'4–5 years (with entrance)','5+ years (Medicine / Law)','Short diploma / certification'] },
  { id:7, question:'Which sector interests you most?', options:['Technology & IT','Healthcare & Science','Finance & Banking','Design, Media & Arts'] },
  { id:8, question:'Interest in studying abroad?', options:['Very interested','Open to it','Prefer India','Not sure yet'] },
]

export default function Quiz() {
  const navigate = useNavigate()
  const [grade, setGrade] = useState(null)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [selected, setSelected] = useState(null)

  const questions = grade === '10' ? class10Questions : class12Questions
  const progress = grade ? ((current / questions.length) * 100) : 0

  const handleAnswer = (option) => {
    setSelected(option)
    setTimeout(() => {
      const newAnswers = { ...answers, [questions[current].id]: option }
      setAnswers(newAnswers)
      setSelected(null)
      if (current + 1 < questions.length) {
        setCurrent(current + 1)
      } else {
        sessionStorage.setItem('quizAnswers', JSON.stringify(newAnswers))
        sessionStorage.setItem('quizGrade', grade)
        navigate('/results')
      }
    }, 380)
  }

  return (
    <div style={{ fontFamily:"'Sora',sans-serif", background:'#0a0a0f', color:'#f0efe8', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Roboto:wght@700;900&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }

        @keyframes slideIn { from { opacity:0; transform:translateX(18px); } to { opacity:1; transform:none; } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        .slide-in { animation:slideIn 0.38s cubic-bezier(.16,1,.3,1) forwards; }
        .fade-up  { animation:fadeUp  0.5s  cubic-bezier(.16,1,.3,1) forwards; }

        .option-btn {
          width:100%; text-align:left;
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.08);
          border-radius:14px; padding:15px 18px;
          color:#f0efe8; font-family:'Sora',sans-serif;
          font-size:0.92rem; cursor:pointer;
          transition:all 0.18s; display:flex; align-items:center; gap:12px;
        }
        .option-btn:hover  { background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.38); transform:translateX(4px); }
        .option-btn.picked { background:rgba(99,102,241,0.18); border-color:#6366f1; }

        .grade-card {
          flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          border-radius:20px; padding:32px 24px; cursor:pointer; transition:all 0.22s; text-align:center;
        }
        .grade-card:hover { background:rgba(99,102,241,0.1); border-color:rgba(99,102,241,0.45); transform:translateY(-4px); }

        .progress-bar { height:4px; background:rgba(255,255,255,0.07); border-radius:100px; overflow:hidden; }
        .progress-fill { height:100%; border-radius:100px; background:linear-gradient(90deg,#6366f1,#a78bfa); transition:width 0.4s cubic-bezier(.16,1,.3,1); }

        .nav-bar {
          display:flex; align-items:center; justify-content:space-between;
          padding:16px 24px; border-bottom:1px solid rgba(255,255,255,0.06);
          position:sticky; top:0; z-index:10;
          background:rgba(10,10,15,0.9); backdrop-filter:blur(16px);
        }

        @media (max-width:600px) {
          .grade-row { flex-direction:column !important; }
          .option-btn { font-size:0.86rem; padding:13px 14px; }
          .question-title { font-size:1.35rem !important; }
          .quiz-wrap { padding:24px 16px !important; }
          .progress-label { display:none; }
        }
      `}</style>

      {/* Navbar */}
      <div className="nav-bar">
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:8, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <TbCompass size={16} color="#fff" />
          </div>
          <span style={{ fontWeight:700, fontSize:'0.95rem' }}>Eduvora</span>
        </div>

        {grade && (
          <div style={{ flex:1, maxWidth:240, margin:'0 20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span className="progress-label" style={{ fontSize:'0.75rem', color:'rgba(240,239,232,0.4)' }}>Q {current+1}/{questions.length}</span>
              <span className="progress-label" style={{ fontSize:'0.75rem', color:'#a5b4fc', fontWeight:600 }}>{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar"><div className="progress-fill" style={{ width:`${progress}%` }} /></div>
          </div>
        )}

        <button onClick={() => grade ? setGrade(null) : navigate('/')} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:100, padding:'7px 14px', color:'#f0efe8', fontFamily:"'Sora',sans-serif", fontSize:'0.8rem', cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
          <TbArrowLeft size={13} /> {grade ? 'Change class' : 'Home'}
        </button>
      </div>

      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 16px', position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 20% 30%, rgba(99,102,241,0.1) 0%, transparent 60%)', pointerEvents:'none' }} />

        {/* Grade selection */}
        {!grade && (
          <div className="fade-up" style={{ maxWidth:560, width:'100%', textAlign:'center', position:'relative', zIndex:1 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(99,102,241,0.13)', border:'1px solid rgba(99,102,241,0.28)', borderRadius:100, padding:'6px 14px', marginBottom:20, fontSize:'0.8rem', color:'#a5b4fc' }}>
              <HiOutlineAcademicCap size={14} /> Personalized for your class
            </div>
            <h1 style={{ fontFamily:"'Roboto', sans-serif", fontSize:'2.2rem', fontWeight:700, marginBottom:10, lineHeight:1.2 }}>Which class are you in?</h1>
            <p style={{ fontSize:'0.9rem', color:'rgba(240,239,232,0.45)', marginBottom:32 }}>We'll customize your quiz based on your class</p>

            <div className="grade-row" style={{ display:'flex', gap:16 }}>
              <div className="grade-card" onClick={() => setGrade('10')}>
                <div style={{ width:52, height:52, borderRadius:14, background:'rgba(99,102,241,0.15)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                  <TbBook size={26} color="#a5b4fc" />
                </div>
                <h2 style={{ fontSize:'1.35rem', fontWeight:700, marginBottom:7 }}>Class 10</h2>
                <p style={{ fontSize:'0.83rem', color:'rgba(240,239,232,0.45)', lineHeight:1.55, marginBottom:16 }}>Choosing between Science, Commerce &amp; Arts streams</p>
                <div style={{ background:'rgba(99,102,241,0.18)', borderRadius:100, padding:'5px 14px', fontSize:'0.76rem', color:'#a5b4fc' }}>8 questions → Stream suggestion</div>
              </div>
              <div className="grade-card" onClick={() => setGrade('12')}>
                <div style={{ width:52, height:52, borderRadius:14, background:'rgba(16,185,129,0.12)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
                  <TbSchool size={26} color="#6ee7b7" />
                </div>
                <h2 style={{ fontSize:'1.35rem', fontWeight:700, marginBottom:7 }}>Class 12</h2>
                <p style={{ fontSize:'0.83rem', color:'rgba(240,239,232,0.45)', lineHeight:1.55, marginBottom:16 }}>Choosing the right college course &amp; career path</p>
                <div style={{ background:'rgba(16,185,129,0.15)', borderRadius:100, padding:'5px 14px', fontSize:'0.76rem', color:'#6ee7b7' }}>8 questions → Course suggestion</div>
              </div>
            </div>
          </div>
        )}

        {/* Questions */}
        {grade && (
          <div className="slide-in quiz-wrap" key={current} style={{ maxWidth:560, width:'100%', position:'relative', zIndex:1, padding:'24px 0' }}>

            {/* Progress (mobile) */}
            <div style={{ marginBottom:28 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:'0.75rem', color:'rgba(240,239,232,0.35)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em' }}>Class {grade} Quiz</span>
                <span style={{ fontSize:'0.75rem', color:'#a5b4fc', fontWeight:600 }}>{Math.round(progress)}% done</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width:`${progress}%` }} /></div>
            </div>

            {/* Question */}
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:'0.73rem', color:'rgba(240,239,232,0.3)', marginBottom:10, fontWeight:500, letterSpacing:'0.06em', textTransform:'uppercase' }}>Question {current+1} of {questions.length}</div>
              <h2 className="question-title" style={{ fontFamily:"'Roboto', sans-serif", fontSize:'1.55rem', fontWeight:700, lineHeight:1.3 }}>
                {questions[current].question}
              </h2>
            </div>

            {/* Options */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {questions[current].options.map((opt, i) => (
                <button key={opt} className={`option-btn ${selected===opt?'picked':''}`} onClick={() => handleAnswer(opt)}>
                  <span style={{ width:26, height:26, borderRadius:'50%', background:selected===opt?'rgba(99,102,241,0.28)':'rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.76rem', fontWeight:700, flexShrink:0, color:selected===opt?'#a5b4fc':'rgba(240,239,232,0.45)' }}>
                    {String.fromCharCode(65+i)}
                  </span>
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            {/* Back */}
            <button onClick={() => current > 0 ? setCurrent(current-1) : setGrade(null)} style={{ marginTop:22, background:'transparent', border:'none', color:'rgba(240,239,232,0.35)', fontFamily:"'Sora',sans-serif", fontSize:'0.82rem', cursor:'pointer', display:'flex', alignItems:'center', gap:5, padding:0 }}>
              <TbArrowLeft size={14} /> {current > 0 ? 'Previous question' : 'Change class'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}