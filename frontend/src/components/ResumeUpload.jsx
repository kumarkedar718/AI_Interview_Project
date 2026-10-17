import React, { useState } from 'react';
import { FileUp, Sparkles, Plus, Trash2, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { uploadResume, parseResumeText } from '../utils/api';

export default function ResumeUpload({ profile, onUpdateSkills, onProceedToSetup }) {
  const [file, setFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState(profile?.savedResumeSkills || ['React.js', 'JavaScript', 'HTML5', 'CSS3', 'Node.js', 'SQL']);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true);
    setSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      const res = await uploadResume(formData);
      if (res.success) {
        setExtractedSkills(res.skills);
        onUpdateSkills(res.skills);
        setSuccessMsg(`Successfully parsed ${selectedFile.name}! Extracted ${res.skills.length} technical skills.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextParse = async () => {
    if (!pastedText.trim()) return;
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await parseResumeText(pastedText);
      if (res.success) {
        setExtractedSkills(res.skills);
        onUpdateSkills(res.skills);
        setSuccessMsg(`AI analyzed your resume text and identified ${res.skills.length} core topics!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!extractedSkills.includes(newSkill.trim())) {
      const updated = [...extractedSkills, newSkill.trim()];
      setExtractedSkills(updated);
      onUpdateSkills(updated);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = extractedSkills.filter(s => s !== skillToRemove);
    setExtractedSkills(updated);
    onUpdateSkills(updated);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(18, 26, 43, 0.9) 0%, rgba(30, 41, 67, 0.8) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} color="var(--accent-cyan)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Resume Scanner & Topic Extractor</h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Upload your PDF resume or paste raw resume text. AI will scan your experience, skills, and projects to generate custom technical interview questions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
        
        {/* Upload File Zone */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileUp size={20} color="var(--accent-cyan)" /> Upload PDF Resume
          </h3>
          
          <label style={{ border: '2px dashed var(--border-glass)', borderRadius: '14px', padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(15, 23, 42, 0.4)', transition: 'all 0.2s ease' }} className="glass-card-interactive">
            <input type="file" accept=".pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
            <FileUp size={36} color="var(--accent-blue)" style={{ margin: '0 auto 0.75rem auto' }} />
            <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Click or Drag PDF file here</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Supports .PDF files (Max 5MB)</p>
          </label>

          {file && (
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Selected: {file.name}</p>
          )}

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Or Paste Resume Text</label>
            <textarea 
              value={pastedText}
              onChange={e => setPastedText(e.target.value)}
              rows={4}
              style={{ width: '100%', resize: 'none' }}
              placeholder="Paste your resume work experience, tech stack, and project descriptions..."
            />
            <button onClick={handleTextParse} className="btn-secondary" style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }} disabled={loading}>
              <Sparkles size={16} /> {loading ? 'Scanning Text...' : 'Parse Text with AI'}
            </button>
          </div>
        </div>

        {/* Extracted Skills & Customization */}
        <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} color="var(--accent-purple)" /> Extracted Skill Topics ({extractedSkills.length})
          </h3>

          {successMsg && (
            <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={16} /> {successMsg}
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
            {extractedSkills.map((skill, idx) => (
              <span key={idx} style={{ padding: '0.4rem 0.75rem', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#fff', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                {skill}
                <Trash2 size={12} color="var(--accent-rose)" style={{ cursor: 'pointer' }} onClick={() => handleRemoveSkill(skill)} />
              </span>
            ))}
          </div>

          {/* Add custom skill */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              placeholder="Add custom skill (e.g. System Design)"
              style={{ flex: 1 }}
              onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
            />
            <button onClick={handleAddSkill} className="btn-secondary" style={{ padding: '0.75rem' }}>
              <Plus size={18} />
            </button>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)' }}>
            <button onClick={onProceedToSetup} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}>
              Proceed to Interview Room <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
