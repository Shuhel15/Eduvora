import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY })

// ─────────────────────────────────────────────
// CLASS 10 — Stream Recommendation
// ─────────────────────────────────────────────
export async function getClass10Recommendation(answers) {
  const prompt = `
You are a professional career counsellor in India helping a Class 10 student choose their stream.

The student answered these questions:
${Object.entries(answers).map(([q, a]) => `Q${q}: ${a}`).join('\n')}

Based on these answers, recommend the best stream for this student.
You MUST respond with ONLY a valid JSON object — no markdown, no backticks, no explanation outside the JSON.

{
  "recommended": "Science" or "Commerce" or "Arts",
  "match": <number between 70-99>,
  "why": "<2-3 sentences explaining why this stream suits them>",
  "secondChoice": "Science" or "Commerce" or "Arts",
  "secondMatch": <number between 50-75>,
  "secondWhy": "<1-2 sentences about second choice>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "tips": ["<tip 1>", "<tip 2>", "<tip 3>"]
}
`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    })
    const text  = response.text.trim()
    const clean = text.replace(/```json|```/g, '').trim()
    return { success: true, data: JSON.parse(clean) }
  } catch (err) {
    console.error('Gemini Class10 error:', err)
    if (err.message?.includes('429') || err.message?.includes('quota')) {
      return { success: false, error: 'quota', retryAfter: 60 }
    }
    return { success: false, error: 'AI recommendation failed. Please try again.' }
  }
}

// ─────────────────────────────────────────────
// CLASS 12 — Course Recommendation
// ─────────────────────────────────────────────
export async function getClass12Recommendation(answers) {
  const prompt = `
You are a professional career counsellor in India helping a Class 12 student choose the right college course.

The student answered these questions:
${Object.entries(answers).map(([q, a]) => `Q${q}: ${a}`).join('\n')}

Based on these answers, recommend the top 3 courses for this student in India.
You MUST respond with ONLY a valid JSON object — no markdown, no backticks, no explanation outside the JSON.

{
  "courses": [
    {
      "name": "<course name e.g. B.Tech Computer Science>",
      "match": <number 70-99>,
      "tag": "<short tag: Engineering or Medical or Management or Law or Design>",
      "duration": "<e.g. 4 years>",
      "why": "<2-3 sentences explaining why this course fits>",
      "jobs": [
        { "title": "<job title>", "salary": "<e.g. Rs 6-25 LPA>", "growth": "Very High or High or Moderate or Stable" },
        { "title": "<job title>", "salary": "<salary>", "growth": "Very High or High or Moderate or Stable" },
        { "title": "<job title>", "salary": "<salary>", "growth": "Very High or High or Moderate or Stable" },
        { "title": "<job title>", "salary": "<salary>", "growth": "Very High or High or Moderate or Stable" },
        { "title": "<job title>", "salary": "<salary>", "growth": "Very High or High or Moderate or Stable" }
      ],
      "subjects": ["<subject 1>", "<subject 2>", "<subject 3>", "<subject 4>", "<subject 5>", "<subject 6>", "<subject 7>", "<subject 8>"],
      "roadmap": [
        { "year": "<e.g. Year 1>", "desc": "<what student studies/does>" },
        { "year": "<e.g. Year 2>", "desc": "<what student studies/does>" },
        { "year": "<e.g. Year 3>", "desc": "<what student studies/does>" },
        { "year": "<e.g. Year 4>", "desc": "<what student studies/does>" }
      ],
      "topColleges": ["<college 1>", "<college 2>", "<college 3>", "<college 4>", "<college 5>"],
      "exams": ["<exam 1>", "<exam 2>", "<exam 3>"]
    }
  ]
}

Return exactly 3 courses ordered by match score (highest first).
`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    })
    const text  = response.text.trim()
    const clean = text.replace(/```json|```/g, '').trim()
    return { success: true, data: JSON.parse(clean) }
  } catch (err) {
    console.error('Gemini Class12 error:', err)
    if (err.message?.includes('429') || err.message?.includes('quota')) {
      return { success: false, error: 'quota', retryAfter: 60 }
    }
    return { success: false, error: 'AI recommendation failed. Please try again.' }
  }
}