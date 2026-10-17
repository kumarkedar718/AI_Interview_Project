import React, { useState } from 'react';
import { X, Save, User, Briefcase, Award, Sparkles } from 'lucide-react';
import { updateProfile } from '../utils/api';

export default function ProfileModal({ isOpen, onClose, profile, onSave }) {
  const [name, setName] = useState(profile?.name || 'Kedar Kumar');
  const [email, setEmail] = useState(profile?.email || 'kedar@example.com');
  const [targetRole, setTargetRole] = useState(profile?.targetRole || 'Frontend Developer');
  const [experienceLevel, setExperienceLevel] = useState(profile?.experienceLevel || 'Intermediate (1-3 years)');
  const [skillsInput, setSkillsInput] = useState(profile?.savedResumeSkills ? profile.savedResumeSkills.join(', ') : 'React.js, JavaScript, HTML5, CSS3, Node.js, SQL');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    const updated = {
      name,
      email,
      targetRole,
      experienceLevel,
      savedResumeSkills: skillsArray
    };

    try {
      await updateProfile(updated);
      onSave(updated);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '540px', padding: '2rem', relative: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="var(--accent-cyan)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Candidate Account & Target Profile</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Configure target job role for AI question tailoring</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Candidate Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} required />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} required />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Briefcase size={16} color="var(--accent-cyan)" /> Target Job Role
            </label>
            <select value={targetRole} onChange={e => setTargetRole(e.target.value)} style={{ width: '100%' }}>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Engineer / Scientist">Data Engineer / Scientist</option>
              <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
              <option value="HR / Project Manager">HR / Project Manager</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Award size={16} color="var(--accent-purple)" /> Experience Level
            </label>
            <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} style={{ width: '100%' }}>
              <option value="Entry Level (Fresher / 0-1 yrs)">Entry Level (Fresher / 0-1 yrs)</option>
              <option value="Intermediate (1-3 years)">Intermediate (1-3 years)</option>
              <option value="Senior (3-6+ years)">Senior (3-6+ years)</option>
              <option value="Lead / Principal Architect">Lead / Principal Architect</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Sparkles size={16} color="var(--accent-pink)" /> Saved Tech Stack / Resume Skills (Comma separated)
            </label>
            <textarea value={skillsInput} onChange={e => setSkillsInput(e.target.value)} rows={3} style={{ width: '100%', resize: 'none' }} placeholder="React.js, Node.js, Express, MongoDB, SQL" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
