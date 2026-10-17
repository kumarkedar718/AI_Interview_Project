import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Building2, Sparkles, CheckCircle2, PlayCircle, HelpCircle, Send, Award, Search, Filter, Image, FileUp, FileText, Upload } from 'lucide-react';
import { fetchPyqs, addCustomPyq, uploadPyqFile } from '../utils/api';

export default function PyqHub({ onStartPyqInterview }) {
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [revealedAnswerId, setRevealedAnswerId] = useState(null);

  // New PYQ Form state
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('Backend Developer');
  const [newYear, setNewYear] = useState('2025');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [imageBase64, setImageBase64] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPyqs();
  }, []);

  const loadPyqs = async () => {
    setLoading(true);
    try {
      const res = await fetchPyqs();
      if (res.success) {
        setPyqs(res.pyqs || []);
      }
    } catch (e) {
      console.error('Failed to load PYQs', e);
    } finally {
      setLoading(false);
    }
  };

  // Handle Photo Image / PDF File Selection
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setUploadingFile(true);

    try {
      // If image photo file
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64(reader.result);
          // Set question placeholder from photo title
          if (!newQuestion.trim()) {
            setNewQuestion(`[Question Photo Uploaded: ${file.name}] - Verify extracted question text or edit as needed.`);
          }
          setUploadingFile(false);
        };
        reader.readAsDataURL(file);
      } else {
        // PDF or Text document file upload
        const formData = new FormData();
        formData.append('file', file);
        const res = await uploadPyqFile(formData);
        if (res.success && res.extractedText) {
          setNewQuestion(res.extractedText.substring(0, 1000));
        }
        setUploadingFile(false);
      }
    } catch (err) {
      console.error('File read error:', err);
      setUploadingFile(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newCompany.trim() || !newQuestion.trim()) {
      alert('Please fill in Company Name and Question text.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await addCustomPyq({
        company: newCompany,
        jobRole: newRole,
        year: newYear,
        question: newQuestion,
        idealAnswer: newAnswer,
        category: 'Technical',
        imageBase64
      });

      if (res.success) {
        alert('🎉 Previous Year Question added successfully!');
        setNewCompany('');
        setNewQuestion('');
        setNewAnswer('');
        setImageBase64(null);
        setSelectedFileName('');
        setShowAddModal(false);
        loadPyqs();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Companies filter options
  const companies = ['ALL', 'TCS (Tata Consultancy Services)', 'Infosys', 'Amazon', 'Google', 'Wipro'];

  const filteredPyqs = pyqs.filter(item => {
    const matchesCompany = selectedCompany === 'ALL' || item.company.toLowerCase().includes(selectedCompany.toLowerCase());
    const matchesSearch = !searchTerm.trim() || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jobRole.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCompany && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Banner Card */}
      <div className="glass-card" style={{ padding: '2.25rem', background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.95) 0%, rgba(22, 33, 58, 0.9) 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', borderRadius: '30px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.35)', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              <BookOpen size={16} /> Previous Years Questions (PYQ) Master Vault
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Company Previous Years <span className="text-gradient">Interview Questions & AI Practice</span>
            </h1>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '640px', lineHeight: 1.5 }}>
              Browse real previous years interview questions from top IT companies (TCS, Infosys, Amazon, Google, Wipro). Upload your campus placement PYQ Photo / PDF or type questions to practice with AI!
            </p>
          </div>

          <button onClick={() => setShowAddModal(!showAddModal)} className="btn-primary" style={{ padding: '0.85rem 1.5rem' }}>
            <Plus size={18} /> Upload Photo / PDF PYQ Question
          </button>
        </div>
      </div>

      {/* Student Custom PYQ Photo & PDF Submission Modal */}
      {showAddModal && (
        <div className="glass-card" style={{ padding: '1.75rem', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--accent-cyan)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={20} color="var(--accent-cyan)" /> Submit Placement PYQ (Photo / PDF / Text)
          </h3>

          <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            {/* PHOTO / PDF FILE UPLOAD DROPZONE */}
            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'rgba(14,20,36,0.8)', border: '2px dashed var(--border-glass-light)', textAlign: 'center' }}>
              <input 
                type="file" 
                id="pyq-file-input" 
                accept="image/*,application/pdf"
                onChange={handleFileChange} 
                style={{ display: 'none' }}
              />
              <label htmlFor="pyq-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Upload size={32} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                  {selectedFileName ? `File Attached: ${selectedFileName}` : 'Click to Upload Question Photo (JPG/PNG) or PDF Document'}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Supports camera photos, screenshots, and PDF question papers
                </span>
              </label>

              {uploadingFile && (
                <p style={{ fontSize: '0.8rem', color: 'var(--accent-amber)', marginTop: '0.5rem' }}>Processing file & extracting question text...</p>
              )}

              {/* Live Photo Image Preview */}
              {imageBase64 && (
                <div style={{ marginTop: '0.75rem' }}>
                  <img src={imageBase64} alt="PYQ Preview" style={{ maxHeight: '140px', borderRadius: '8px', border: '1px solid var(--accent-cyan)' }} />
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Company Name *</label>
                <input 
                  type="text" 
                  value={newCompany} 
                  onChange={e => setNewCompany(e.target.value)} 
                  placeholder="e.g. TCS, Infosys, Amazon, Accenture" 
                  required 
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Job Role *</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value)} style={{ width: '100%' }}>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                  <option value="Data Engineer / Scientist">Data Engineer / Scientist</option>
                  <option value="HR / Behavioral">HR / Behavioral</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Drive Year</label>
                <input 
                  type="text" 
                  value={newYear} 
                  onChange={e => setNewYear(e.target.value)} 
                  placeholder="2025" 
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Interview Question Text *</label>
              <textarea 
                value={newQuestion} 
                onChange={e => setNewQuestion(e.target.value)} 
                rows={3} 
                placeholder="Type or edit the exact interview question asked..." 
                required 
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Model / Ideal Answer (Optional)</label>
              <textarea 
                value={newAnswer} 
                onChange={e => setNewAnswer(e.target.value)} 
                rows={3} 
                placeholder="Provide model answer or key concepts..." 
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                <Send size={16} /> {submitting ? 'Saving PYQ...' : 'Save PYQ to Database'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Company Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {companies.map(comp => (
            <button 
              key={comp}
              onClick={() => setSelectedCompany(comp)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '20px',
                border: selectedCompany === comp ? '1px solid var(--accent-cyan)' : '1px solid var(--border-glass)',
                background: selectedCompany === comp ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)',
                color: selectedCompany === comp ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}>
              {comp === 'ALL' ? '🏢 All Companies' : comp}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(14,20,36,0.8)', padding: '0.4rem 0.85rem', borderRadius: '10px', border: '1px solid var(--border-glass-light)' }}>
          <Search size={16} color="var(--text-muted)" />
          <input 
            type="text" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            placeholder="Search PYQ by keywords..." 
            style={{ border: 'none', background: 'transparent', padding: '0.2rem', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>

      </div>

      {/* PYQ Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading PYQ Master Vault...
          </div>
        ) : filteredPyqs.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <Building2 size={40} color="var(--text-subtle)" style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No PYQs Found for Selection</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              Upload your question photo or PDF using the "+ Upload Photo / PDF PYQ Question" button!
            </p>
          </div>
        ) : (
          filteredPyqs.map((item) => (
            <div key={item.id} className="glass-card" style={{ padding: '1.6rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '20px', background: 'rgba(6,182,212,0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(6,182,212,0.3)' }}>
                    🏢 {item.company}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    Role: <strong style={{ color: '#fff' }}>{item.jobRole}</strong> ({item.year})
                  </span>
                </div>

                <button 
                  onClick={() => onStartPyqInterview(item)}
                  className="btn-primary" 
                  style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem' }}>
                  <PlayCircle size={16} /> Practice PYQ with AI Interviewer
                </button>
              </div>

              {/* If PYQ has attached Photo Image */}
              {item.imageBase64 && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <img src={item.imageBase64} alt="PYQ Photo" style={{ maxHeight: '180px', borderRadius: '10px', border: '1px solid var(--border-glass-light)' }} />
                </div>
              )}

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.4 }}>
                {item.question}
              </h3>

              {/* Reveal Ideal Answer Action */}
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  onClick={() => setRevealedAnswerId(revealedAnswerId === item.id ? null : item.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-amber)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <HelpCircle size={15} /> {revealedAnswerId === item.id ? 'Hide Model Answer' : 'Show Ideal Model Answer & Solution'}
                </button>

                {revealedAnswerId === item.id && (
                  <div style={{ padding: '0.9rem', borderRadius: '10px', background: 'rgba(15,23,42,0.9)', borderLeft: '3px solid var(--accent-amber)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <strong style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>Ideal Solution / Concepts:</strong>
                    {item.idealAnswer}
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
