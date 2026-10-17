import React from 'react';
import { Bot, LayoutDashboard, PlayCircle, FileText, Award, History, User, LogIn, LogOut, Sparkles, BookOpen } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, profile, onOpenProfile, onOpenAuth, onLogout }) {
  return (
    <header className="glass-card no-print" style={{ borderRadius: '0 0 20px 20px', borderTop: 'none', marginBottom: '1.5rem', background: 'rgba(11, 17, 32, 0.85)', backdropFilter: 'blur(20px)', position: 'relative' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0.85rem 1.5rem 1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        
        {/* Top Row: Logo on Left & User Login / Profile Pill in Top Right Corner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          
          {/* Left: Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6,182,212,0.45)' }}>
              <Bot size={26} color="#070a12" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
                  Prep<span className="text-gradient">AI</span>
                </h1>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', color: 'var(--accent-cyan)' }}>
                  PRO
                </span>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>AI Mock Interview & Placement Portal</p>
            </div>
          </div>

          {/* Top Right Corner: Student Login / Profile Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {profile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div 
                  onClick={onOpenProfile}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.45rem 0.95rem', borderRadius: '30px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-glass-light)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6B6B, #556270)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: '#fff', boxShadow: '0 0 10px rgba(255,107,107,0.4)' }}>
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>{profile.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Sparkles size={10} /> {profile.targetRole}
                    </p>
                  </div>
                  <User size={16} color="var(--text-muted)" />
                </div>
                
                <button 
                  onClick={onLogout} 
                  title="Logout Account"
                  className="btn-secondary" 
                  style={{ padding: '0.55rem', borderRadius: '50%', border: '1px solid rgba(244,63,94,0.35)', color: '#fb7185' }}>
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                <LogIn size={16} /> Student Login / Register
              </button>
            )}
          </div>

        </div>

        {/* Bottom Row: Centered Navigation Tabs slightly lower in the middle */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '0.2rem' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(7, 10, 18, 0.75)', padding: '0.35rem 0.5rem', borderRadius: '16px', border: '1px solid var(--border-glass-light)' }}>
            <button 
              onClick={() => setActiveTab('dashboard')} 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.95rem', borderRadius: '10px', border: 'none', background: activeTab === 'dashboard' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent', color: activeTab === 'dashboard' ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <LayoutDashboard size={16} /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('setup')} 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.95rem', borderRadius: '10px', border: 'none', background: activeTab === 'setup' || activeTab === 'interview' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent', color: activeTab === 'setup' || activeTab === 'interview' ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <PlayCircle size={16} /> Mock Interview
            </button>
            <button 
              onClick={() => setActiveTab('pyq')} 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.95rem', borderRadius: '10px', border: 'none', background: activeTab === 'pyq' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent', color: activeTab === 'pyq' ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <BookOpen size={16} /> PYQ Hub
            </button>
            <button 
              onClick={() => setActiveTab('resume')} 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.95rem', borderRadius: '10px', border: 'none', background: activeTab === 'resume' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent', color: activeTab === 'resume' ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <FileText size={16} /> Resume AI
            </button>
            <button 
              onClick={() => setActiveTab('hrgd')} 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.95rem', borderRadius: '10px', border: 'none', background: activeTab === 'hrgd' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent', color: activeTab === 'hrgd' ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <Award size={16} /> HR & GD
            </button>
            <button 
              onClick={() => setActiveTab('history')} 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.55rem 0.95rem', borderRadius: '10px', border: 'none', background: activeTab === 'history' || activeTab === 'report' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent', color: activeTab === 'history' || activeTab === 'report' ? '#fff' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <History size={16} /> Reports
            </button>
          </nav>
        </div>

      </div>
    </header>
  );
}
