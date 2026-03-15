import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { resumeAPI } from '../utils/api';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Mic, Send, ChevronRight, ChevronLeft, CheckCircle, Loader2, RotateCcw, Star } from 'lucide-react';

function ScoreBadge({ score }) {
  const color = score >= 8 ? 'text-green-400 bg-green-500/10 border-green-500/20'
    : score >= 5 ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    : 'text-red-400 bg-red-500/10 border-red-500/20';
  return (
    <span className={`badge ${color} text-base font-bold px-4 py-1.5`}>
      <Star size={14} /> {score}/10
    </span>
  );
}

export default function MockInterview() {
  const navigate = useNavigate();
  const { resumeData, interviewQuestions, jobMatchResult } = useResume();
  const [idx, setIdx]         = useState(0);
  const [answer, setAnswer]   = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]); // [{question, answer, feedback}]
  const [done, setDone]       = useState(false);

  if (!resumeData) return (
    <div className="text-center py-20">
      <p className="text-gray-400 mb-4">Upload a resume first</p>
      <button onClick={() => navigate('/upload')} className="btn-primary">Upload Resume</button>
    </div>
  );

  if (interviewQuestions.length === 0) return (
    <div className="text-center py-20">
      <p className="text-gray-400 mb-4">Generate interview questions first</p>
      <button onClick={() => navigate('/interview')} className="btn-primary">Go to Interview Prep</button>
    </div>
  );

  const currentQ = interviewQuestions[idx];
  const jobRole  = jobMatchResult?.job_title || 'Software Engineer';
  const total    = interviewQuestions.length;

  const handleSubmit = async () => {
    if (!answer.trim()) return toast.error('Please type your answer');
    setLoading(true);
    try {
      const res = await resumeAPI.submitAnswer(currentQ.question, answer, jobRole);
      const fb  = res.data;
      setFeedback(fb);
      setHistory(h => [...h, { question: currentQ.question, answer, feedback: fb }]);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (idx + 1 >= total) { setDone(true); return; }
    setIdx(i => i + 1);
    setAnswer('');
    setFeedback(null);
  };

  const handleRestart = () => {
    setIdx(0); setAnswer(''); setFeedback(null); setHistory([]); setDone(false);
  };

  if (done) {
    const avg = history.length > 0
      ? Math.round(history.reduce((s, h) => s + (h.feedback?.score || 0), 0) / history.length)
      : 0;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="card text-center py-10">
          <div className="w-16 h-16 rounded-3xl bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-accent-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Mock Interview Complete!</h2>
          <p className="text-gray-400 mb-6">You answered {history.length} questions</p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-gray-400 text-sm">Average Score:</span>
            <ScoreBadge score={avg} />
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={handleRestart} className="btn-secondary flex items-center gap-2">
              <RotateCcw size={16} /> Try Again
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">Back to Dashboard</button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Session Summary</h3>
          {history.map((h, i) => (
            <div key={i} className="card space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-300">{i+1}. {h.question}</p>
                {h.feedback?.score && <ScoreBadge score={h.feedback.score} />}
              </div>
              <div className="p-3 bg-gray-800/50 rounded-xl text-xs text-gray-400 leading-relaxed">{h.answer}</div>
              {h.feedback?.feedback && (
                <div className="prose prose-sm prose-invert max-w-none text-gray-400 text-xs">
                  <ReactMarkdown>{h.feedback.feedback}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Mock Interview</h1>
          <p className="section-sub">Answer questions and receive instant AI feedback</p>
        </div>
        <span className="badge bg-gray-800 text-gray-300 border-gray-700 text-sm">
          {idx + 1} / {total}
        </span>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full transition-all duration-300"
          style={{ width: `${((idx) / total) * 100}%` }} />
      </div>

      {/* Question card */}
      <div className="card border border-gray-700">
        <div className="flex items-center gap-2 mb-3">
          <Mic size={16} className="text-primary-400" />
          <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Question {idx + 1}</span>
          {currentQ.category && (
            <span className="badge bg-gray-800 text-gray-400 border-gray-700 capitalize text-xs">{currentQ.category}</span>
          )}
        </div>
        <p className="text-white font-medium text-lg leading-relaxed">{currentQ.question}</p>
      </div>

      {/* Answer area */}
      {!feedback ? (
        <div className="space-y-3">
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            rows={7}
            placeholder="Type your answer here. Be specific and use examples from your experience..."
            className="input-field resize-none text-sm leading-relaxed"
          />
          <div className="flex gap-3">
            {idx > 0 && (
              <button onClick={() => { setIdx(i=>i-1); setAnswer(''); setFeedback(null); }}
                className="btn-secondary flex items-center gap-2">
                <ChevronLeft size={16} /> Prev
              </button>
            )}
            <button onClick={handleSubmit} disabled={loading || !answer.trim()} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><Send size={16} /> Get AI Feedback</>}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Your answer */}
          <div className="card bg-gray-900/50">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Your Answer</p>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{answer}</p>
          </div>

          {/* AI Feedback */}
          <div className="card border border-primary-600/30 bg-primary-600/5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-primary-300 flex items-center gap-2">
                <Star size={14} /> AI Feedback
              </p>
              {feedback.score && <ScoreBadge score={feedback.score} />}
            </div>
            <div className="prose prose-sm prose-invert max-w-none text-gray-300 text-sm leading-relaxed">
              <ReactMarkdown>{feedback.feedback}</ReactMarkdown>
            </div>

            {feedback.strengths?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-green-400 mb-2">✓ Strengths</p>
                <ul className="space-y-1">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2"><span className="text-green-500">•</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {feedback.improvements?.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-amber-400 mb-2">↑ Improve</p>
                <ul className="space-y-1">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2"><span className="text-amber-500">•</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
            {idx + 1 >= total ? 'Finish Interview' : 'Next Question'} <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
