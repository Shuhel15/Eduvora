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
You are an expert career counsellor in India helping Class 10 students choose the best stream.

Student's Answers:
${Object.entries(answers).map(([q, a]) => `Q${q}: ${a}`).join('\n')}

Analyze all answers based on interests, strengths, favorite subjects, abilities, and career goals.

Stream guidelines:
- Science: Maths, Science, Technology, Engineering, Medicine, Research.
- Commerce: Business, Finance, Accounting, Economics, Management, Entrepreneurship.
- Arts: History, Psychology, Sociology, Political Science, Law, Languages, Media, Design.

Rules:
- Recommend the stream that best matches the student's overall profile.
- Do not assume Science is always better.
- Give a realistic match score based on the answers.
- Recommended match: 80-99.
- Second choice match: 55-79.
- Second choice must be different from recommended.
- Strengths and tips must be relevant to the student's answers.
- Return ONLY valid JSON. No markdown, no explanation outside JSON.

Return exactly this format:
{
  "recommended": "Science/Commerce/Arts",
  "match": 85,
  "why": "2-3 sentences explaining why this stream suits the student.",
  "secondChoice": "Science/Commerce/Arts",
  "secondMatch": 65,
  "secondWhy": "1-2 sentences explaining the second choice.",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "tips": ["tip 1", "tip 2", "tip 3"]
}
`;

  for (let key of API_KEYS) {
    try {
      const ai = createAI(key)

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
      })

      const text = response.text.trim()
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
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
      })

      const text = response.text.trim()
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