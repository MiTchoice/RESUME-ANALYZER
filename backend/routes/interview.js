const express = require('express');
const { body, validationResult } = require('express-validator');
const { generateInterviewQuestions, evaluateAnswer } = require('../utils/interviewGenerator');
const { parseResumeWithAI } = require('../utils/resumeParser');
const store = require('../utils/store');

const router = express.Router();

// ─── POST /api/interview/generate-questions ───────────────────────
router.post('/generate-questions',
  body('resumeId').notEmpty().withMessage('resumeId is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    try {
      const { resumeId, jobDescription = '', difficulty = 'medium' } = req.body;
      const session = store.get(resumeId);
      if (!session) return res.status(404).json({ error: 'Resume session not found. Please re-upload.' });

      const parsedResume = session.parsedResume || await parseResumeWithAI(session.rawText);
      const result = await generateInterviewQuestions(parsedResume, jobDescription, difficulty);

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/interview/feedback ─────────────────────────────────
router.post('/feedback',
  body('question').notEmpty().withMessage('question is required'),
  body('answer').notEmpty().withMessage('answer is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    try {
      const { question, answer, jobRole = 'Software Engineer' } = req.body;
      const feedback = await evaluateAnswer(question, answer, jobRole);
      res.json(feedback);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
