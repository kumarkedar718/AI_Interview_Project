// Universal Speech Recognition Engine with Direct WebSpeech Audio Channel

export function speakText(text, onEndCallback) {
  if (!('speechSynthesis' in window)) {
    if (onEndCallback) onEndCallback();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = 'en-US';

  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('India')) && v.lang.startsWith('en'));
  if (naturalVoice) utterance.voice = naturalVoice;

  utterance.onend = () => { if (onEndCallback) onEndCallback(); };
  utterance.onerror = () => { if (onEndCallback) onEndCallback(); };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export async function requestMicPermission() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return { success: true, stream };
    } catch (err) {
      return { success: false, error: err.name || 'Permission Denied' };
    }
  }
  return { success: true };
}

class WindowsResilientRecognizer {
  constructor(onTranscript, onStateChange, onError) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.isSupported = false;
      return;
    }

    this.SpeechRecognitionClass = SpeechRecognition;
    this.isSupported = true;
    this.onTranscript = onTranscript;
    this.onStateChange = onStateChange;
    this.onError = onError;

    this.shouldBeRunning = false;
    this.accumulatedText = '';
    this.restartTimeout = null;

    this.initRecognitionInstance();

    this.handleVisibilityChange = () => {
      if (!document.hidden && this.shouldBeRunning) {
        this.safeStart();
      }
    };

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  initRecognitionInstance() {
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch (e) {}
    }

    this.recognition = new this.SpeechRecognitionClass();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onstart = () => {
      if (this.onStateChange) this.onStateChange(true, '🎤 Mic Active & Hearing Speech... Speak clearly into your mic!');
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let currentFinal = this.accumulatedText;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentFinal += transcript + ' ';
          this.accumulatedText = currentFinal;
        } else {
          interim += transcript;
        }
      }

      const combined = (currentFinal + interim).trim();
      if (this.onTranscript) {
        this.onTranscript(combined);
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('Speech error code:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        this.shouldBeRunning = false;
        if (this.onError) this.onError('⚠️ Microphone permission blocked in browser. Click the lock/cam icon near address bar and allow Microphone.');
      } else if (event.error === 'no-speech') {
        if (this.onStateChange) this.onStateChange(true, '🎤 Listening... Speak into your mic.');
      } else if (event.error === 'network') {
        if (this.shouldBeRunning) {
          setTimeout(() => this.safeStart(), 250);
        }
      }
    };

    this.recognition.onend = () => {
      if (document.hidden) {
        this.shouldBeRunning = false;
        if (this.onStateChange) this.onStateChange(false, 'Tab hidden. Mic paused.');
        return;
      }

      if (this.shouldBeRunning) {
        this.restartTimeout = setTimeout(() => {
          if (this.shouldBeRunning && !document.hidden) {
            this.safeStart();
          }
        }, 120);
      } else {
        if (this.onStateChange) this.onStateChange(false, 'Mic paused.');
      }
    };
  }

  safeStart() {
    try {
      this.recognition.start();
    } catch (e) {
      this.initRecognitionInstance();
      try {
        this.recognition.start();
      } catch (err) {
        console.error('SafeStart recognition error:', err);
      }
    }
  }

  start(initialText = '') {
    if (!this.isSupported) {
      alert('Voice recognition requires Chrome, Edge, or Brave browser.');
      return;
    }

    this.accumulatedText = initialText ? initialText.trim() + ' ' : '';
    this.shouldBeRunning = true;
    if (this.restartTimeout) clearTimeout(this.restartTimeout);

    this.safeStart();
  }

  resetAccumulatedText() {
    this.accumulatedText = '';
  }

  stop() {
    this.shouldBeRunning = false;
    this.accumulatedText = ''; // Force wipe accumulated text on stop!
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
    if (this.isSupported && this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  destroy() {
    this.stop();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

export function createResilientRecognizer(onTranscript, onStateChange, onError) {
  return new WindowsResilientRecognizer(onTranscript, onStateChange, onError);
}
