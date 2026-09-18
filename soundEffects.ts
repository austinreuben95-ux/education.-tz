// Web Audio API Sound Effect Library

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Plays a distinct, subtle tactile 'click' sound when buttons or study actions are pressed.
 */
export const playClickSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Crisp tactile click sound using sine pitch drop + gain envelope
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Frequency pitch sweep from 1400 Hz down to 300 Hz for snappy click feedback
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

    // Gain envelope
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) {
    console.error('Audio click playback error:', e);
  }
};

/**
 * Plays an uplifting, triumphant 'cheer' fanfare sound effect when the daily mastery goal is reached.
 */
export const playCheerSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Celebratory 5-note fanfare chord progression (C5 -> E5 -> G5 -> C6 -> E6)
    const notes = [
      { freq: 523.25, time: 0.0, duration: 0.18 }, // C5
      { freq: 659.25, time: 0.12, duration: 0.18 }, // E5
      { freq: 783.99, time: 0.24, duration: 0.18 }, // G5
      { freq: 1046.50, time: 0.36, duration: 0.4 },  // C6
      { freq: 1318.51, time: 0.50, duration: 0.6 }   // E6 (High cheer finish)
    ];

    notes.forEach(({ freq, time, duration }) => {
      const startTime = now + time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // Rich, warm musical tone
      osc.frequency.setValueAtTime(freq, startTime);

      if (freq >= 1046) {
        osc.frequency.exponentialRampToValueAtTime(freq * 1.02, startTime + duration);
      }

      gain.gain.setValueAtTime(0.01, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });

    // Add subtle background noise burst for applause/cheer texture
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now + 0.3);
    filter.Q.setValueAtTime(1.5, now + 0.3);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now + 0.3);
    noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.4);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now + 0.3);
    noise.stop(now + 0.75);

  } catch (e) {
    console.error('Cheer sound playback error:', e);
  }
};
