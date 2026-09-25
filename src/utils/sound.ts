/**
 * Web Audio API synthesizer for child-friendly feedback sounds
 * No external audio files needed; 100% resilient and hermetic.
 */

class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft bubble/pop when clicking fraction segments
  playTap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignore audio errors
    }
  }

  // Play a cheerful chime on correct fraction answer
  playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.25, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.36);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Play soft gentle hint sound
  playHint() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(370, now + 0.15);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore audio errors
    }
  }

  // Play fanfare celebration for completing levels
  playFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [
        { f: 523.25, t: 0, d: 0.12 },
        { f: 659.25, t: 0.12, d: 0.12 },
        { f: 783.99, t: 0.24, d: 0.15 },
        { f: 1046.5, t: 0.42, d: 0.45 },
      ];
      const now = this.ctx.currentTime;

      notes.forEach(({ f, t, d }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.28, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Play soft countdown tick
  playTick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.03);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Ignore audio errors
    }
  }

  // Play high energy bonus star sound
  playBonus() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [659.25, 830.61, 987.77, 1318.5]; // E5, G#5, B5, E6
      const now = this.ctx.currentTime;
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(0.22, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.26);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Sparkling celestial sound when a child earns a new star
  playStarEarned() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        // Bell/glockenspiel envelope
        gain.gain.setValueAtTime(0.28, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.42);
      });

      // Extra high shimmer
      const shimmer = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(2637, now + 0.2); // E7
      sGain.gain.setValueAtTime(0.15, now + 0.2);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      shimmer.connect(sGain);
      sGain.connect(this.ctx.destination);
      shimmer.start(now + 0.2);
      shimmer.stop(now + 0.56);
    } catch {
      // Ignore audio errors
    }
  }

  // Party popper sound effect: punchy pop + fluttering confetti sparkles
  playConfettiPopper() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. The "POP" air cannon burst
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(520, now);
      popOsc.frequency.exponentialRampToValueAtTime(80, now + 0.07);

      popGain.gain.setValueAtTime(0.35, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);
      popOsc.start(now);
      popOsc.stop(now + 0.08);

      // 2. Fluttering confetti sparkles
      const sparklePitches = [1480, 1820, 2200, 2750, 3100];
      sparklePitches.forEach((pitch, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const startT = now + 0.04 + i * 0.03;
        osc.frequency.setValueAtTime(pitch, startT);
        osc.frequency.exponentialRampToValueAtTime(pitch * 0.85, startT + 0.08);

        gain.gain.setValueAtTime(0.12, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startT);
        osc.stop(startT + 0.09);
      });
    } catch {
      // Ignore audio errors
    }
  }

  // Cheerful classroom applause / clapping synthesis using filtered noise impulses
  playApplause() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const duration = 1.3;
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate claps: clusters of bursts
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to sculpt noise into handclaps
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1150;
      filter.Q.value = 2.0;

      const masterGain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      // Envelope: swelling cheerful applause
      masterGain.gain.setValueAtTime(0.01, now);
      masterGain.gain.linearRampToValueAtTime(0.3, now + 0.2);
      masterGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      noise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // Ignore audio errors
    }
  }

  // Combined grand celebration for unlocking accessories!
  playUnlockAccessory() {
    if (!this.enabled) return;
    this.playConfettiPopper();
    this.playFanfare();
    setTimeout(() => {
      this.playApplause();
    }, 250);
  }
}

export const sound = new SoundEffects();

/**
 * Text-to-speech reader in Portuguese for 3rd graders
 */
export function speakPortuguese(text: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // Slightly slower and clear for kids
    utterance.pitch = 1.1; // Slightly warm/friendly tone
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech errors
  }
}
