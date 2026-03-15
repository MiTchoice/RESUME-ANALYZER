import React, { createContext, useContext, useState, useCallback } from 'react';

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [resumeData, setResumeData]       = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobMatchResult, setJobMatchResult] = useState(null);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [mockFeedback, setMockFeedback]   = useState(null);
  const [loading, setLoading]             = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const reset = useCallback(() => {
    setResumeData(null);
    setAnalysisResult(null);
    setJobDescription('');
    setJobMatchResult(null);
    setInterviewQuestions([]);
    setMockFeedback(null);
    setUploadedFileName('');
  }, []);

  return (
    <ResumeContext.Provider value={{
      resumeData, setResumeData,
      analysisResult, setAnalysisResult,
      jobDescription, setJobDescription,
      jobMatchResult, setJobMatchResult,
      interviewQuestions, setInterviewQuestions,
      mockFeedback, setMockFeedback,
      loading, setLoading,
      uploadedFileName, setUploadedFileName,
      reset
    }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
}
