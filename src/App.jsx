/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import SplashScreen from './components/SplashScreen'
import Home from './pages/Home'
import Login from './pages/Login'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import Colleges from './pages/Colleges'
import Dashboard from './pages/Dashboard'
import VerifyEmail from './pages/VerifyEmail'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const seen = sessionStorage.getItem('splash_seen')
    if (seen) setShowSplash(false)
  }, [])

  const handleSplashDone = () => {
    sessionStorage.setItem('splash_seen', 'true')
    setShowSplash(false)
  }

  return (
<BrowserRouter>
        <AuthProvider>
          {showSplash && <SplashScreen onDone={handleSplashDone} />}
          <Navbar />
          <Routes>
            <Route path="/"          element={<Home />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/quiz"      element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/results"   element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/colleges"  element={<ProtectedRoute><Colleges /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    )
}

export default App