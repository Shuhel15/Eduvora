/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  reload
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from '../firebase/config'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null)
      setLoading(false)
    })
    return unsub
  }, [])

  // Save user to Firestore (called once on first signup/login) 
  const saveUserToFirestore = async (firebaseUser, extraData = {}) => {
    try {
      const docRef = doc(db, 'users', firebaseUser.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || extraData.name || '',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL || '',
          createdAt: serverTimestamp(),
          ...extraData,
        })
      }
    } catch (e) {
      console.warn('Firestore save failed:', e)
    }
  }

  // Sign In with Email 
  const signInEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (err) {
      return { success: false, error: firebaseErrorMessage(err.code) }
    }
  }

  // Send Verification Email
  const sendVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser)
        return { success: true }
      } catch (err) {
        return { success: false, error: firebaseErrorMessage(err.code) }
      }
    }
    return { success: false, error: "No user logged in" }
  }

  // Reload User (to check if emailVerified has changed)
  const reloadUser = async () => {
    if (auth.currentUser) {
      await reload(auth.currentUser)
      setUser({ ...auth.currentUser })
    }
  }

  //Sign Up with Email
  const signUpEmail = async (email, password, name) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: name })
      
      // ✅ Send verification email
      await sendEmailVerification(result.user)

      // Save to Firestore in background — don't await to keep it fast
      saveUserToFirestore(result.user, { name })
      
      // 🔥 WEBHOOK HERE FOR N8N
      fetch("https://shuhel15.app.n8n.cloud/webhook-test/welcome-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: result.user.email
        })
      })
      return { success: true }
    } catch (err) {
      return { success: false, error: firebaseErrorMessage(err.code) }
    }
  }

  // Sign In with Google 
  const signInGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)

      const docRef = doc(db, 'users', result.user.uid)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) {
        // first time user
        await setDoc(docRef, {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          createdAt: serverTimestamp(),
        })

        // 🔥 webhook call ONLY first time
        fetch("https://shuhel15.app.n8n.cloud/webhook-test/welcome-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email
          })
        })

        // Send verification email even for Google users if requested
        try {
          await sendEmailVerification(result.user)
        } catch (e) {
          console.warn("Could not send verification to Google user:", e)
        }
      }

      return { success: true }
    } catch (err) {
      return { success: false, error: firebaseErrorMessage(err.code) }
    }
  }

  // Logout 
  const logOut = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInEmail, signUpEmail, signInGoogle, logOut, sendVerification, reloadUser }}>
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
    case 'auth/user-not-found': return 'No account found with this email.'
    case 'auth/wrong-password': return 'Incorrect password. Please try again.'
    case 'auth/invalid-credential': return 'Incorrect email or password.'
    case 'auth/email-already-in-use': return 'This email is already registered. Try signing in.'
    case 'auth/weak-password': return 'Password must be at least 6 characters.'
    case 'auth/invalid-email': return 'Please enter a valid email address.'
    case 'auth/popup-closed-by-user': return 'Google sign-in was cancelled.'
    case 'auth/network-request-failed': return 'Network error. Check your connection.'
    case 'auth/too-many-requests': return 'Too many attempts. Please wait and try again.'
    default: return 'Something went wrong. Please try again.'
  }
}