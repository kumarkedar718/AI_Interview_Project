import React from 'react';
import { PlayCircle, CheckCircle2, ArrowRight, Zap, Target, Award, Sparkles, Clock, FileText, Info, ShieldCheck, Flame } from 'lucide-react';

export default function Dashboard({ history = [], profile, onStartNew, onViewReport, onGoToResume }) {
  const hasHistory = history && history.length > 0;
  const latestReport = hasHistory ? history[0] : null;

  const techScore = latestReport?.technicalScore || 0;
  const commScore = latestReport?.communicationScore || 0;
  const probScore = latestReport?.problemSolvingScore || 0;
  const overallScore = latestReport?.overallScore || 0;

  const currentRole = profile?.targetRole || latestReport?.jobRole || 'Software Engineer';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Hero Banner */}
      <div className="glass-card" style={{ padding: '2.25rem', background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.95) 0%, rgba(22, 33, 58, 0.85) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', borderRadius: '30px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              <Flame size={14} color="#34d399" /> Placement & Career Readiness Portal
            </div>
            
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
              Welcome, <span className="text-gradient">{profile?.name || 'Student Candidate'}</span>!
            </h1>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '620px', lineHeight: 1.5 }}>
              Target Job Role: <strong style={{ color: '#fff', background: 'rgba(255,255,255,0.08)', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>{currentRole}</strong> ({profile?.experienceLevel || 'Intermediate'}). Practice real-time AI mock interviews, test your technical skills, and track performance.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button onClick={onGoToResume} className="btn-secondary">
              <FileText size={18} /> Upload Resume PDF
            </button>
            <button onClick={onStartNew} className="btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <PlayCircle size={20} /> {hasHistory ? 'Start New Interview' : 'Start First Mock Interview'}
            </button>
          </div>
        </div>
      </div>

      {/* Placement Readiness Sprint Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        
        <div style={{ background: 'rgba(14, 20, 36, 0.6)', border: '1px solid var(--border-glass)', padding: '1rem 1.25rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <CheckCircle2 size={24} color="#34d399" />
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Profile Configured</span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role: {currentRole}</p>
          </div>
        </div>

        <div style={{ background: 'rgba(14, 20, 36, 0.6)', border: '1px solid var(--border-glass)', padding: '1rem 1.25rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <CheckCircle2 size={24} color={profile?.savedResumeSkills?.length ? '#34d399' : 'var(--text-subtle)'} />
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Tech Stack Parsed</span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{profile?.savedResumeSkills?.length || 0} skills active</p>
          </div>
        </div>

        <div style={{ background: 'rgba(14, 20, 36, 0.6)', border: '1px solid var(--border-glass)', padding: '1rem 1.25rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Award size={24} color={hasHistory ? 'var(--accent-cyan)' : 'var(--text-subtle)'} />
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Placement Readiness</span>
            <p style={{ fontSize: '0.75rem', color: hasHistory ? 'var(--accent-cyan)' : 'var(--text-subtle)' }}>
              {hasHistory ? `${overallScore}% Score` : 'Test pending'}
            </p>
          </div>
        </div>

      </div>

      {/* Main Candidate Performance Section */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        
        {!hasHistory ? (
          /* CLEAN EMPTY STATE BEFORE FIRST INTERVIEW */
          <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', background: 'rgba(14, 20, 36, 0.5)', borderRadius: '16px', border: '1px dashed var(--border-glass-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
              <Target size={32} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.35rem' }}>No Mock Interview Session Completed Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '540px', lineHeight: 1.5, margin: '0 auto' }}>
                Launch your first AI Mock Interview for <strong>{currentRole}</strong>. Once completed, your real technical score, communication rating, and problem solving score will appear here!
              </p>
            </div>
            <button onClick={onStartNew} className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              <PlayCircle size={20} /> Launch First Mock Interview
            </button>
          </div>
        ) : (
          /* SCORES GRID TAILORED TO CANDIDATE'S COMPLETED INTERVIEW */
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={22} color="var(--accent-cyan)" /> Candidate Skill Scorecard
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Evaluation Report for <strong>{currentRole}</strong> candidate
                </p>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                Last Evaluated: {new Date(latestReport.date).toLocaleDateString()}
              </span>
            </div>

            {/* Scorecards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              
              {/* Technical Score */}
              <div style={{ background: 'rgba(14, 20, 36, 0.6)', border: '1px solid var(--border-glass)', padding: '1.25rem', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Technical Accuracy</span>
                  <Award size={18} color="var(--accent-cyan)" />
                </div>
                <div style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{techScore}%</div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ width: `${techScore}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Communication Score */}
              <div style={{ background: 'rgba(14, 20, 36, 0.6)', border: '1px solid var(--border-glass)', padding: '1.25rem', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Communication</span>
                  <Sparkles size={18} color="var(--accent-purple)" />
                </div>
                <div style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--accent-purple)' }}>{commScore}%</div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ width: `${commScore}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Problem Solving Score */}
              <div style={{ background: 'rgba(14, 20, 36, 0.6)', border: '1px solid var(--border-glass)', padding: '1.25rem', borderRadius: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Problem Solving</span>
                  <Zap size={18} color="var(--accent-amber)" />
                </div>
                <div style={{ fontSize: '2.3rem', fontWeight: 800, color: 'var(--accent-amber)' }}>{probScore}%</div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginTop: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ width: `${probScore}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Overall Placement Readiness Rating */}
              <div style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '1.25rem', borderRadius: '14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Placement Readiness</span>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, className: 'text-gradient' }}>{overallScore}%</div>
                <span style={{ fontSize: '0.75rem', color: overallScore >= 75 ? 'var(--accent-emerald)' : '#fbbf24', fontWeight: 700 }}>
                  {overallScore >= 75 ? `Qualified for ${currentRole}` : 'Needs Practice'}
                </span>
              </div>

            </div>
          </>
        )}

      </div>

      {/* Evaluated Mock Session History Table */}
      {hasHistory && (
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color="var(--accent-purple)" /> Evaluated Mock Interview Sessions ({history.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onViewReport(item)}
                className="glass-card-interactive"
                style={{ background: 'rgba(14, 20, 36, 0.5)', padding: '1.1rem 1.35rem', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', cursor: 'pointer' }}>
                
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.jobRole} ({item.roundType} Round)</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(item.date).toLocaleString()}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall Score</span>
                    <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{item.overallScore}%</p>
                  </div>
                  <ArrowRight size={18} color="var(--accent-cyan)" />
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footnote */}
      <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-subtle)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
        <ShieldCheck size={16} color="var(--accent-emerald)" /> Built for Student Career & Placement Preparation • PrepAI Pro
      </div>

    </div>
  );
}
