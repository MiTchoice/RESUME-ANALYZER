import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useResume } from '../context/ResumeContext';
import { resumeAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { Upload, FileText, CheckCircle, Loader2, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeUpload() {
  const navigate = useNavigate();
  const { setResumeData, setAnalysisResult, setUploadedFileName, setLoading } = useResume();
  const [file, setFile]             = useState(null);
  const [status, setStatus]         = useState('idle'); // idle | uploading | analyzing | done | error
  const [progress, setProgress]     = useState(0);
  const [errorMsg, setErrorMsg]     = useState('');

  const onDrop = useCallback((accepted) => {
    if (accepted.length === 0) return;
    setFile(accepted[0]);
    setStatus('idle');
    setErrorMsg('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    onDropRejected: (rej) => {
      toast.error(rej[0]?.errors[0]?.message || 'Invalid file');
    }
  });

  const handleAnalyze = async () => {
    if (!file) return toast.error('Please upload a PDF file first');
    setStatus('uploading');
    setLoading(true);
    setProgress(20);

    try {
      // Step 1: Upload
      const upRes = await resumeAPI.uploadResume(file);
      const { resumeId, rawText } = upRes.data;
      setResumeData({ resumeId, rawText });
      setUploadedFileName(file.name);
      setProgress(50);

      // Step 2: Analyze
      setStatus('analyzing');
      const anRes = await resumeAPI.analyzeResume(resumeId);
      setAnalysisResult(anRes.data);
      setProgress(100);
      setStatus('done');
      toast.success('Resume analyzed successfully!');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="section-title">Upload Resume</h1>
        <p className="section-sub">Upload your PDF resume for AI-powered analysis</p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-gray-700 hover:border-gray-500 bg-gray-900/50'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors
            ${isDragActive ? 'bg-primary-500/20' : 'bg-gray-800'}`}>
            <Upload size={28} className={isDragActive ? 'text-primary-400' : 'text-gray-400'} />
          </div>
          <div>
            <p className="text-white font-semibold text-lg">
              {isDragActive ? 'Drop your PDF here' : 'Drag & drop your resume'}
            </p>
            <p className="text-gray-500 text-sm mt-1">or <span className="text-primary-400 underline">browse files</span> · PDF only · Max 10MB</p>
          </div>
        </div>
      </div>

      {/* File preview */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="card flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB · PDF</p>
            </div>
            {status === 'idle' && (
              <button onClick={() => setFile(null)} className="text-gray-500 hover:text-red-400 transition-colors">
                <X size={18} />
              </button>
            )}
            {status === 'done' && <CheckCircle size={20} className="text-accent-400" />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {(status === 'uploading' || status === 'analyzing') && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>{status === 'uploading' ? 'Uploading & extracting text...' : 'AI analyzing your resume...'}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleAnalyze}
        disabled={!file || status === 'uploading' || status === 'analyzing' || status === 'done'}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3"
      >
        {(status === 'uploading' || status === 'analyzing') ? (
          <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
        ) : status === 'done' ? (
          <><CheckCircle size={18} /> Done! Redirecting...</>
        ) : (
          <>Analyze Resume <ArrowRight size={18} /></>
        )}
      </button>

      {/* Tips */}
      <div className="card bg-gray-900/30">
        <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Tips for best results</p>
        <ul className="space-y-1.5">
          {[
            'Use a clean, text-based PDF (not a scanned image)',
            'Ensure all sections are clearly labeled (Skills, Experience, Education)',
            'Keep your resume to 1–2 pages for optimal ATS scoring',
            'Include relevant keywords from job descriptions'
          ].map((t, i) => (
            <li key={i} className="text-xs text-gray-500 flex items-start gap-2">
              <span className="text-accent-400 mt-0.5">•</span> {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
