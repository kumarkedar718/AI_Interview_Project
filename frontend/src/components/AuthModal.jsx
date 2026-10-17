import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User, Briefcase, Award, ShieldAlert, Sparkles, Eye, EyeOff } from 'lucide-react';
import { loginUser, registerUser } from '../utils/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate (1-3 years)');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await loginUser(email, password);
        if (res.success) {
          localStorage.setItem('prepai_user', JSON.stringify(res.user));
          onAuthSuccess(res.user);
          onClose();
        } else {
          setErrorMsg(res.error || 'Invalid credentials.');
        }
      } else {
        const res = await registerUser({
          name,
          email,
          password,
          targetRole,
          experienceLevel
        });
        if (res.success) {
          localStorage.setItem('prepai_user', JSON.stringify(res.user));
          onAuthSuccess(res.user);
          onClose();
        } else {
          setErrorMsg(res.error || 'Failed to register account.');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error connecting to backend authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2rem', relative: 'relative' }}>
        
        {/* Header & Close */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Student <span className="text-gradient">Portal Account</span>
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Login or Register to save mock interview reports</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.6)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '1.5rem' }}>
          <button 
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: 'none', background: activeTab === 'login' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent', color: activeTab === 'login' ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <LogIn size={16} /> Student Login
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: 'none', background: activeTab === 'register' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent', color: activeTab === 'register' ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
            <UserPlus size={16} /> New Registration
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.75rem', borderRadius: '10px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#fb7185', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          
          {activeTab === 'register' && (
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <User size={14} color="var(--accent-cyan)" /> Full Name
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Kedar Kumar" 
                style={{ width: '100%' }} 
                required 
              />
            </div>
          )}

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Mail size={14} color="var(--accent-blue)" /> Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="student@example.com" 
              style={{ width: '100%' }} 
              required 
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Lock size={14} color="var(--accent-purple)" /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="••••••••" 
                style={{ width: '100%', paddingRight: '2.5rem' }} 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {activeTab === 'register' && (
            <>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <Briefcase size={14} color="var(--accent-cyan)" /> Target Job Role
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
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  <Award size={14} color="var(--accent-pink)" /> Experience Level
                </label>
                <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} style={{ width: '100%' }}>
                  <option value="Entry Level (Fresher / 0-1 yrs)">Entry Level (Fresher / 0-1 yrs)</option>
                  <option value="Intermediate (1-3 years)">Intermediate (1-3 years)</option>
                  <option value="Senior (3-6+ years)">Senior (3-6+ years)</option>
                </select>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem' }} disabled={loading}>
            <Sparkles size={18} /> {loading ? 'Processing...' : (activeTab === 'login' ? 'Login to Portal' : 'Register Account')}
          </button>
        </form>

      </div>
    </div>
  );
}
