import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, Send, Award, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Play, Square } from 'lucide-react';
import { speakText, stopSpeaking, createResilientRecognizer, requestMicPermission } from '../utils/speechUtils';
import { submitInterviewAnswer, endInterviewSession } from '../utils/api';

export default function VoiceRoom({ sessionConfig, onSessionFinished }) {
  const { sessionId, jobRole, roundType, initialQuestion, userEmail } = sessionConfig;

  const [currentQuestion, setCurrentQuestion] = useState(
    initialQuestion || {
      questionId: 'q_v1',
      question: `Welcome to the Voice-to-Voice AI Interview! As a candidate for ${jobRole || 'Software Engineer'}, describe how you design resilient backend systems or handle critical production bugs.`,
      skill: jobRole || 'Core Concepts',
      roundType: roundType || 'Technical'
    }
  );

  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [aiState, setAiState] = useState('SPEAKING'); // 'SPEAKING' | 'LISTENING' | 'THINKING'
  const [micStatusText, setMicStatusText] = useState('AI Interviewer is speaking...');
  const [isMuted, setIsMuted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const recognizerRef = useRef(null);

  // Initialize Speech Recognizer
  useEffect(() => {
    recognizerRef.current = createResilientRecognizer(
      (transcript) => {
        setCandidateAnswer(transcript);
      },
      (isListening, statusMessage) => {
        if (isListening) {
          setAiState('LISTENING');
          setMicStatusText('🎤 Listening to your answer... Speak clearly!');
        } else {
          setMicStatusText('Mic paused.');
        }
      },
      (errorMsg) => {
        console.error('Speech error:', errorMsg);
        setMicStatusText(errorMsg);
      }
    );

    // Speak initial question aloud
    speakCurrentQuestion(currentQuestion.question);

    return () => {
      stopSpeaking();
      if (recognizerRef.current) recognizerRef.current.destroy();
    };
  }, []);

  const speakCurrentQuestion = (questionText) => {
    if (isMuted) {
      startListening();
      return;
    }
    setAiState('SPEAKING');
    setMicStatusText('🗣️ AI Interviewer is speaking question aloud...');
    stopSpeaking();

    speakText(questionText, () => {
      // When AI finishes speaking, automatically start listening!
      startListening();
    });
  };

  const startListening = async () => {
    const perm = await requestMicPermission();
    if (!perm.success) {
      alert('Microphone access is required for Voice-to-Voice mode.');
      return;
    }
    setAiState('LISTENING');
    if (recognizerRef.current) {
      recognizerRef.current.start(candidateAnswer);
    }
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
  };

  const handleSubmitVoiceAnswer = async (skipped = false) => {
    if (!skipped && !candidateAnswer.trim()) {
      alert('Please speak or type your answer before clicking Submit, or click "Skip Question" to skip.');
      return;
    }

    stopSpeaking();
    stopListening();
    setAiState('THINKING');
    setMicStatusText('🧠 AI is evaluating your answer and preparing next question...');
    setSubmitting(true);

    const finalAns = skipped ? '' : candidateAnswer.trim();

    try {
      const res = await submitInterviewAnswer({
        sessionId,
        questionId: currentQuestion.questionId || `q_${Date.now()}`,
        question: currentQuestion.question,
        skill: currentQuestion.skill,
        answer: finalAns,
        candidateAnswer: finalAns,
        isSkipped: skipped
      });

      setQaHistory(prev => [...prev, {
        question: currentQuestion.question,
        skill: currentQuestion.skill,
        candidateAnswer: skipped ? '(Skipped)' : finalAns,
        isSkipped: skipped
      }]);

      const nextQuestionObj = (res.success && res.question) ? res.question : {
        questionId: `q_v_next_${Date.now()}`,
        question: `In a production ${jobRole || 'Engineer'} environment, how do you handle performance profiling, error boundaries, and deployment rollbacks?`,
        skill: jobRole || 'Core Concepts',
        roundType: roundType || 'Technical'
      };

      setCurrentQuestion(nextQuestionObj);
      setCandidateAnswer(''); // Clean textarea for next question!
      if (recognizerRef.current) {
        recognizerRef.current.resetAccumulatedText(); // Reset internal speech text accumulator!
      }
      speakCurrentQuestion(nextQuestionObj.question);

    } catch (err) {
      console.error('Failed to submit voice answer:', err);
      const fallbackQ = {
        questionId: `q_v_next_${Date.now()}`,
        question: `As a ${jobRole || 'Engineer'}, how do you handle high availability, load balancing, and unexpected database outages?`,
        skill: jobRole || 'Core Concepts',
        roundType: roundType || 'Technical'
      };
      setCurrentQuestion(fallbackQ);
      setCandidateAnswer('');
      if (recognizerRef.current) {
        recognizerRef.current.resetAccumulatedText();
      }
      speakCurrentQuestion(fallbackQ.question);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndSession = async () => {
    stopSpeaking();
    stopListening();

    if (candidateAnswer.trim().length > 0) {
      try {
        await submitInterviewAnswer({
          sessionId,
          questionId: currentQuestion.questionId || `q_${Date.now()}`,
          question: currentQuestion.question,
          skill: currentQuestion.skill,
          answer: candidateAnswer.trim(),
          candidateAnswer: candidateAnswer.trim(),
          isSkipped: false
        });
      } catch (e) {}
    }

    try {
      const res = await endInterviewSession(sessionId, userEmail);
      if (res.success) {
        onSessionFinished(res.evaluation || res.report);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Voice Room Header Banner */}
      <div className="glass-card" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(14,20,36,0.95) 0%, rgba(22,33,58,0.9) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '0.3rem 0.75rem', borderRadius: '20px', background: 'rgba(6,182,212,0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(6,182,212,0.3)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} /> Voice-to-Voice AI Live Mode
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.4rem' }}>
            Interactive AI Voice <span className="text-gradient">Interviewer</span>
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button 
            onClick={() => {
              setIsMuted(!isMuted);
              if (!isMuted) stopSpeaking();
            }} 
            className="btn-secondary" 
            style={{ padding: '0.55rem 0.9rem', fontSize: '0.82rem' }}>
            {isMuted ? <VolumeX size={16} color="#fb7185" /> : <Volume2 size={16} color="var(--accent-cyan)" />}
            {isMuted ? 'Unmute AI' : 'Mute AI'}
          </button>

          <button 
            onClick={handleEndSession} 
            className="btn-secondary" 
            style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', borderColor: 'rgba(244,63,94,0.4)', color: '#fb7185' }}>
            <Square size={15} /> End Voice Session & View Score
          </button>
        </div>
      </div>

      {/* AI Voice Sphere & Pulse Wave Animation */}
      <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', background: 'rgba(11, 17, 32, 0.9)', position: 'relative', overflow: 'hidden' }}>
        
        {/* Animated Sphere */}
        <div style={{
          width: '130px',
          height: '130px',
          borderRadius: '50%',
          background: aiState === 'SPEAKING' 
            ? 'radial-gradient(circle, #8b5cf6 0%, #3b82f6 60%, #06b6d4 100%)' 
            : aiState === 'LISTENING' 
            ? 'radial-gradient(circle, #10b981 0%, #06b6d4 100%)' 
            : 'radial-gradient(circle, #f59e0b 0%, #ef4444 100%)',
          boxShadow: aiState === 'SPEAKING'
            ? '0 0 50px rgba(139,92,246,0.7), 0 0 100px rgba(6,182,212,0.4)'
            : aiState === 'LISTENING'
            ? '0 0 50px rgba(16,185,129,0.7), 0 0 100px rgba(6,182,212,0.4)'
            : '0 0 50px rgba(245,158,11,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.4s ease',
          animation: 'pulse 2s infinite ease-in-out'
        }}>
          {aiState === 'SPEAKING' && <Volume2 size={48} color="#fff" />}
          {aiState === 'LISTENING' && <Mic size={48} color="#fff" />}
          {aiState === 'THINKING' && <RefreshCw size={48} color="#fff" className="spin-slow" />}
        </div>

        {/* AI State Badge & Status */}
        <div>
          <span style={{
            padding: '0.4rem 1.1rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: 800,
            background: aiState === 'SPEAKING' ? 'rgba(139,92,246,0.2)' : aiState === 'LISTENING' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
            border: `1px solid ${aiState === 'SPEAKING' ? '#8b5cf6' : aiState === 'LISTENING' ? '#10b981' : '#f59e0b'}`,
            color: aiState === 'SPEAKING' ? '#c084fc' : aiState === 'LISTENING' ? '#34d399' : '#fbbf24'
          }}>
            {aiState === 'SPEAKING' ? '🗣️ AI Interviewer Speaking' : aiState === 'LISTENING' ? '🎤 Listening To Candidate' : '🧠 AI Evaluating Response'}
          </span>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.75rem', fontWeight: 600 }}>
            {micStatusText}
          </p>
        </div>

        {/* Question Text Box */}
        <div style={{ maxWidth: '780px', padding: '1.25rem 1.75rem', borderRadius: '16px', background: 'rgba(15,23,42,0.85)', border: '1px solid var(--border-glass-light)', textAlign: 'left' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Current Question ({qaHistory.length + 1})
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.35rem', lineHeight: 1.4 }}>
            {currentQuestion.question}
          </h3>
        </div>

      </div>

      {/* Candidate Live Voice Transcript Box */}
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mic size={18} color="var(--accent-cyan)" /> Live Spoken Response Transcript
          </label>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {candidateAnswer.split(/\s+/).filter(Boolean).length} Words Spoken
          </span>
        </div>

        <textarea 
          value={candidateAnswer} 
          onChange={e => setCandidateAnswer(e.target.value)} 
          rows={4} 
          placeholder="Speak into your microphone... Spoken words will automatically appear here in real-time." 
          style={{ width: '100%', resize: 'none', fontSize: '1rem', lineHeight: 1.5 }}
        />

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button 
            type="button"
            onClick={aiState === 'LISTENING' ? stopListening : startListening}
            className="btn-secondary" 
            style={{ padding: '0.65rem 1.2rem', fontSize: '0.85rem' }}>
            {aiState === 'LISTENING' ? <MicOff size={16} color="#fb7185" /> : <Mic size={16} color="var(--accent-cyan)" />}
            {aiState === 'LISTENING' ? 'Pause Mic' : 'Start Voice Typing'}
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              type="button" 
              onClick={() => handleSubmitVoiceAnswer(true)} 
              className="btn-secondary"
              disabled={submitting}>
              Skip Question
            </button>

            <button 
              type="button" 
              onClick={() => handleSubmitVoiceAnswer(false)} 
              className="btn-primary"
              disabled={submitting}
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.88rem' }}>
              <Send size={16} /> {submitting ? 'Evaluating...' : 'Submit Spoken Answer'}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
