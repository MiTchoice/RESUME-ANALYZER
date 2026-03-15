import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';
import { resumeAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Briefcase, CheckCircle, XCircle, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function JobMatch() {
  const navigate = useNavigate();
  const { resumeData, jobDescription, setJobDescription, jobMatchResult, setJobMatchResult } = useResume();
  const [loading, setLoading] = useState(false);

  if (!resumeData) return (
    <div className="text-center py-20">
      <p className="text-gray-400 mb-4">Upload a resume first to use Job Match</p>
      <button onClick={() => navigate('/upload')} className="btn-primary">Upload Resume</button>
    </div>
  );

  const handleMatch = async () => {
    if (!jobDescription.trim()) return toast.error('Please paste a job description');
    setLoading(true);
    try {
      const res = await resumeAPI.matchJob(resumeData.resumeId, jobDescription);
      setJobMatchResult(res.data);
      toast.success('Job match analysis complete!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const score = jobMatchResult?.match_score || 0;
  const scoreColor = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Job Match Analysis</h1>
        <p className="section-sub">Compare your resume against any job description</p>
      </div>

      <div className="card">
        <label className="block text-sm font-medium text-gray-300 mb-3">Paste Job Description</label>
        <textarea
          value={jobDescription}
          onChange={e => setJobDescription(e.target.value)}
          rows={8}
          placeholder="Paste the full job description here including required skills, experience, and responsibilities..."
          className="input-field resize-none font-mono text-sm"
        />
        <button
          onClick={handleMatch}
          disabled={loading || !jobDescription.trim()}
          className="btn-primary mt-4 flex items-center gap-2"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><Briefcase size={16} /> Analyze Match</>}
        </button>
      </div>

      {jobMatchResult && (
        <div className="space-y-5">
          {/* Score overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card flex flex-col items-center py-6">
              <div className="w-28 h-28 mb-3">
                <CircularProgressbar value={score} text={`${score}%`}
                  styles={buildStyles({ textSize:'20px', pathColor: scoreColor, textColor:'#f9fafb', trailColor:'#1f2937' })} />
              </div>
              <p className="text-sm text-gray-400 font-medium">Overall Match</p>
            </div>
            <div className="card flex flex-col items-center py-6">
              <div className="w-28 h-28 mb-3">
                <CircularProgressbar value={jobMatchResult.skills_match || 0} text={`${jobMatchResult.skills_match || 0}%`}
                  styles={buildStyles({ textSize:'20px', pathColor:'#6366f1', textColor:'#f9fafb', trailColor:'#1f2937' })} />
              </div>
              <p className="text-sm text-gray-400 font-medium">Skills Match</p>
            </div>
            <div className="card flex flex-col items-center py-6">
              <div className="w-28 h-28 mb-3">
                <CircularProgressbar value={jobMatchResult.experience_match || 0} text={`${jobMatchResult.experience_match || 0}%`}
                  styles={buildStyles({ textSize:'20px', pathColor:'#a78bfa', textColor:'#f9fafb', trailColor:'#1f2937' })} />
              </div>
              <p className="text-sm text-gray-400 font-medium">Experience Match</p>
            </div>
          </div>

          {/* Matched skills */}
          {jobMatchResult.matched_skills?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle size={18} className="text-accent-400" />
                <h3 className="font-semibold text-white">Matched Skills ({jobMatchResult.matched_skills.length})</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobMatchResult.matched_skills.map((sk, i) => (
                  <span key={i} className="badge bg-accent-500/15 text-accent-300 border border-accent-500/30">
                    <CheckCircle size={10} /> {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing skills */}
          {jobMatchResult.missing_skills?.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <XCircle size={18} className="text-red-400" />
                <h3 className="font-semibold text-white">Missing Skills ({jobMatchResult.missing_skills.length})</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {jobMatchResult.missing_skills.map((sk, i) => (
                  <span key={i} className="badge bg-red-500/10 text-red-300 border border-red-500/20">
                    <XCircle size={10} /> {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {jobMatchResult.recommendations && (
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={18} className="text-amber-400" />
                <h3 className="font-semibold text-white">Recommendations</h3>
              </div>
              <div className="prose prose-sm prose-invert max-w-none text-gray-300 text-sm leading-relaxed">
                <ReactMarkdown>{jobMatchResult.recommendations}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => navigate('/interview')}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Generate Interview Questions for This Role <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
