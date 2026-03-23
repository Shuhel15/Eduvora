/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TbCompass, TbMapPin, TbArrowLeft, TbSearch,
  TbWorld, TbNavigation, TbRefresh,
  TbX, TbAlertCircle, TbMap, TbBuilding
} from 'react-icons/tb'
import { HiOutlineAcademicCap } from 'react-icons/hi2'

// ── Distance in km ─────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
  const R    = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a    = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1)
}

// ── Load Leaflet CSS + JS ──────────────────────
function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) return resolve(window.L)
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id    = 'leaflet-css'
      link.rel   = 'stylesheet'
      link.href  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    const script  = document.createElement('script')
    script.src    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => resolve(window.L)
    document.head.appendChild(script)
  })
}

// ── Fetch only universities & colleges (NO schools) ──
async function fetchNearbyColleges(lat, lng, radiusM = 15000) {
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="university"](around:${radiusM},${lat},${lng});
      node["amenity"="college"](around:${radiusM},${lat},${lng});
      way["amenity"="university"](around:${radiusM},${lat},${lng});
      way["amenity"="college"](around:${radiusM},${lat},${lng});
    );
    out center tags;
  `
  const res  = await fetch('https://overpass-api.de/api/interpreter', {
    method:  'POST',
    body:    `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  const data = await res.json()
  return data.elements || []
}

// ── Reverse geocode with Nominatim ─────────────
async function getAddress(lat, lng) {
  try {
    const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
    const data = await res.json()
    return data.display_name?.split(',').slice(0, 3).join(', ') || 'Address unavailable'
  } catch {
    return 'Address unavailable'
  }
}

// ── Type badge — University & College only ─────
function typeStyle(amenity) {
  if (amenity === 'university') return { bg: 'rgba(99,102,241,0.15)',  text: '#a5b4fc', border: 'rgba(99,102,241,0.3)',  label: 'University' }
  return                               { bg: 'rgba(16,185,129,0.15)', text: '#6ee7b7', border: 'rgba(16,185,129,0.3)',  label: 'College'    }
}

// ── Map Modal ──────────────────────────────────
function MapModal({ college, userPos, onClose }) {
  const mapRef     = useRef(null)
  const leafletMap = useRef(null)

  useEffect(() => {
    let mounted = true
    loadLeaflet().then(L => {
      if (!mounted || !mapRef.current || leafletMap.current) return
      const map = L.map(mapRef.current, { zoomControl: true }).setView([college.lat, college.lng], 15)
      leafletMap.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
      }).addTo(map)

      const collegeIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 8px rgba(99,102,241,0.6)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
               </div>`,
        className: '', iconSize: [32, 32], iconAnchor: [16, 16],
      })
      L.marker([college.lat, college.lng], { icon: collegeIcon })
        .addTo(map)
        .bindPopup(`<strong>${college.name}</strong><br/><small>${college.address}</small>`)
        .openPopup()

      if (userPos) {
        const userIcon = L.divIcon({
          html: `<div style="width:20px;height:20px;border-radius:50%;background:#10b981;border:2px solid #fff;box-shadow:0 0 10px rgba(16,185,129,0.7)"></div>`,
          className: '', iconSize: [20, 20], iconAnchor: [10, 10],
        })
        L.marker([userPos.lat, userPos.lng], { icon: userIcon }).addTo(map).bindPopup('Your Location')
        L.polyline([[userPos.lat, userPos.lng], [college.lat, college.lng]], {
          color: '#6366f1', weight: 2, opacity: 0.6, dashArray: '6 4',
        }).addTo(map)
        map.fitBounds([[userPos.lat, userPos.lng], [college.lat, college.lng]], { padding: [40, 40] })
      }
    })
    return () => {
      mounted = false
      if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null }
    }
  }, [college, userPos])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }} />
      <div style={{ position: 'relative', zIndex: 1, background: '#0f0f18', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, width: '100%', maxWidth: 680, overflow: 'hidden' }}>

        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 3 }}>{college.name}</h3>
            <p style={{ fontSize: '0.76rem', color: 'rgba(240,239,232,0.45)' }}>{college.address}</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#f0efe8', flexShrink: 0 }}>
            <TbX size={15} />
          </button>
        </div>

        <div ref={mapRef} style={{ width: '100%', height: 340 }} />

        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${college.lat},${college.lng}`, '_blank')}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontFamily: "'Sora',sans-serif", fontSize: '0.88rem', fontWeight: 600, padding: '12px', borderRadius: 12, border: 'none', cursor: 'pointer', minWidth: 140 }}>
            <TbNavigation size={16} /> Get Directions
          </button>
          <button onClick={() => window.open(`https://www.openstreetmap.org/?mlat=${college.lat}&mlon=${college.lng}#map=16/${college.lat}/${college.lng}`, '_blank')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0efe8', fontFamily: "'Sora',sans-serif", fontSize: '0.88rem', padding: '12px 18px', borderRadius: 12, cursor: 'pointer' }}>
            <TbWorld size={15} /> OpenStreetMap
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────
export default function Colleges() {
  const navigate = useNavigate()

  const [status,   setStatus]   = useState('locating')
  const [colleges, setColleges] = useState([])
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('All')
  const [userPos,  setUserPos]  = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [mapModal, setMapModal] = useState(null)

  const filters = ['All', 'University', 'College']

  const fetchColleges = useCallback(async (lat, lng) => {
    setStatus('loading')
    setColleges([])
    try {
      setUserPos({ lat, lng })
      const elements = await fetchNearbyColleges(lat, lng, 15000)

      if (!elements.length) {
        setErrorMsg('No colleges found within 15km. Try allowing precise location access.')
        setStatus('error')
        return
      }

      const raw = elements.map(el => {
        const clat = el.lat || el.center?.lat
        const clng = el.lon || el.center?.lon
        if (!clat || !clng) return null
        // ── Skip schools — only universities & colleges ──
        if (el.tags?.amenity === 'school') return null
        return {
          id:       el.id,
          name:     el.tags?.name || el.tags?.['name:en'] || 'Unnamed Institution',
          amenity:  el.tags?.amenity || 'college',
          website:  el.tags?.website || el.tags?.url || null,
          phone:    el.tags?.phone || el.tags?.['contact:phone'] || null,
          address:  [el.tags?.['addr:housenumber'], el.tags?.['addr:street'], el.tags?.['addr:city']].filter(Boolean).join(', ') || '',
          lat:      clat,
          lng:      clng,
          distance: haversine(lat, lng, clat, clng),
        }
      }).filter(Boolean)
        .filter(c => c.name !== 'Unnamed Institution' || c.address)
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        .slice(0, 20)

      const needsAddress = raw.filter(c => !c.address).slice(0, 5)
      await Promise.all(needsAddress.map(async c => {
        c.address = await getAddress(c.lat, c.lng)
      }))

      setColleges(raw)
      setStatus('done')
    } catch (err) {
      console.error(err)
      setErrorMsg('Failed to fetch colleges. Check your internet connection.')
      setStatus('error')
    }
  }, [])

  const getLocation = useCallback(() => {
    setStatus('locating')
    setColleges([])
    setErrorMsg('')
    if (!navigator.geolocation) { fetchColleges(28.6139, 77.2090); return }
    navigator.geolocation.getCurrentPosition(
      pos => fetchColleges(pos.coords.latitude, pos.coords.longitude),
      ()  => fetchColleges(28.6139, 77.2090),
      { timeout: 10000, enableHighAccuracy: true }
    )
  }, [fetchColleges])

  useEffect(() => { getLocation() }, [])

  const filtered = colleges.filter(c => {
    const ts = typeStyle(c.amenity)
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.address.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || ts.label === filter
    return matchSearch && matchFilter
  })

  return (
    <div style={{ fontFamily: "'Sora',sans-serif", background: '#0a0a0f', color: '#f0efe8', minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Roboto:wght@700;900&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes spin   { to{transform:rotate(360deg)} }

        .college-card {
          background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08);
          border-radius:18px; overflow:hidden; transition:all 0.22s;
          animation:fadeUp 0.45s cubic-bezier(.16,1,.3,1) both;
        }
        .college-card:hover { background:rgba(255,255,255,0.07); border-color:rgba(99,102,241,0.4); transform:translateY(-3px); box-shadow:0 8px 32px rgba(0,0,0,0.3); }

        .search-input {
          width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
          border-radius:12px; padding:11px 16px 11px 40px; color:#f0efe8;
          font-family:'Sora',sans-serif; font-size:0.9rem; outline:none; transition:border-color 0.2s;
        }
        .search-input::placeholder { color:rgba(240,239,232,0.3); }
        .search-input:focus { border-color:rgba(99,102,241,0.5); }

        .filter-btn {
          padding:8px 18px; border-radius:100px; font-family:'Sora',sans-serif;
          font-size:0.83rem; font-weight:500; cursor:pointer; transition:all 0.18s;
          border:1px solid rgba(255,255,255,0.09); background:transparent;
          color:rgba(240,239,232,0.45); white-space:nowrap;
        }
        .filter-btn.active { background:rgba(99,102,241,0.18); border-color:rgba(99,102,241,0.45); color:#a5b4fc; }
        .filter-btn:hover:not(.active) { background:rgba(255,255,255,0.06); color:#f0efe8; }

        .map-btn {
          display:flex; align-items:center; justify-content:center; gap:7px;
          background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff;
          font-family:'Sora',sans-serif; font-size:0.82rem; font-weight:600;
          padding:10px; border-radius:10px; border:none; cursor:pointer; transition:all 0.18s; width:100%;
        }
        .map-btn:hover { box-shadow:0 4px 24px rgba(99,102,241,0.45); transform:translateY(-1px); }

        .dir-btn {
          display:flex; align-items:center; justify-content:center; gap:7px;
          background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);
          color:#f0efe8; font-family:'Sora',sans-serif; font-size:0.82rem;
          padding:10px; border-radius:10px; cursor:pointer; transition:all 0.18s; width:100%;
        }
        .dir-btn:hover { background:rgba(255,255,255,0.1); }

        .leaflet-pane { z-index:1 !important; }
        .leaflet-top, .leaflet-bottom { z-index:2 !important; }

        @media(max-width:640px) {
          .cards-grid { grid-template-columns:1fr !important; }
          .filter-row { overflow-x:auto; }
          .filter-row::-webkit-scrollbar { display:none; }
        }
      `}</style>

      {mapModal && <MapModal college={mapModal} userPos={userPos} onClose={() => setMapModal(null)} />}

      {/* Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,10,15,0.92)', backdropFilter: 'blur(16px)', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TbCompass size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Eduvora</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/results')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '7px 16px', color: '#f0efe8', fontFamily: "'Sora',sans-serif", fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <TbArrowLeft size={13} /> Results
          </button>
          <button onClick={getLocation} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100, padding: '7px 14px', color: '#f0efe8', fontFamily: "'Sora',sans-serif", fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
            <TbRefresh size={13} />
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 20px' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 100, padding: '5px 13px', marginBottom: 12, fontSize: '0.78rem', color: '#a5b4fc' }}>
            <TbMapPin size={12} /> Powered by OpenStreetMap · 100% Free
          </div>
          <h1 style={{ fontFamily: "'Roboto',sans-serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
            Find Colleges Near You
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(240,239,232,0.45)' }}>
            Click <strong style={{ color: '#a5b4fc' }}>View on Map</strong> on any college to see its location and get directions
          </p>
        </div>

        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <TbSearch size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,239,232,0.35)' }} />
            <input className="search-input" placeholder="Search colleges..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,239,232,0.4)', display: 'flex' }}>
                <TbX size={14} />
              </button>
            )}
          </div>
          <div className="filter-row" style={{ display: 'flex', gap: 7 }}>
            {filters.map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        {/* Status */}
        {status === 'done' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span style={{ fontSize: '0.82rem', color: 'rgba(240,239,232,0.5)' }}>
              {filtered.length} colleges found near your location
            </span>
          </div>
        )}

        {/* Loading */}
        {(status === 'locating' || status === 'loading') && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: 16, textAlign: 'center' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', animation: 'spin 0.8s linear infinite' }} />
            <div>
              <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 6 }}>
                {status === 'locating' ? 'Detecting your location...' : 'Searching OpenStreetMap...'}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'rgba(240,239,232,0.4)' }}>
                {status === 'locating' ? 'Please allow location access when prompted' : 'Fetching colleges within 15km...'}
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 14, textAlign: 'center' }}>
            <TbAlertCircle size={44} color="#f87171" />
            <h3 style={{ fontFamily: "'Roboto',sans-serif", fontSize: '1.1rem', fontWeight: 700 }}>Could not load colleges</h3>
            <p style={{ fontSize: '0.86rem', color: 'rgba(240,239,232,0.45)', lineHeight: 1.65, maxWidth: 380 }}>{errorMsg}</p>
            <button onClick={getLocation} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontFamily: "'Sora',sans-serif", fontSize: '0.88rem', fontWeight: 600, padding: '11px 24px', borderRadius: 100, border: 'none', cursor: 'pointer' }}>
              <TbRefresh size={15} /> Try Again
            </button>
          </div>
        )}

        {/* No results */}
        {status === 'done' && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <HiOutlineAcademicCap size={40} style={{ color: 'rgba(240,239,232,0.2)', marginBottom: 12 }} />
            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 6 }}>No colleges match</p>
            <p style={{ fontSize: '0.84rem', color: 'rgba(240,239,232,0.4)' }}>Try a different search or filter</p>
          </div>
        )}

        {/* Cards */}
        {status === 'done' && filtered.length > 0 && (
          <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18 }}>
            {filtered.map((col, i) => {
              const ts = typeStyle(col.amenity)
              return (
                <div key={col.id} className="college-card" style={{ animationDelay: `${i * 0.05}s` }}>

                  {/* Banner */}
                  <div style={{ height: 80, background: `linear-gradient(135deg,${ts.bg},rgba(255,255,255,0.01))`, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: ts.bg, border: `1px solid ${ts.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <TbBuilding size={20} color={ts.text} />
                    </div>
                    <span style={{ background: ts.bg, color: ts.text, border: `1px solid ${ts.border}`, borderRadius: 100, padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600 }}>{ts.label}</span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '16px 18px' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.35, marginBottom: 8 }}>{col.name}</h3>

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, marginBottom: 10 }}>
                      <TbMapPin size={13} color="#a5b4fc" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: '0.78rem', color: 'rgba(240,239,232,0.5)', lineHeight: 1.45 }}>
                        {col.address || 'Address not available'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#a5b4fc', fontWeight: 600 }}>
                        <TbNavigation size={12} /> {col.distance} km away
                      </span>
                      {col.website && (
                        <a href={col.website} target="_blank" rel="noreferrer"
                          style={{ fontSize: '0.74rem', color: 'rgba(240,239,232,0.35)', display: 'flex', alignItems: 'center', gap: 3, textDecoration: 'none' }}
                          onClick={e => e.stopPropagation()}>
                          <TbWorld size={11} /> Website
                        </a>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <button className="map-btn" onClick={() => setMapModal(col)}>
                        <TbMap size={14} /> View on Map
                      </button>
                      <button className="dir-btn" onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${col.lat},${col.lng}`, '_blank')}>
                        <TbNavigation size={14} /> Directions
                      </button>
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