import React, { useState, useEffect } from 'react';
import { Award, Users, Code, Lightbulb, CheckCircle2, ChevronRight, Sparkles, BookOpen } from 'lucide-react';
import { fetchHrQuestions, fetchGdTopics, fetchTechnicalQuestions } from '../utils/api';

export default function HrGdMaster() {
  const [activeTab, setActiveTab] = useState('technical');
  const [hrQuestions, setHrQuestions] = useState([]);
  const [gdTopics, setGdTopics] = useState([]);
  const [techQuestions, setTechQuestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const hrRes = await fetchHrQuestions();
        const gdRes = await fetchGdTopics();
        const techRes = await fetchTechnicalQuestions();

        if (hrRes.success) setHrQuestions(hrRes.questions);
        if (gdRes.success) setGdTopics(gdRes.topics);
        if (techRes.success) {
          setTechQuestions(techRes.questions);
          if (techRes.questions?.length) setSelectedItem(techRes.questions[0]);
        } else if (hrRes.questions?.length) {
          setSelectedItem(hrRes.questions[0]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(18, 26, 43, 0.9) 0%, rgba(30, 41, 67, 0.8) 100%)' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Award size={26} color="var(--accent-cyan)" /> Technical, HR & GD Preparation Master Hub
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Master 50+ Technical Round Questions (React, JS, Node, Express, SQL, MongoDB, System Architecture), 50 HR Behavioral Questions with STAR solutions, and 50 Group Discussion (GD) topics.
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => { setActiveTab('technical'); setSelectedItem(techQuestions[0]); }} 
            className="btn-primary" 
            style={{ background: activeTab === 'technical' ? 'linear-gradient(135deg, #00f2fe, #4facfe)' : 'rgba(255,255,255,0.05)', color: activeTab === 'technical' ? '#090d16' : 'var(--text-muted)', fontWeight: 800 }}>
            <Code size={18} /> 💻 Technical Round Master (50 Q&A)
          </button>
          <button 
            onClick={() => { setActiveTab('hr'); setSelectedItem(hrQuestions[0]); }} 
            className="btn-primary" 
            style={{ background: activeTab === 'hr' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)', color: activeTab === 'hr' ? '#fff' : 'var(--text-muted)', fontWeight: 800 }}>
            <Award size={18} /> 🏆 HR Behavioral (50 STAR Solutions)
          </button>
          <button 
            onClick={() => { setActiveTab('gd'); setSelectedItem(gdTopics[0]); }} 
            className="btn-primary" 
            style={{ background: activeTab === 'gd' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)', color: activeTab === 'gd' ? '#fff' : 'var(--text-muted)', fontWeight: 800 }}>
            <Users size={18} /> 👥 Group Discussion (50 GD Topics)
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Left Side: Topic List */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '650px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{activeTab === 'technical' ? 'Technical Round Questions' : activeTab === 'hr' ? 'HR Behavioral Questions' : 'Popular GD Topics'}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              {activeTab === 'technical' ? `${techQuestions.length} Questions` : activeTab === 'hr' ? `${hrQuestions.length} Questions` : `${gdTopics.length} Topics`}
            </span>
          </h3>

          {activeTab === 'technical' && (
            techQuestions.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="glass-card-interactive"
                style={{ padding: '1rem', borderRadius: '10px', cursor: 'pointer', border: selectedItem?.id === item.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)', background: selectedItem?.id === item.id ? 'rgba(0,242,254,0.1)' : 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{item.category || item.skill}</span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>{item.question}</p>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            ))
          )}

          {activeTab === 'hr' && (
            hrQuestions.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="glass-card-interactive"
                style={{ padding: '1rem', borderRadius: '10px', cursor: 'pointer', border: selectedItem?.id === item.id ? '1px solid var(--accent-purple)' : '1px solid var(--border-glass)', background: selectedItem?.id === item.id ? 'rgba(139,92,246,0.1)' : 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600 }}>{item.category}</span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>{item.question}</p>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            ))
          )}

          {activeTab === 'gd' && (
            gdTopics.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="glass-card-interactive"
                style={{ padding: '1rem', borderRadius: '10px', cursor: 'pointer', border: selectedItem?.id === item.id ? '1px solid var(--accent-emerald)' : '1px solid var(--border-glass)', background: selectedItem?.id === item.id ? 'rgba(16,185,129,0.1)' : 'rgba(15,23,42,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>{item.category}</span>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem' }}>{item.topic}</p>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            ))
          )}
        </div>

        {/* Right Side: Detailed Guide & Model Answer */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* TECHNICAL TAB VIEW */}
          {selectedItem && activeTab === 'technical' && (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '20px', background: 'rgba(0,242,254,0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,242,254,0.3)', fontSize: '0.8rem', fontWeight: 700, width: 'fit-content' }}>
                <Code size={14} /> {selectedItem.category || selectedItem.skill}
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, lineHeight: 1.4 }}>{selectedItem.question}</h3>

              {/* Key Concepts Pills */}
              {selectedItem.keyConcepts && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedItem.keyConcepts.map((kc, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.65rem', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-glass)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      🔑 {kc}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)', marginTop: '0.5rem' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} /> Ideal Technical Model Answer (2-3 Sentences)
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>{selectedItem.idealAnswer}</p>
              </div>
            </>
          )}

          {/* HR TAB VIEW */}
          {selectedItem && activeTab === 'hr' && (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '20px', background: 'rgba(139,92,246,0.15)', color: '#c084fc', border: '1px solid rgba(139,92,246,0.3)', fontSize: '0.8rem', fontWeight: 700, width: 'fit-content' }}>
                {selectedItem.category}
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{selectedItem.question}</h3>

              <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid var(--border-glass)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Lightbulb size={18} /> STAR Method Strategy
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{selectedItem.starTips}</p>
              </div>

              <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} /> Sample Ideal High-Scoring Answer
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{selectedItem.idealAnswer}</p>
              </div>
            </>
          )}

          {/* GD TAB VIEW */}
          {selectedItem && activeTab === 'gd' && (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.75rem', borderRadius: '20px', background: 'rgba(16,185,129,0.15)', color: 'var(--accent-emerald)', border: '1px solid rgba(16,185,129,0.3)', fontSize: '0.8rem', fontWeight: 700, width: 'fit-content' }}>
                {selectedItem.category}
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Topic: "{selectedItem.topic}"</h3>

              {/* Arguments FOR */}
              <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399', marginBottom: '0.5rem' }}>✅ Arguments FOR / In Favor:</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedItem.forPoints?.map((pt, i) => (
                    <li key={i} style={{ marginBottom: '0.3rem' }}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Arguments AGAINST */}
              <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fb7185', marginBottom: '0.5rem' }}>⚠️ Arguments AGAINST / Challenges:</h4>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {selectedItem.againstPoints?.map((pt, i) => (
                    <li key={i} style={{ marginBottom: '0.3rem' }}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Opening & Conclusion Strategy */}
              <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', fontSize: '0.85rem' }}>
                <p style={{ color: 'var(--accent-cyan)', marginBottom: '0.3rem' }}><strong>Opening Strategy:</strong> {selectedItem.openingStrategy}</p>
                <p style={{ color: 'var(--accent-purple)' }}><strong>Conclusion Strategy:</strong> {selectedItem.conclusionStrategy}</p>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
