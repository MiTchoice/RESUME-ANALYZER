const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ResumeAI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    openai: !!process.env.OPENAI_API_KEY
  });
});

module.exports = router;
