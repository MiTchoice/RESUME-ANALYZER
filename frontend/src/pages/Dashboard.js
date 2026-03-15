import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Upload, Briefcase, MessageSquare, Mic, CheckCircle, AlertCircle, TrendingUp, User, Code, BookOpen } from 'lucide-react';

function ScoreRing({ value, label, color }) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-3">
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            textSize: '22px',
            pathColor: color,
            textColor: '#f9fafb',
            trailColor: '#1f2937'
          })}
        />
      </div>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

function EmptyState({ onUpload }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 rounded-3xl bg-primary-600/20 flex items-center justify-center mx-auto mb-6">
        <Upload size={36} className="text-primary-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3">No Resume Analyzed Yet</h2>
      <p className="text-gray-400 mb-8">Upload your resume to unlock all features</p>
      <button onClick={onUpload} className="btn-primary">Upload Resume Now</button>
    </div>
  );
}

export default function Dashboard() {
  const navigate   = useNavigate();
  const { analysisResult, jobMatchResult, interviewQuestions } = useResume();

  if (!analysisResult) return (
    <div>
      <h1 className="section-title">Dashboard</h1>
      <p className="section-sub">Your resume analysis overview</p>
      <EmptyState onUpload={() => navigate('/upload')} />
    </div>
  );

  const { ats_score, skills = [], experience = [], projects = [], improvements = [], contact = {} } = analysisResult;

  const scoreColor = ats_score >= 80 ? '#10b981' : ats_score >= 60 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Dashboard</h1>
        <p className="section-sub">Your resume analysis at a glance</p>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card flex flex-col items-center justify-center py-6">
          <ScoreRing value={ats_score || 0} label="ATS Score" color={scoreColor} />
        </div>
        <div className="card flex flex-col items-center justify-center py-6">
          <ScoreRing value={jobMatchResult?.match_score || 0} label="Job Match" color="#6366f1" />
        </div>
        <div className="card flex flex-col items-center justify-center py-6">
          <div className="text-4xl font-bold text-white mb-2">{skills.length}</div>
          <p className="text-sm text-gray-400">Skills Found</p>
        </div>
        <div className="card flex flex-col items-center justify-center py-6">
          <div className="text-4xl font-bold text-white mb-2">{interviewQuestions.length}</div>
          <p className="text-sm text-gray-400">Questions Ready</p>
        </div>
      </div>

      {/* Contact summary */}
      {contact.name && (
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-600/20 flex items-center justify-center flex-shrink-0">
            <User size={22} className="text-primary-400" />
          </div>
          <div>
            <p className="font-semibold text-white">{contact.name}</p>
            <p className="text-sm text-gray-400">{[contact.email, contact.phone, contact.location].filter(Boolean).join(' · ')}</p>
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Code size={18} className="text-primary-400" />
          <h3 className="font-semibold text-white">Extracted Skills</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((sk, i) => (
            <span key={i} className="badge bg-primary-600/20 text-primary-300 border border-primary-600/30">
              {sk}
            </span>
          ))}
          {skills.length === 0 && <p className="text-gray-500 text-sm">No skills extracted</p>}
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={18} className="text-accent-400" />
            <h3 className="font-semibold text-white">Experience</h3>
          </div>
          <div className="space-y-3">
            {experience.map((exp, i) => (
              <div key={i} className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-white">{exp.title || exp.role}</p>
                    <p className="text-sm text-gray-400">{exp.company} {exp.duration && `· ${exp.duration}`}</p>
                  </div>
                </div>
                {exp.description && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-purple-400" />
            <h3 className="font-semibold text-white">Projects</h3>
          </div>
          <div className="space-y-3">
            {projects.map((proj, i) => (
              <div key={i} className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <p className="font-medium text-white">{proj.name || proj.title}</p>
                {proj.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{proj.description}</p>}
                {proj.technologies && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(Array.isArray(proj.technologies) ? proj.technologies : [proj.technologies]).map((t, j) => (
                      <span key={j} className="badge bg-gray-700 text-gray-300 text-xs">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-amber-400" />
            <h3 className="font-semibold text-white">Improvement Suggestions</h3>
          </div>
          <div className="space-y-2">
            {improvements.map((imp, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                <AlertCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-300">{imp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => navigate('/job-match')} className="card hover:border-primary-600/50 transition-colors text-left group">
          <Briefcase size={20} className="text-primary-400 mb-3" />
          <p className="font-medium text-white">Match a Job</p>
          <p className="text-xs text-gray-500 mt-1">Paste a job description to see how well you match</p>
        </button>
        <button onClick={() => navigate('/interview')} className="card hover:border-purple-600/50 transition-colors text-left group">
          <MessageSquare size={20} className="text-purple-400 mb-3" />
          <p className="font-medium text-white">Interview Questions</p>
          <p className="text-xs text-gray-500 mt-1">Generate role-specific interview questions</p>
        </button>
        <button onClick={() => navigate('/mock')} className="card hover:border-accent-600/50 transition-colors text-left group">
          <Mic size={20} className="text-accent-400 mb-3" />
          <p className="font-medium text-white">Mock Interview</p>
          <p className="text-xs text-gray-500 mt-1">Practice with AI feedback on your answers</p>
        </button>
      </div>
    </div>
  );
}
