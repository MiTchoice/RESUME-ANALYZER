const { chatJSON, chat } = require('./openai');

/**
 * Compare resume against job description and return match scores + skill gaps.
 */
async function analyzeJobMatch(parsedResume, jobDescription) {
  const prompt = `You are a technical recruiter and career coach. Analyze how well this candidate's resume matches the job description.

CANDIDATE RESUME:
Skills: ${(parsedResume.skills || []).join(', ')}
Experience: ${(parsedResume.experience || []).map(e => `${e.title} at ${e.company} (${e.duration})`).join('; ')}
Education: ${(parsedResume.education || []).map(e => `${e.degree} from ${e.institution}`).join('; ')}
Projects: ${(parsedResume.projects || []).map(p => p.name).join(', ')}

JOB DESCRIPTION:
${jobDescription.slice(0, 3000)}

Return ONLY a valid JSON object:
{
  "match_score": <integer 0-100 overall match>,
  "skills_match": <integer 0-100>,
  "experience_match": <integer 0-100>,
  "job_title": "<detected job title from JD>",
  "matched_skills": ["skills from resume that match JD requirements"],
  "missing_skills": ["required skills from JD not found in resume"],
  "matched_experience": ["experience points that align with JD"],
  "recommendations": "3-5 specific markdown-formatted recommendations to improve match. Use bullet points.",
  "fit_level": "<one of: Excellent Fit | Good Fit | Partial Fit | Low Fit>"
}`;

  return chatJSON([{ role: 'user', content: prompt }], { temperature: 0.3, max_tokens: 1200 });
}

module.exports = { analyzeJobMatch };
