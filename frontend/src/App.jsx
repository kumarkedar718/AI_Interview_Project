import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProfileModal from './components/ProfileModal';
import LoginPortal from './components/LoginPortal';
import Dashboard from './components/Dashboard';
import ResumeUpload from './components/ResumeUpload';
import InterviewSetup from './components/InterviewSetup';
import InterviewRoom from './components/InterviewRoom';
import VoiceRoom from './components/VoiceRoom';
import FeedbackReport from './components/FeedbackReport';
import HrGdMaster from './components/HrGdMaster';
import PyqHub from './components/PyqHub';
import { fetchProfile, fetchHistory, startInterviewSession } from './utils/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);

  // Current active interview session configuration
  const [currentSession, setCurrentSession] = useState(null);
  // Current evaluation report
  const [currentReport, setCurrentReport] = useState(null);

  // Load user session from localStorage or database
  useEffect(() => {
    async function initData() {
      const savedUserStr = localStorage.getItem('prepai_user');
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setProfile(parsed);
          await loadUserHistory(parsed.email);
        } catch (e) {}
      }
      setLoadingApp(false);
    }
    initData();
  }, []);

  const loadUserHistory = async (email) => {
    if (!email) {
      setHistory([]);
      return;
    }
    try {
      const histRes = await fetchHistory(email);
      if (histRes.success) {
        setHistory(histRes.history || []);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error('Error loading history data:', err);
      setHistory([]);
    }
  };

  const handleLoginSuccess = async (user) => {
    setProfile(user);
    setHistory([]);
    await loadUserHistory(user.email);
    setActiveTab('dashboard');
  };

  const handleSessionStarted = (sessionData) => {
    setCurrentSession({
      ...sessionData,
      userEmail: profile?.email || ''
    });
    setActiveTab('interview');
  };

  // Launch AI Interview Session from PYQ Hub item
  const handleStartPyqInterview = async (pyqItem) => {
    try {
      const res = await startInterviewSession({
        jobRole: pyqItem.jobRole || profile?.targetRole || 'Software Engineer',
        roundType: pyqItem.category || 'Technical',
        durationMinutes: 10,
        skills: [pyqItem.company || 'PYQ'],
        userEmail: profile?.email || ''
      });

      if (res.success) {
        const pyqQuestionObj = {
          questionId: pyqItem.id,
          question: `[${pyqItem.company} PYQ]: ${pyqItem.question}`,
          skill: pyqItem.company,
          roundType: pyqItem.category || 'Technical',
          idealAnswer: pyqItem.idealAnswer
        };

        setCurrentSession({
          sessionId: res.sessionId,
          jobRole: pyqItem.jobRole || 'Software Engineer',
          roundType: pyqItem.category || 'Technical',
          durationMinutes: 10,
          initialQuestion: pyqQuestionObj,
          interviewMode: 'VOICE', // Enable voice mode for PYQs!
          userEmail: profile?.email || ''
        });
        setActiveTab('interview');
      }
    } catch (e) {
      console.error('Failed to start PYQ interview:', e);
    }
  };

  const handleSessionFinished = (reportData) => {
    setCurrentReport(reportData);
    setCurrentSession(null);
    if (profile?.email) {
      loadUserHistory(profile.email);
    }
    setActiveTab('report');
  };

  const handleViewReport = (historyItem) => {
    setCurrentReport(historyItem.evaluation);
    setActiveTab('report');
  };

  const handleUpdateProfileSkills = (newSkills) => {
    if (profile) {
      const updated = { ...profile, savedResumeSkills: newSkills };
      setProfile(updated);
      localStorage.setItem('prepai_user', JSON.stringify(updated));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('prepai_user');
    setProfile(null);
    setHistory([]);
    setCurrentSession(null);
    setCurrentReport(null);
  };

  if (loadingApp) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#070a12', color: '#fff' }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading PrepAI Platform...</p>
      </div>
    );
  }

  if (!profile) {
    return <LoginPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        profile={profile} 
        onOpenProfile={() => setIsProfileOpen(true)} 
        onOpenAuth={() => {}}
        onLogout={handleLogout}
      />

      <main className="app-container">
        {activeTab === 'dashboard' && (
          <Dashboard 
            history={history}
            profile={profile}
            onStartNew={() => setActiveTab('setup')}
            onViewReport={handleViewReport}
            onGoToResume={() => setActiveTab('resume')}
          />
        )}

        {activeTab === 'pyq' && (
          <PyqHub 
            onStartPyqInterview={handleStartPyqInterview}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeUpload 
            profile={profile}
            onUpdateSkills={handleUpdateProfileSkills}
            onProceedToSetup={() => setActiveTab('setup')}
          />
        )}

        {activeTab === 'setup' && (
          <InterviewSetup 
            profile={profile}
            skills={profile?.savedResumeSkills || []}
            onSessionStarted={handleSessionStarted}
          />
        )}

        {activeTab === 'interview' && currentSession && (
          currentSession.interviewMode === 'VOICE' ? (
            <VoiceRoom 
              sessionConfig={currentSession}
              onSessionFinished={handleSessionFinished}
            />
          ) : (
            <InterviewRoom 
              sessionConfig={currentSession}
              onSessionFinished={handleSessionFinished}
            />
          )
        )}

        {activeTab === 'report' && currentReport && (
          <FeedbackReport 
            report={currentReport}
            onRestart={() => setActiveTab('setup')}
          />
        )}

        {activeTab === 'hrgd' && (
          <HrGdMaster />
        )}

        {activeTab === 'history' && (
          <Dashboard 
            history={history}
            profile={profile}
            onStartNew={() => setActiveTab('setup')}
            onViewReport={handleViewReport}
            onGoToResume={() => setActiveTab('resume')}
          />
        )}
      </main>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        profile={profile} 
        onSave={(updated) => {
          setProfile(updated);
          localStorage.setItem('prepai_user', JSON.stringify(updated));
        }} 
      />
    </div>
  );
}
