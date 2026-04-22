import { GoogleGenAI } from '@google/genai'

const API_KEYS = [
  import.meta.env.VITE_GEMINI_KEY_1,
  import.meta.env.VITE_GEMINI_KEY_2
]

function createAI(key) {
  return new GoogleGenAI({ apiKey: key })
}

// CLASS 10 — Stream Recommendation

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

  for (let key of API_KEYS) {
    try {
      const ai = createAI(key)

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
      })

      const text  = response.text.trim()
      const clean = text.replace(/```json|```/g, '').trim()
      return { success: true, data: JSON.parse(clean) }

    } catch (err) {
      console.error('Gemini Class10 error:', err)

      if (
        err.message?.includes('429') ||
        err.message?.includes('quota') ||
        err.message?.includes('API_KEY_INVALID')
      ) {
        continue
      }

      return { success: false, error: 'AI recommendation failed. Please try again.' }
    }
  }

  return { success: false, error: 'All API keys failed' }
}


// CLASS 12 — Course Recommendation

export async function getClass12Recommendation(answers) {
const prompt = `
Act as a career counsellor for a Class 12 student in India.

Student answers:
${Object.entries(answers).map(([q, a]) => `Q${q}: ${a}`).join('\n')}

Suggest the top 3 suitable courses.

Respond ONLY in valid JSON (no markdown, no extra text).

{
  "courses": [
    {
      "name": "<course name>",
      "match": <70-99>,
      "tag": "<Engineering/Medical/Management/Law/Design>",
      "duration": "<e.g. 4 years>",
      "why": "<2 short sentences>",
      "jobs": [
        { "title": "<job>", "salary": "<salary>", "growth": "<Very High/High/Moderate/Stable>" },
        { "title": "<job>", "salary": "<salary>", "growth": "<Very High/High/Moderate/Stable>" },
        { "title": "<job>", "salary": "<salary>", "growth": "<Very High/High/Moderate/Stable>" }
      ],
      "subjects": ["<sub1>", "<sub2>", "<sub3>", "<sub4>"],
      "roadmap": [
        { "year": "Year 1", "desc": "<short>" },
        { "year": "Year 2", "desc": "<short>" },
        { "year": "Year 3", "desc": "<short>" },
        { "year": "Year 4", "desc": "<short>" }
      ],
      "topColleges": ["<college1>", "<college2>", "<college3>"],
      "exams": ["<exam1>", "<exam2>"]
    }
  ]
}

Return exactly 3 courses sorted by match.
`

  for (let key of API_KEYS) {
    try {
      const ai = createAI(key)

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
      })

      const text  = response.text.trim()
      const clean = text.replace(/```json|```/g, '').trim()
      return { success: true, data: JSON.parse(clean) }

    } catch (err) {
      console.error('Gemini Class12 error:', err)

      if (
        err.message?.includes('429') ||
        err.message?.includes('quota') ||
        err.message?.includes('API_KEY_INVALID')
      ) {
        continue
      }

      return { success: false, error: 'AI recommendation failed. Please try again.' }
    }
  }

  return { success: false, error: 'All API keys failed' }
}