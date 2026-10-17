import React, { useState } from 'react';
import { PlayCircle, Sparkles, Clock, Target, Award, CheckCircle2, ChevronRight, Mic, Volume2 } from 'lucide-react';
import { startInterviewSession } from '../utils/api';

export default function InterviewSetup({ profile, skills = [], onSessionStarted }) {
  const [jobRole, setJobRole] = useState(profile?.targetRole || 'Backend Developer');
  const [roundType, setRoundType] = useState('Technical');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [interviewMode, setInterviewMode] = useState('VOICE'); // 'STANDARD' | 'VOICE'
  const [loading, setLoading] = useState(false);

  const jobRoles = [
    'Backend Developer',
    'Frontend Developer',
    'Full Stack Developer',
    'DevOps & Cloud Engineer',
    'Data Engineer / Scientist',
    'QA & Automation Engineer'
  ];

  const roundTypes = [
    { id: 'Technical', title: 'Technical Deep-Dive', desc: 'Domain mechanics, system architecture, and code practices.' },
    { id: 'HR', title: 'HR & STAR Behavioral', desc: 'Situational leadership, conflict resolution, and soft skills.' },
    { id: 'GD', title: 'Group Discussion Master', desc: 'Analytical reasoning, topic opening, and structured argument.' }
  ];

  const handleStart = async () => {
    setLoading(true);
    try {
      const activeSkills = skills.length > 0 ? skills : [jobRole, 'Core Engineering'];
      const res = await startInterviewSession({
        jobRole,
        roundType,
        durationMinutes,
        skills: activeSkills,
        experienceLevel,
        userEmail: profile?.email || ''
      });

      if (res.success) {
        onSessionStarted({
          sessionId: res.sessionId,
          jobRole,
          roundType,
          durationMinutes,
          skills: activeSkills,
          initialQuestion: res.question,
          interviewMode,
          userEmail: profile?.email || ''
        });
      } else {
        alert(res.error || 'Failed to initialize interview session.');
      }
    } catch (err) {
      console.error(err);
      alert('Error launching interview session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '2.25rem', background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.95) 0%, rgba(22, 33, 58, 0.9) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.35rem 0.85rem', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.35)', color: 'var(--accent-cyan)' }}>
            ⚡ Placement Drive Simulation
          </span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Setup Your Custom <span className="text-gradient">AI Mock Interview</span>
        </h1>
        
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px', lineHeight: 1.5 }}>
          Configure your target job domain, interview mode, and round type. Choose Direct Voice-to-Voice AI mode for hands-free conversational interview practice!
        </p>
      </div>

      {/* Configuration Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Step 1: Target Role & Experience */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target size={20} color="var(--accent-cyan)" /> 1. Job Role & Experience
          </h3>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Target Job Role</label>
            <select value={jobRole} onChange={e => setJobRole(e.target.value)} style={{ width: '100%' }}>
              {jobRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>Experience Tier</label>
            <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} style={{ width: '100%' }}>
              <option value="Entry Level (Fresher)">Entry Level (Fresher / Campus Placement)</option>
              <option value="Intermediate">Intermediate (1 - 3 Years)</option>
              <option value="Senior Lead">Senior / Lead Architect (4+ Years)</option>
            </select>
          </div>
        </div>

        {/* Step 2: Choose Interview Mode */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Mic size={20} color="var(--accent-cyan)" /> 2. Choose AI Interview Mode
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div 
              onClick={() => setInterviewMode('VOICE')}
              style={{
                padding: '1.1rem',
                borderRadius: '14px',
                border: interviewMode === 'VOICE' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-glass-light)',
                background: interviewMode === 'VOICE' ? 'rgba(6,182,212,0.12)' : 'rgba(14,20,36,0.6)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <Volume2 size={18} color="var(--accent-cyan)" />
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>🎙️ Direct Voice-to-Voice AI Mode</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Hands-free conversational AI! AI speaks questions out loud and listens to your spoken answers live.
              </p>
            </div>

            <div 
              onClick={() => setInterviewMode('STANDARD')}
              style={{
                padding: '1.1rem',
                borderRadius: '14px',
                border: interviewMode === 'STANDARD' ? '2px solid var(--accent-purple)' : '1px solid var(--border-glass-light)',
                background: interviewMode === 'STANDARD' ? 'rgba(168,85,247,0.12)' : 'rgba(14,20,36,0.6)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <Sparkles size={18} color="var(--accent-purple)" />
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>💻 Standard Text & Mic Mode</strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Text boxes with optional voice dictation button and detailed visual feedback progress bars.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Round Selection */}
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={20} color="var(--accent-cyan)" /> 3. Select Interview Round Type
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {roundTypes.map(round => (
            <div 
              key={round.id}
              onClick={() => setRoundType(round.id)}
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                border: roundType === round.id ? '2px solid var(--accent-cyan)' : '1px solid var(--border-glass-light)',
                background: roundType === round.id ? 'rgba(6,182,212,0.15)' : 'rgba(14,20,36,0.6)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem', color: roundType === round.id ? 'var(--accent-cyan)' : '#fff' }}>
                {round.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {round.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
        <button 
          onClick={handleStart} 
          disabled={loading}
          className="btn-primary" 
          style={{ width: '100%', maxWidth: '420px', padding: '1rem 2rem', fontSize: '1.05rem', boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}>
          <PlayCircle size={22} /> {loading ? 'Launching Session...' : `Start ${roundType} Interview (${interviewMode === 'VOICE' ? 'Voice Mode' : 'Standard Mode'})`}
        </button>
      </div>

    </div>
  );
}
