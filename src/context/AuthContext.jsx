/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // ✅ onAuthStateChanged uses Firebase's local cache — instant on refresh
    // Do NOT fetch Firestore here — it causes slow load every refresh
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null)
      setLoading(false)
    })
    return unsub
  }, [])

  // ── Save user to Firestore (called once on first signup/login) ──
  const saveUserToFirestore = async (firebaseUser, extraData = {}) => {
    try {
      const docRef  = doc(db, 'users', firebaseUser.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid:       firebaseUser.uid,
          name:      firebaseUser.displayName || extraData.name || '',
          email:     firebaseUser.email,
          photoURL:  firebaseUser.photoURL || '',
          createdAt: serverTimestamp(),
          ...extraData,
        })
      }
    } catch (e) {
      console.warn('Firestore save failed:', e)
    }
  }

  // ── Sign In with Email ──
  const signInEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (err) {
      return { success: false, error: firebaseErrorMessage(err.code) }
    }
  }

  // ── Sign Up with Email ──
  const signUpEmail = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
      // Save to Firestore in background — don't await to keep it fast
      saveUserToFirestore(result.user, { name })
      return { success: true }
    } catch (err) {
      return { success: false, error: firebaseErrorMessage(err.code) }
    }
  }

  // ── Sign In with Google ──
  const signInGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      // Save to Firestore in background
      saveUserToFirestore(result.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: firebaseErrorMessage(err.code) }
    }
  }

  // ── Logout ──
  const logOut = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInEmail, signUpEmail, signInGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

function firebaseErrorMessage(code) {
  switch (code) {
    case 'auth/user-not-found':         return 'No account found with this email.'
    case 'auth/wrong-password':         return 'Incorrect password. Please try again.'
    case 'auth/invalid-credential':     return 'Incorrect email or password.'
    case 'auth/email-already-in-use':   return 'This email is already registered. Try signing in.'
    case 'auth/weak-password':          return 'Password must be at least 6 characters.'
    case 'auth/invalid-email':          return 'Please enter a valid email address.'
    case 'auth/popup-closed-by-user':   return 'Google sign-in was cancelled.'
    case 'auth/network-request-failed': return 'Network error. Check your connection.'
    case 'auth/too-many-requests':      return 'Too many attempts. Please wait and try again.'
    default:                            return 'Something went wrong. Please try again.'
  }
}