import React from 'react';
import { Award, CheckCircle2, AlertTriangle, Printer, RotateCcw, Sparkles, BookOpen, Target, ArrowRight, Percent } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function FeedbackReport({ report, onRestart }) {
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  }, []);

  if (!report) return null;

  const { 
    overallScore = 0, 
    technicalScore = 0, 
    communicationScore = 0, 
    problemSolvingScore = 0, 
    strongSkills = [], 
    needsImprovement = [], 
    questionReviews = [], 
    personalizedPrepPlan = [] 
  } = report;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Banner Card */}
      <div className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.95) 0%, rgba(22, 33, 58, 0.9) 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', borderRadius: '30px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#34d399', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1rem' }}>
          <Sparkles size={16} /> Individual Student Performance Scorecard
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Candidate <span className="text-gradient">Accuracy & Gap Evaluation</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto 1.75rem auto' }}>
          Exact correctness percentage vs technical concept gap calculated strictly from your interview session responses.
        </p>

        {/* Big Overall Score Circle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div className="score-circle">
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>Overall</span>
            <span style={{ fontSize: '2.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{overallScore}%</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={handlePrint} className="btn-secondary">
            <Printer size={18} /> Print / Save PDF Report
          </button>
          <button onClick={onRestart} className="btn-primary">
            <RotateCcw size={18} /> Take Another Mock Session
          </button>
        </div>
      </div>

      {/* 4 Score Badges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        
        {/* Technical Score */}
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Technical Accuracy</span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-cyan)', margin: '0.3rem 0' }}>{technicalScore}%</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Domain accuracy & core mechanics</p>
        </div>

        {/* Communication */}
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Communication</span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-purple)', margin: '0.3rem 0' }}>{communicationScore}%</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Clarity, structure & confidence</p>
        </div>

        {/* Problem Solving */}
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Problem Solving</span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-amber)', margin: '0.3rem 0' }}>{problemSolvingScore}%</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Edge case mitigation & logic</p>
        </div>

        {/* Overall Rating */}
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Placement Readiness</span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: overallScore >= 75 ? '#34d399' : '#fbbf24', margin: '0.3rem 0' }}>
            {overallScore >= 75 ? 'Qualified' : 'In Practice'}
          </div>
          <p style={{ fontSize: '0.75rem', color: overallScore >= 75 ? '#34d399' : '#fbbf24' }}>
            {overallScore >= 75 ? 'Ready for domain technical round' : 'Review improvement areas'}
          </p>
        </div>

      </div>

      {/* Detailed Question-by-Question Accuracy & Gap Percentage Breakdown */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Percent size={22} color="var(--accent-cyan)" /> Question Accuracy & Gap Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questionReviews.map((item, idx) => {
            const corr = item.correctnessPercentage !== undefined ? item.correctnessPercentage : item.score;
            const gap = item.gapPercentage !== undefined ? item.gapPercentage : (100 - corr);

            return (
              <div key={idx} style={{ padding: '1.5rem', borderRadius: '14px', background: 'rgba(14, 20, 36, 0.6)', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 800, color: 'var(--accent-cyan)', fontSize: '0.95rem' }}>
                    Question #{item.questionNumber} • {item.skill}
                  </span>
                  
                  {/* Accuracy Badges */}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '20px', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                      ✓ Correctness: {corr}%
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '20px', background: 'rgba(244,63,94,0.15)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.3)' }}>
                      ▲ Technical Gap: {gap}%
                    </span>
                  </div>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.question}</h4>

                {/* Progress Bar Visualizing Accuracy vs Gap */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <span style={{ color: '#34d399' }}>Answer Accuracy: {corr}%</span>
                    <span style={{ color: '#fb7185' }}>Concept Gap: {gap}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', borderRadius: '4px', background: 'rgba(244,63,94,0.3)', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${corr}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                    <div style={{ width: `${gap}%`, height: '100%', background: 'linear-gradient(90deg, #f43f5e, #fb7185)' }} />
                  </div>
                </div>

                <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid var(--accent-blue)', fontSize: '0.85rem' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Your Candidate Response:</strong>
                  <p style={{ marginTop: '0.25rem' }}>{item.candidateAnswer}</p>
                </div>

                <div style={{ padding: '0.85rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', borderLeft: '3px solid var(--accent-emerald)', fontSize: '0.85rem' }}>
                  <strong style={{ color: '#34d399' }}>Ideal Model Answer:</strong>
                  <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>{item.idealAnswer}</p>
                </div>

                <p style={{ fontSize: '0.8rem', color: '#c084fc', fontStyle: 'italic' }}>
                  💡 <strong>AI Feedback:</strong> {item.feedback}
                </p>

              </div>
            );
          })}
        </div>

      </div>

      {/* Individual Tested Skill Matrix: Strong vs Needs Improvement */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target size={22} color="var(--accent-cyan)" /> Tested Domain Skill Competency Matrix
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Verified Strong Skills */}
          <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.5rem', borderRadius: '14px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#34d399', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} /> Verified Strong Skills ({strongSkills.length})
            </h4>
            {strongSkills.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>No strong skills identified in this session. Provide detailed answers in your next test!</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {strongSkills.map((sk, i) => (
                  <span key={i} className="badge-strong">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Needs Improvement */}
          <div style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '1.5rem', borderRadius: '14px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fb7185', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={20} /> Focus Improvement Areas ({needsImprovement.length})
            </h4>
            {needsImprovement.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#34d399' }}>Excellent! All tested skills in this session scored above 75%.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {needsImprovement.map((sk, i) => (
                  <span key={i} className="badge-improvement">
                    ▲ {sk}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
