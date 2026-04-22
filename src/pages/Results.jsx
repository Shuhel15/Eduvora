/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TbCompass, TbMapPin, TbRefresh, TbArrowRight,
  TbBriefcase, TbTrendingUp, TbRoad, TbStar,
  TbCheck, TbAlertCircle, TbChevronRight
} from 'react-icons/tb'
import { HiOutlineSparkles, HiOutlineAcademicCap } from 'react-icons/hi2'
import { MdOutlineScience, MdBusinessCenter, MdColorLens } from 'react-icons/md'
import { getClass10Recommendation, getClass12Recommendation } from '../utils/gemini'
import { saveQuizResult } from '../utils/firestore'
import { useAuth } from '../context/AuthContext'

// Static stream data (benefits, subjects, after12)
const streamData = {
  Science: {
    icon: MdOutlineScience, color: '#6ee7b7', bg: 'rgba(16,185,129,0.12)',
    tagline: 'Best match for analytical & logical minds',
    benefits: ['Keeps maximum career options open after Class 12', 'Gateway to Engineering, Medicine, Research & Technology', 'Highest earning potential among all streams', 'Strong demand in India and globally', 'Access to prestigious entrance exams like JEE & NEET'],
    subjects: ['Physics', 'Chemistry', 'Mathematics / Biology', 'English', 'Computer Science (optional)'],
    after12: ['Engineering (B.Tech)', 'Medicine (MBBS)', 'Pure Sciences (BSc)', 'Architecture', 'Data Science'],
  },
  Commerce: {
    icon: MdBusinessCenter, color: '#fcd34d', bg: 'rgba(245,158,11,0.12)',
    tagline: 'Perfect for business & finance enthusiasts',
    benefits: ['Direct path to CA, MBA, and Finance careers', 'Entrepreneurship-friendly curriculum', 'Growing demand for finance professionals', 'Flexible — can combine with Math or without', 'Shorter path to high-paying roles like CA, CFA'],
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'English', 'Mathematics (optional)'],
    after12: ['CA (Chartered Accountancy)', 'BBA / MBA', 'B.Com', 'Economics (Hons)', 'Finance & Banking'],
  },
  Arts: {
    icon: MdColorLens, color: '#f9a8d4', bg: 'rgba(236,72,153,0.12)',
    tagline: 'Ideal for creative & socially-aware minds',
    benefits: ['Wide range of creative and professional careers', 'Access to Law, Design, Journalism & Psychology', 'Growing opportunities in media, UX, and content', 'UPSC & civil services path opens up', 'Develop critical thinking & communication skills'],
    subjects: ['History', 'Political Science', 'Geography', 'Psychology', 'English Literature'],
    after12: ['Law (LLB)', 'Journalism & Mass Communication', 'BA Psychology', 'Fine Arts / Design', 'UPSC Preparation'],
  },
}

const growthColor = {
  'Very High': { bg: 'rgba(16,185,129,0.13)',  text: '#6ee7b7' },
  'High':      { bg: 'rgba(99,102,241,0.13)',  text: '#a5b4fc' },
  'Moderate':  { bg: 'rgba(245,158,11,0.13)',  text: '#fcd34d' },
  'Stable':    { bg: 'rgba(156,163,175,0.13)', text: '#d1d5db' },
}

const tagColors = {
  Engineering: '#a5b4fc', Medical: '#f9a8d4', Management: '#fcd34d',
  Law: '#86efac', Design: '#fdba74', Science: '#6ee7b7', Arts: '#f9a8d4',
}

// CLASS 10 RESULTS
function Class10Results({ data }) {
  const navigate  = useNavigate()
  const selected = data.recommended || 'Science'
  const stream   = streamData[selected] || streamData['Science']
  const Icon     = stream.icon

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(16,185,129,0.13)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: 100, padding: '6px 14px', marginBottom: 14, fontSize: '0.8rem', color: '#6ee7b7' }}>
          <HiOutlineSparkles size={13} /> AI Analysis Complete
        </div>
        <h1 style={{ fontFamily: "'Roboto', sans-serif", fontSize: 'clamp(1.6rem,4vw,2.3rem)', fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
          Your Recommended Stream
        </h1>
        <p style={{ color: 'rgba(240,239,232,0.45)', fontSize: '0.9rem' }}>
          Based on your quiz, AI recommends — click each stream to explore
        </p>
      </div>



      {/* Main card */}
      <div style={{ background: `linear-gradient(135deg, ${stream.bg}, rgba(255,255,255,0.02))`, border: `1px solid ${stream.color}33`, borderRadius: 22, padding: '28px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: stream.bg, border: `1px solid ${stream.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={26} color={stream.color} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700 }}>⭐ AI Recommended</span>
            </div>
            <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 700, marginBottom: 4 }}>{selected}</h2>
            <p style={{ fontSize: '0.85rem', color: stream.color, fontWeight: 500 }}>{stream.tagline}</p>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, background: `linear-gradient(135deg,${stream.color},#fff)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{data.match}%</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(240,239,232,0.38)', marginTop: 2 }}>AI Match</div>
          </div>
        </div>

        {/* AI reason */}
        {data.why && (
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '12px 16px' }}>
            <p style={{ fontSize: '0.88rem', color: 'rgba(240,239,232,0.7)', lineHeight: 1.7, margin: 0 }}>
              <span style={{ color: stream.color, fontWeight: 600 }}>Why AI chose this: </span>
              {data.why}
            </p>
          </div>
        )}
      </div>

      {/* 2 col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 20 }}>

        {/* Benefits */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
            <TbStar size={16} color={stream.color} /> Why choose {selected}?
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stream.benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: stream.bg, border: `1px solid ${stream.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <TbCheck size={11} color={stream.color} />
                </div>
                <span style={{ fontSize: '0.86rem', color: 'rgba(240,239,232,0.7)', lineHeight: 1.55 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects + After 12 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              <HiOutlineAcademicCap size={16} color="#a5b4fc" /> Subjects in {selected}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {stream.subjects.map(s => (
                <span key={s} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 100, padding: '5px 12px', fontSize: '0.78rem', color: '#a5b4fc' }}>{s}</span>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              <TbArrowRight size={16} color="#6ee7b7" /> After Class 12 you can do
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {stream.after12.map((a, i) => (
                <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.86rem' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: stream.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: stream.color, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Strengths & Tips */}
      {(data.strengths || data.tips) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 20 }}>
          {data.strengths && (
            <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 18, padding: '22px' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 14, color: '#a5b4fc' }}>✨ Your Strengths (AI detected)</h3>
              {data.strengths.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, fontSize: '0.86rem', color: 'rgba(240,239,232,0.7)' }}>
                  <TbCheck size={14} color="#a5b4fc" /> {s}
                </div>
              ))}
            </div>
          )}
          {data.tips && (
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 18, padding: '22px' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: 14, color: '#6ee7b7' }}>💡 Tips to Succeed</h3>
              {data.tips.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: '0.86rem', color: 'rgba(240,239,232,0.7)', lineHeight: 1.5 }}>
                  <span style={{ color: '#6ee7b7', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span> {t}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
        <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 16, padding: '20px 24px', maxWidth: 480, margin: '0 auto' }}>
          <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 6 }}>You're on the right track!</p>
          <p style={{ color: 'rgba(240,239,232,0.45)', fontSize: '0.84rem', lineHeight: 1.6 }}>
            Focus on Class 11 &amp; 12 in <strong style={{ color: stream.color }}>{selected}</strong>. Once you finish Class 12, come back — we'll help you find the perfect course and colleges near you.
          </p>
        </div>
      </div>
    </div>
  )
}


// CLASS 12 RESULTS

function Class12Results({ data }) {
  const navigate = useNavigate()
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [openSection,    setOpenSection]    = useState('jobs')

  const courses = data.courses || []

  if (selectedCourse !== null) {
    const course = courses[selectedCourse]
    const tagColor = tagColors[course.tag] || '#a5b4fc'

    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>

        <button onClick={() => setSelectedCourse(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '8px 16px', color: '#f0efe8', fontFamily: "'Sora',sans-serif", fontSize: '0.82rem', cursor: 'pointer', marginBottom: 24 }}>
          ← Back to courses
        </button>

        {/* Course header */}
        <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.14),rgba(139,92,246,0.08))', border: '1px solid rgba(99,102,241,0.28)', borderRadius: 22, padding: '24px', marginBottom: 20 }}>
          <span style={{ background: `${tagColor}22`, color: tagColor, border: `1px solid ${tagColor}44`, borderRadius: 100, padding: '4px 12px', fontSize: '0.75rem', fontWeight: 600, marginBottom: 10, display: 'inline-block' }}>{course.tag}</span>
          <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: 'clamp(1.4rem,3vw,1.9rem)', fontWeight: 700, marginBottom: 6 }}>{course.name}</h2>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(240,239,232,0.5)' }}>⏱ {course.duration}</span>
            <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>{course.match}% AI Match</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'rgba(240,239,232,0.65)', lineHeight: 1.65 }}>{course.why}</p>
        </div>

        {/* Section tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 2 }}>
          {[['jobs','Jobs & Salary'],['subjects','Subjects'],['roadmap','Roadmap'],['colleges','Top Colleges'],['exams','Entrance Exams']].map(([k, label]) => (
            <button key={k} onClick={() => setOpenSection(k)} style={{ padding: '9px 18px', borderRadius: 100, border: `1px solid ${openSection === k ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`, background: openSection === k ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)', color: openSection === k ? '#a5b4fc' : 'rgba(240,239,232,0.45)', fontFamily: "'Sora',sans-serif", fontSize: '0.84rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Jobs */}
        {openSection === 'jobs' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 7 }}>
              <TbBriefcase size={16} color="#a5b4fc" /> Jobs after {course.name}
            </h3>
            {(course.jobs || []).map((j, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < course.jobs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.92rem', marginBottom: 3 }}>{j.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(240,239,232,0.45)' }}>Average: <strong style={{ color: '#f0efe8' }}>{j.salary}</strong></div>
                </div>
                <span style={{ background: growthColor[j.growth]?.bg || 'rgba(255,255,255,0.05)', color: growthColor[j.growth]?.text || '#f0efe8', borderRadius: 100, padding: '4px 12px', fontSize: '0.76rem', fontWeight: 600, flexShrink: 0 }}>{j.growth}</span>
              </div>
            ))}
          </div>
        )}

        {/* Subjects */}
        {openSection === 'subjects' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 7 }}>
              <HiOutlineAcademicCap size={16} color="#a5b4fc" /> Subjects you'll study
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'rgba(240,239,232,0.4)', marginBottom: 16 }}>Core subjects across the full duration</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(course.subjects || []).map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 7, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '8px 14px' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', color: '#a5b4fc', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ fontSize: '0.84rem', color: 'rgba(240,239,232,0.75)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roadmap */}
        {openSection === 'roadmap' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 7 }}>
              <TbRoad size={16} color="#6ee7b7" /> Your Roadmap
            </h3>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 15, top: 10, bottom: 10, width: 2, background: 'rgba(99,102,241,0.2)', borderRadius: 2 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {(course.roadmap || []).map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#fff', flexShrink: 0, zIndex: 1 }}>{i + 1}</div>
                    <div style={{ flex: 1, paddingTop: 4 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#a5b4fc', marginBottom: 4 }}>{r.year}</div>
                      <div style={{ fontSize: '0.86rem', color: 'rgba(240,239,232,0.62)', lineHeight: 1.6 }}>{r.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Colleges */}
        {openSection === 'colleges' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
              <HiOutlineAcademicCap size={16} color="#fcd34d" /> Top Colleges
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
              {(course.topColleges || []).map(c => (
                <span key={c} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 100, padding: '7px 16px', fontSize: '0.84rem', color: '#fcd34d' }}>{c}</span>
              ))}
            </div>
            <button onClick={() => navigate('/colleges')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontFamily: "'Sora',sans-serif", fontSize: '0.88rem', fontWeight: 600, padding: '11px 22px', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
              <TbMapPin size={15} /> Find Colleges Near Me
            </button>
          </div>
        )}

        {/* Exams */}
        {openSection === 'exams' && (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '22px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
              <TbTrendingUp size={16} color="#f9a8d4" /> Entrance Exams
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(course.exams || []).map(e => (
                <span key={e} style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: 100, padding: '7px 16px', fontSize: '0.84rem', color: '#f9a8d4' }}>{e}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  //  Course list
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(16,185,129,0.13)', border: '1px solid rgba(16,185,129,0.28)', borderRadius: 100, padding: '6px 14px', marginBottom: 14, fontSize: '0.8rem', color: '#6ee7b7' }}>
          <HiOutlineSparkles size={13} /> AI Analysis Complete
        </div>
        <h1 style={{ fontFamily: "'Roboto', sans-serif", fontSize: 'clamp(1.6rem,4vw,2.3rem)', fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
          Recommended Courses for You
        </h1>
        <p style={{ color: 'rgba(240,239,232,0.45)', fontSize: '0.9rem' }}>
          Click any course to see jobs, salary, roadmap and colleges
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {courses.map((c, i) => {
          const tagColor = tagColors[c.tag] || '#a5b4fc'
          return (
            <div key={i} onClick={() => setSelectedCourse(i)}
              style={{ background: i === 0 ? 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(139,92,246,0.07))' : 'rgba(255,255,255,0.04)', border: `1px solid ${i === 0 ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 18, padding: '20px 22px', cursor: 'pointer', transition: 'all 0.22s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ background: `${tagColor}22`, color: tagColor, border: `1px solid ${tagColor}44`, borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600 }}>{c.tag}</span>
                  {i === 0 && <span style={{ background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 100, padding: '3px 10px', fontSize: '0.72rem', fontWeight: 600 }}>⭐ Top Pick</span>}
                  <span style={{ fontSize: '0.76rem', color: 'rgba(240,239,232,0.35)' }}>⏱ {c.duration}</span>
                </div>
                <h3 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.4rem)', fontWeight: 600, marginBottom: 5 }}>{c.name}</h3>
                <p style={{ fontSize: '0.83rem', color: 'rgba(240,239,232,0.48)', lineHeight: 1.55 }}>{c.why}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: tagColor }}>{c.match}%</div>
                  <div style={{ fontSize: '0.66rem', color: 'rgba(240,239,232,0.3)', marginTop: 1 }}>AI Match</div>
                </div>
                <TbChevronRight size={18} color="rgba(240,239,232,0.3)" />
              </div>
            </div>
          )
        })}
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(240,239,232,0.3)', marginTop: 20 }}>
        Tap any course to explore jobs, salary, roadmap and colleges
      </p>
    </div>
  )
}

// MAIN RESULTS PAGE

const loadingSteps = [
  'Reading your quiz answers...',
  'Analysing your interests...',
  'Matching careers & courses...',
  'Building your roadmap...',
  'Almost ready...',
]

export default function Results() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const grade    = sessionStorage.getItem('quizGrade') || '12'

  const [status,      setStatus]      = useState('loading')
  const [aiData,      setAiData]      = useState(null)
  const [errorMsg,    setErrorMsg]    = useState('')
  const [loadingStep, setLoadingStep] = useState(0)
  const [countdown,   setCountdown]   = useState(0)
  const [isQuota,     setIsQuota]     = useState(false)

  const runFetch = async () => {
    setStatus('loading')
    setIsQuota(false)
    const answers = JSON.parse(sessionStorage.getItem('quizAnswers') || '{}')

    const stepInterval = setInterval(() => {
      setLoadingStep(p => (p + 1) % loadingSteps.length)
    }, 1200)

    const result = grade === '10'
      ? await getClass10Recommendation(answers)
      : await getClass12Recommendation(answers)

    clearInterval(stepInterval)

    if (result.success) {
      setAiData(result.data)
      setStatus('success')
      // Save to Firestore in background
      if (user) {
        saveQuizResult(user.uid, {
          grade,
          answers,
          result: result.data,
        })
      }
    } else if (result.error === 'quota') {
      setIsQuota(true)
      setCountdown(result.retryAfter || 60)
      setStatus('error')
    } else {
      setErrorMsg(result.error)
      setStatus('error')
    }
  }

  useEffect(() => { runFetch() }, [grade])

  // Countdown timer for quota errors
  useEffect(() => {
    if (!isQuota || countdown <= 0) return
    const t = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { clearInterval(t); runFetch(); return 0 }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [isQuota, countdown])

  return (
    <div style={{ fontFamily: "'Sora',sans-serif", background: '#0a0a0f', color: '#f0efe8', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Roboto:wght@700;900&display=swap" rel="stylesheet" />
      
      {/* Background */}
      <div style={{ position:'fixed', inset:0, background:'radial-gradient(ellipse 70% 60% at 30% 40%, rgba(99,102,241,0.13) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 70%, rgba(236,72,153,0.08) 0%, transparent 60%)', pointerEvents:'none', zIndex: -1 }} />
      <div style={{ position:'fixed', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)', backgroundSize:'52px 52px', pointerEvents:'none', zIndex: -1 }} />
      
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes progress  { 0%{width:0%;margin-left:0} 50%{width:70%;margin-left:0} 100%{width:10%;margin-left:100%} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .fade-up { animation:fadeUp 0.5s cubic-bezier(.16,1,.3,1); }
      `}</style>

      {/* Navbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,10,15,0.9)', backdropFilter: 'blur(16px)', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TbCompass size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Eduvora</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/quiz')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '7px 14px', color: '#f0efe8', fontFamily: "'Sora',sans-serif", fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <TbRefresh size={13} /> Retake Quiz
          </button>
          {grade === '12' && (
            <button onClick={() => navigate('/colleges')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontFamily: "'Sora',sans-serif", fontSize: '0.82rem', fontWeight: 600, padding: '8px 16px', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
              <TbMapPin size={14} /> Find Colleges
            </button>
          )}
        </div>
      </div>

      {/* Loading */}
      {status === 'loading' && (
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 20px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', animation: 'spin 0.9s linear infinite' }} />
          <div>
            <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: '1.5rem', marginBottom: 8 }}>AI is analysing...</h2>
            <p style={{ color: '#a5b4fc', fontSize: '0.9rem', animation: 'pulse 1.2s ease-in-out infinite' }}>{loadingSteps[loadingStep]}</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Reading answers', 'Matching careers', 'Building roadmap'].map((s, i) => (
              <div key={s} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 100, padding: '5px 12px', fontSize: '0.76rem', color: '#a5b4fc', animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite` }}>{s}</div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '0 20px', textAlign: 'center' }}>
          {isQuota ? (
            <>
              <div style={{ fontSize: 48 }}>⏳</div>
              <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: '1.5rem' }}>Free quota reached</h2>
              <p style={{ color: 'rgba(240,239,232,0.5)', fontSize: '0.9rem', maxWidth: 380, lineHeight: 1.6 }}>
                AI free tier limit hit. Auto-retrying in <strong style={{ color: '#a5b4fc' }}>{countdown}s</strong>...
              </p>
              <div style={{ width: 260, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,#6366f1,#a78bfa)', borderRadius: 100, width: `${((60 - countdown) / 60) * 100}%`, transition: 'width 1s linear' }} />
              </div>
              {/* <p style={{ color: 'rgba(240,239,232,0.3)', fontSize: '0.8rem' }}>
                Or <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color: '#a5b4fc' }}>upgrade your AI API plan</a> for unlimited access
              </p> */}
              <button onClick={runFetch} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#f0efe8', fontFamily: "'Sora',sans-serif", fontSize: '0.88rem', padding: '10px 22px', borderRadius: 100, cursor: 'pointer' }}>
                <TbRefresh size={14} /> Retry Now
              </button>
            </>
          ) : (
            <>
              <TbAlertCircle size={48} color="#f87171" />
              <h2 style={{ fontFamily: "'Roboto', sans-serif", fontSize: '1.5rem' }}>Something went wrong</h2>
              <p style={{ color: 'rgba(240,239,232,0.5)', fontSize: '0.9rem' }}>{errorMsg}</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={runFetch} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontFamily: "'Sora',sans-serif", fontSize: '0.9rem', fontWeight: 600, padding: '12px 24px', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
                  <TbRefresh size={15} /> Try Again
                </button>
                <button onClick={() => navigate('/quiz')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#f0efe8', fontFamily: "'Sora',sans-serif", fontSize: '0.88rem', padding: '12px 20px', borderRadius: 100, cursor: 'pointer' }}>
                  Retake Quiz
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Results */}
      {status === 'success' && aiData && (
        <div className="fade-up">
          {grade === '10'
            ? <Class10Results data={aiData} />
            : <Class12Results data={aiData} />
          }
        </div>
      )}
    </div>
  )
}