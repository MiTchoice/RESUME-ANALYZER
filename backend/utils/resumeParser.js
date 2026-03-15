const pdfParse = require('pdf-parse');
const { chatJSON } = require('./openai');

/**
 * Extract raw text from a PDF buffer.
 */
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (err) {
    throw new Error('Failed to parse PDF: ' + err.message);
  }
}

/**
 * Use GPT to structure resume text into JSON with skills, experience, projects, contact.
 */
async function parseResumeWithAI(text) {
  const prompt = `You are an expert resume parser. Extract structured information from the resume text below.

Return ONLY a valid JSON object with this exact schema:
{
  "contact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "github": "string"
  },
  "summary": "string (professional summary or objective if present)",
  "skills": ["array of individual skill strings"],
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "date range",
      "location": "optional",
      "description": "2-3 sentence summary of responsibilities"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "school name",
      "year": "graduation year",
      "gpa": "optional"
    }
  ],
  "projects": [
    {
      "name": "project name",
      "description": "brief description",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "certifications": ["list of certifications"],
  "languages": ["programming or spoken languages"]
}

Resume text:
${text.slice(0, 6000)}`;

  return chatJSON([{ role: 'user', content: prompt }], { temperature: 0.2, max_tokens: 2000 });
}

/**
 * Calculate ATS score based on resume structure and content.
 */
async function calculateATSScore(parsedResume, rawText) {
  const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze this resume and calculate a detailed ATS score.

Resume data:
${JSON.stringify(parsedResume, null, 2)}

Raw text length: ${rawText.length} characters

Return ONLY a valid JSON object:
{
  "ats_score": <integer 0-100>,
  "breakdown": {
    "contact_info": <0-15>,
    "skills_section": <0-20>,
    "work_experience": <0-25>,
    "education": <0-15>,
    "formatting": <0-10>,
    "keywords": <0-15>
  },
  "improvements": [
    "specific actionable improvement 1",
    "specific actionable improvement 2",
    "specific actionable improvement 3",
    "specific actionable improvement 4",
    "specific actionable improvement 5"
  ],
  "strengths": [
    "strength 1",
    "strength 2"
  ]
}

Score based on:
- Contact info completeness (email, phone, LinkedIn)
- Clear skills section with relevant keywords
- Quantified work experience with action verbs
- Education credentials
- Clean formatting (no tables, images, complex layouts)
- Industry keywords density`;

  return chatJSON([{ role: 'user', content: prompt }], { temperature: 0.3, max_tokens: 1000 });
}

module.exports = { extractTextFromPDF, parseResumeWithAI, calculateATSScore };
