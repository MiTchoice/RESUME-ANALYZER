import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ResumeProvider } from './context/ResumeContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import JobMatch from './pages/JobMatch';
import InterviewPrep from './pages/InterviewPrep';
import MockInterview from './pages/MockInterview';

export default function App() {
  return (
    <ResumeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#f43f5e', secondary: '#fff' } }
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/upload"     element={<ResumeUpload />} />
            <Route path="/job-match"  element={<JobMatch />} />
            <Route path="/interview"  element={<InterviewPrep />} />
            <Route path="/mock"       element={<MockInterview />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ResumeProvider>
  );
}
