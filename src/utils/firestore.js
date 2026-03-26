/* eslint-disable no-unused-vars */
import {
  doc, collection, addDoc, getDocs,
  orderBy, query, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'

//  Save quiz result to Firestore 
export async function saveQuizResult(userId, { grade, answers, result }) {
  try {
    const ref = collection(db, 'users', userId, 'quizzes')
    const docRef = await addDoc(ref, {
      grade,
      answers,
      result,
      createdAt: serverTimestamp(),
    })
    return { success: true, id: docRef.id }
  } catch (err) {
    console.error('Save quiz error:', err)
    return { success: false }
  }
}

// Fetch all quiz results for a user
export async function getQuizHistory(userId) {
  try {
    const ref = collection(db, 'users', userId, 'quizzes')
    const q   = query(ref, orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error('Fetch history error:', err)
    return []
  }
}