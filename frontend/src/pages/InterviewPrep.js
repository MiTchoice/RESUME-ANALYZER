import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { resumeAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { MessageSquare, ChevronDown, ChevronUp, Loader2, Mic, Lightbulb } from 'lucide-react';

const CATEGORIES = {
  technical: { label: 'Technical', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  behavioral: { label: 'Behavioral', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  situational: { label: 'Situational', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  culture: { label: 'Culture Fit', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' }
};

function QuestionCard({ q, idx }) {
  const [open, setOpen] = useState(false);
  const cat = CATEGORIES[q.category] || CATEGORIES.technical;
  return (
    <div className="card border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-start gap-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <span className="text-gray-600 text-sm font-mono w-6 flex-shrink-0 mt-0.5">{String(idx+1).padStart(2,'0')}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`badge ${cat.bg} ${cat.color} ${cat.border}`}>{cat.label}</span>
            {q.difficulty && (
              <span className={`badge text-xs ${
                q.difficulty === 'easy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                q.difficulty === 'hard' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                'bg-gray-700 text-gray-300'
              }`}>{q.difficulty}</span>
            )}
          </div>
          <p className="text-gray-200 text-sm leading-relaxed">{q.question}</p>
        </div>
        <button className="text-gray-500 hover:text-gray-300 flex-shrink-0 mt-0.5">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {open && q.hint && (
        <div className="mt-4 ml-9 p-3 bg-primary-500/5 border border-primary-500/20 rounded-xl flex gap-2">
          <Lightbulb size={14} className="text-primary-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 leading-relaxed">{q.hint}</p>
        </div>
      )}
    </div>
  );
}

export default function InterviewPrep() {
  const navigate = useNavigate();
  const { resumeData, jobDescription, interviewQuestions, setInterviewQuestions } = useResume();
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading]       = useState(false);
  const [filter, setFilter]         = useState('all');

  if (!resumeData) return (
    <div className="text-center py-20">
      <p className="text-gray-400 mb-4">Upload a resume first</p>
      <button onClick={() => navigate('/upload')} className="btn-primary">Upload Resume</button>
    </div>
  );

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await resumeAPI.generateQuestions(resumeData.resumeId, jobDescription, difficulty);
      setInterviewQuestions(res.data.questions || []);
      toast.success(`${res.data.questions?.length || 0} questions generated!`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all' ? interviewQuestions : interviewQuestions.filter(q => q.category === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Interview Preparation</h1>
        <p className="section-sub">AI-generated questions tailored to your resume and target role</p>
      </div>

      {/* Config */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
            <div className="flex gap-2">
              {['easy','medium','hard'].map(d => (
                <button key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize border transition-all
                    ${difficulty === d
                      ? 'bg-primary-600/30 text-primary-300 border-primary-500/50'
                      : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Description (optional)</label>
            <textarea
              value={jobDescription}
              readOnly
              rows={2}
              placeholder="No job description set — go to Job Match to add one"
              className="input-field text-xs resize-none opacity-60"
            />
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><MessageSquare size={16} /> Generate Questions</>}
        </button>
      </div>

      {interviewQuestions.length > 0 && (
        <>
          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {['all', ...Object.keys(CATEGORIES)].map(cat => (
              <button key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all border
                  ${filter === cat
                    ? 'bg-primary-600/30 text-primary-300 border-primary-500/50'
                    : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600'}`}
              >
                {cat === 'all' ? `All (${interviewQuestions.length})` : `${CATEGORIES[cat].label} (${interviewQuestions.filter(q=>q.category===cat).length})`}
              </button>
            ))}
          </div>

          {/* Questions list */}
          <div className="space-y-3">
            {filtered.map((q, i) => <QuestionCard key={i} q={q} idx={i} />)}
          </div>

          <button onClick={() => navigate('/mock')} className="btn-primary w-full flex items-center justify-center gap-2">
            <Mic size={16} /> Practice in Mock Interview
          </button>
        </>
      )}
    </div>
  );
}
