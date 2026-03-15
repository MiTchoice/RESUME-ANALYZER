const { chatJSON } = require('./openai');

/**
 * Generate tailored interview questions based on resume and optional job description.
 */
async function generateInterviewQuestions(parsedResume, jobDescription = '', difficulty = 'medium') {
  const roleContext = jobDescription
    ? `Target job: ${jobDescription.slice(0, 1000)}`
    : `Based on candidate's background`;

  const prompt = `You are a senior technical interviewer. Generate 15 diverse interview questions for this candidate.

CANDIDATE PROFILE:
- Skills: ${(parsedResume.skills || []).slice(0, 20).join(', ')}
- Most Recent Role: ${parsedResume.experience?.[0]?.title || 'N/A'} at ${parsedResume.experience?.[0]?.company || 'N/A'}
- Education: ${parsedResume.education?.[0]?.degree || 'N/A'}
- Projects: ${(parsedResume.projects || []).map(p => p.name).join(', ')}
- ${roleContext}

Difficulty: ${difficulty}

Return ONLY a valid JSON object:
{
  "questions": [
    {
      "question": "the interview question",
      "category": "<one of: technical | behavioral | situational | culture>",
      "difficulty": "${difficulty}",
      "hint": "a brief tip on how to answer this well (1-2 sentences)"
    }
  ]
}

Rules:
- 5 technical questions specific to their skills/stack
- 4 behavioral questions (STAR format situations)
- 3 situational / problem-solving questions
- 2 role/project-specific questions
- 1 culture fit question
- Questions must be specific to this candidate, not generic
- Difficulty ${difficulty}: ${difficulty === 'easy' ? 'basics and concepts' : difficulty === 'hard' ? 'deep technical and leadership' : 'intermediate, some depth required'}`;

  return chatJSON([{ role: 'user', content: prompt }], { temperature: 0.7, max_tokens: 2500 });
}

/**
 * Evaluate a candidate's answer and provide structured feedback.
 */
async function evaluateAnswer(question, answer, jobRole = 'Software Engineer') {
  const prompt = `You are an expert interviewer evaluating a candidate for a ${jobRole} position.

QUESTION: ${question}

CANDIDATE'S ANSWER: ${answer}

Evaluate the answer and return ONLY a valid JSON object:
{
  "score": <integer 1-10>,
  "feedback": "2-3 paragraph detailed feedback in markdown. Be constructive and specific.",
  "strengths": [
    "specific strength 1",
    "specific strength 2"
  ],
  "improvements": [
    "specific improvement 1",
    "specific improvement 2"
  ],
  "model_answer_hint": "A brief hint about what an excellent answer would include (1-2 sentences)"
}

Scoring guide:
9-10: Outstanding – comprehensive, well-structured, specific examples
7-8:  Good – covers key points with some specifics
5-6:  Average – addresses question but lacks depth or examples
3-4:  Below average – partial answer, missing key elements
1-2:  Poor – off-topic or very incomplete`;

  return chatJSON([{ role: 'user', content: prompt }], { temperature: 0.4, max_tokens: 1000 });
}

module.exports = { generateInterviewQuestions, evaluateAnswer };
