import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Target, MessageSquare, TrendingUp, CheckCircle, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Zap,         color: 'text-yellow-400', bg: 'bg-yellow-400/10', title: 'AI Resume Parsing',     desc: 'Extract skills, experience & projects using NLP instantly.' },
  { icon: Target,      color: 'text-primary-400', bg: 'bg-primary-400/10', title: 'ATS Score Calculator', desc: 'Know exactly how recruiters\' systems will score your resume.' },
  { icon: TrendingUp,  color: 'text-green-400',  bg: 'bg-green-400/10',  title: 'Job Match Analysis',   desc: 'Compare your profile against any job description with skill gap detection.' },
  { icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10', title: 'Interview Questions', desc: 'Auto-generate role-specific technical and behavioral questions.' },
  { icon: Star,        color: 'text-pink-400',   bg: 'bg-pink-400/10',   title: 'Mock Interview AI',    desc: 'Practice answers and receive instant AI-powered feedback.' },
  { icon: CheckCircle, color: 'text-accent-400', bg: 'bg-accent-400/10', title: 'Smart Improvements',   desc: 'Get actionable, prioritized suggestions to boost your resume.' }
];

const stats = [
  { value: '10x', label: 'Faster prep' },
  { value: '94%', label: 'User satisfaction' },
  { value: '3min', label: 'Average analysis time' }
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-gray-800/50 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl">ResumeAI</span>
        </div>
        <button onClick={() => navigate('/upload')} className="btn-primary text-sm">
          Get Started Free
        </button>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto text-center px-6 pt-20 pb-16">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
          <span className="badge bg-primary-600/20 text-primary-400 border border-primary-600/30 mb-6 inline-flex">
            <Zap size={12} /> AI-Powered Career Platform
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Land Your Dream Job with{' '}
            <span className="gradient-text">AI-Powered</span>{' '}
            Resume Analysis
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Upload your resume, get an instant ATS score, discover skill gaps, and ace interviews with AI mock sessions.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button onClick={() => navigate('/upload')} className="btn-primary flex items-center gap-2 text-base px-8 py-3">
              Analyze My Resume <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-secondary flex items-center gap-2 text-base px-8 py-3">
              View Demo
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-16 max-w-md mx-auto">
          {stats.map(s => (
            <div key={s.value} className="card text-center py-4">
              <p className="text-2xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Everything You Need to Get Hired</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{opacity:0, y:20}}
              animate={{opacity:1, y:0}}
              transition={{delay: i * 0.08}}
              className="card hover:border-gray-700 transition-colors group"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                <f.icon size={20} className={f.color} />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="text-center py-8 text-gray-600 text-sm border-t border-gray-800">
        <p>Built with React + Node.js + OpenAI API Â· ResumeAI 2024</p>
      </footer>
    </div>
  );
}

