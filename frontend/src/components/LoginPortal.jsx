import React, { useState } from 'react';
import { Bot, LogIn, UserPlus, Mail, Lock, User, Briefcase, Award, ShieldAlert, Sparkles, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import { loginUser, registerUser } from '../utils/api';

export default function LoginPortal({ onLoginSuccess }) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await loginUser(email, password);
        if (res.success) {
          localStorage.setItem('prepai_user', JSON.stringify(res.user));
          onLoginSuccess(res.user);
        } else {
          setErrorMsg(res.error || 'Invalid email or password.');
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
          onLoginSuccess(res.user);
        } else {
          setErrorMsg(res.error || 'Failed to register account.');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Unable to connect to backend server. Please verify the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('kedar@example.com');
    setPassword('123456');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem', background: 'radial-gradient(circle at 50% 30%, rgba(15, 23, 42, 0.95) 0%, rgba(6, 9, 19, 1) 100%)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Glowing Ambient Light Blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '20%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '20%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />

      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.12)', zIndex: 1 }}>
        
        {/* Brand Logo & Trust Tag */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #00f2fe 0%, #38bdf8 50%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', boxShadow: '0 0 30px rgba(0,242,254,0.45)' }}>
            <Bot size={34} color="#060913" />
          </div>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.75rem', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.35)', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Cpu size={14} /> Enterprise Student Career Platform
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Prep<span className="text-gradient">AI</span> <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.2)', border: '1px solid rgba(168, 85, 247, 0.4)', verticalAlign: 'middle', fontFamily: 'var(--font-main)' }}>PRO</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Sign in to access your AI mock interviews & scorecards
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(11, 17, 32, 0.8)', padding: '0.35rem', borderRadius: '14px', border: '1px solid var(--border-glass-light)', marginBottom: '1.75rem' }}>
          <button 
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', border: 'none', background: activeTab === 'login' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent', color: activeTab === 'login' ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s ease' }}>
            <LogIn size={16} /> Student Login
          </button>
          <button 
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            style={{ flex: 1, padding: '0.7rem', borderRadius: '10px', border: 'none', background: activeTab === 'register' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent', color: activeTab === 'register' ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', transition: 'all 0.2s ease' }}>
            <UserPlus size={16} /> Registration
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: '0.85rem', borderRadius: '10px', background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.35)', color: '#fb7185', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} /> {errorMsg}
          </div>
        )}

        {/* Native Form with autoComplete enabled for browser auto-fill suggestions */}
        <form onSubmit={handleSubmit} method="POST" autoComplete="on" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {activeTab === 'register' && (
            <div>
              <label htmlFor="reg-name" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <User size={14} color="var(--accent-cyan)" /> Candidate Full Name
              </label>
              <input 
                id="reg-name"
                name="name"
                type="text" 
                autoComplete="name"
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Kedar Kumar" 
                style={{ width: '100%' }} 
                required 
              />
            </div>
          )}

          <div>
            <label htmlFor="user-email" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Mail size={14} color="var(--accent-blue)" /> Student Email ID
            </label>
            <input 
              id="user-email"
              name="username"
              type="email" 
              autoComplete="username email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="kedar@example.com" 
              style={{ width: '100%' }} 
              required 
            />
          </div>

          <div>
            <label htmlFor="user-password" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              <Lock size={14} color="var(--accent-purple)" /> Password
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                id="user-password"
                name="password"
                type={showPassword ? 'text' : 'password'} 
                autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.2rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Remember login on this browser
            </label>

            {activeTab === 'login' && (
              <button type="button" onClick={handleQuickDemoFill} style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 700 }}>
                Fill Demo Credentials
              </button>
            )}
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.95rem', fontSize: '1.02rem', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : (activeTab === 'login' ? 'Login & Unlock Platform' : 'Create Account & Start')} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          <ShieldCheck size={14} color="var(--accent-emerald)" /> Encrypted Student Data & Persistent Account Storage
        </div>

      </div>
    </div>
  );
}
