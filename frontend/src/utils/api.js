import axios from 'axios';

// Uses REACT_APP_API_URL from .env, falls back to same-origin /api (for production)
// In development this must match your backend port exactly
const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.error || err.message || 'An unexpected error occurred';
    return Promise.reject(new Error(msg));
  }
);

export const resumeAPI = {
  uploadResume: (file) => {
    const form = new FormData();
    form.append('resume', file);
    return api.post('/resume/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  analyzeResume:      (resumeId)                          => api.post('/resume/analyze',                { resumeId }),
  matchJob:           (resumeId, jobDescription)          => api.post('/resume/job-match',              { resumeId, jobDescription }),
  generateQuestions:  (resumeId, jobDescription, difficulty) => api.post('/interview/generate-questions', { resumeId, jobDescription, difficulty }),
  submitAnswer:       (question, answer, jobRole)         => api.post('/interview/feedback',            { question, answer, jobRole }),
  health:             ()                                  => api.get('/health')
};

export default api;

