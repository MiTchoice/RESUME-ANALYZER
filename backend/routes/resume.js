const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const { extractTextFromPDF, parseResumeWithAI, calculateATSScore } = require('../utils/resumeParser');
const { analyzeJobMatch } = require('../utils/jobMatcher');
const store = require('../utils/store');

const router = express.Router();

// ─── Multer config ────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are accepted'), false);
  }
});

// ─── POST /api/resume/upload ──────────────────────────────────────
router.post('/upload', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });

    const resumeId = uuidv4();
    const rawText  = await extractTextFromPDF(req.file.buffer);

    if (!rawText || rawText.trim().length < 50) {
      return res.status(422).json({ error: 'Could not extract text from PDF. Ensure the PDF is text-based, not a scanned image.' });
    }

    // Store raw text keyed by resumeId
    store.set(resumeId, { rawText, parsedResume: null, fileName: req.file.originalname });

    res.json({ resumeId, rawText: rawText.slice(0, 500) + '…', message: 'Upload successful' });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/resume/analyze ─────────────────────────────────────
router.post('/analyze',
  body('resumeId').notEmpty().withMessage('resumeId is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    try {
      const { resumeId } = req.body;
      const session = store.get(resumeId);
      if (!session) return res.status(404).json({ error: 'Resume session not found or expired. Please re-upload.' });

      // Parse with AI
      const parsedResume = await parseResumeWithAI(session.rawText);

      // Calculate ATS score
      const atsData = await calculateATSScore(parsedResume, session.rawText);

      const result = {
        ...parsedResume,
        ats_score:    atsData.ats_score   || 0,
        ats_breakdown: atsData.breakdown  || {},
        improvements: atsData.improvements || [],
        strengths:    atsData.strengths   || []
      };

      // Update store with parsed data
      store.set(resumeId, { ...session, parsedResume: result });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

// ─── POST /api/resume/job-match ───────────────────────────────────
router.post('/job-match',
  body('resumeId').notEmpty(),
  body('jobDescription').notEmpty().withMessage('jobDescription is required'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    try {
      const { resumeId, jobDescription } = req.body;
      const session = store.get(resumeId);
      if (!session) return res.status(404).json({ error: 'Resume session not found. Please re-upload.' });

      const parsedResume = session.parsedResume || await parseResumeWithAI(session.rawText);
      const matchResult  = await analyzeJobMatch(parsedResume, jobDescription);

      res.json(matchResult);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
