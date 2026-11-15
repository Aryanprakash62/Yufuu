// Web Audio API synthesizer for playful, zero-latency birthday sound effects

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined' || this.muted) return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(mute: boolean) {
    this.muted = mute;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    delay = 0,
    volume = 0.14,
    slideToFreq?: number
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, slideToFreq), now + duration);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playClick() {
    this.playTone(620, 0.06, 'sine', 0, 0.08, 780);
  }

  public playWrongShake() {
    this.playTone(230, 0.14, 'triangle', 0, 0.16, 150);
    this.playTone(170, 0.18, 'triangle', 0.11, 0.15, 110);
  }

  public playUnlockFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      this.playTone(f, 0.22, 'triangle', i * 0.08, 0.15);
    });
    this.playTone(1318.5, 0.45, 'sine', 0.34, 0.14);
  }

  public playBlowCandle() {
    const ctx = this.getContext();
    if (!ctx) return;
    // Soft airy puff using filtered white noise + sweet chime
    const bufferSize = ctx.sampleRate * 0.18;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.18);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    this.playTone(880, 0.16, 'sine', 0.06, 0.08, 1046.5);
  }

  public playPop() {
    const pitchBoost = 0.9 + Math.random() * 0.3;
    this.playTone(420 * pitchBoost, 0.08, 'sine', 0, 0.2, 130);
    this.playTone(950 * pitchBoost, 0.06, 'triangle', 0.01, 0.1, 1250 * pitchBoost);
  }

  public playGiftOpen() {
    const sparkle = [587.33, 739.99, 880, 1174.66];
    sparkle.forEach((f, i) => {
      this.playTone(f, 0.2, 'sine', i * 0.06, 0.12);
    });
  }

  public playFortuneMagic() {
    const chord = [440, 554.37, 659.25, 880, 1108.73];
    chord.forEach((f, i) => {
      this.playTone(f, 0.38, 'sine', i * 0.055, 0.09);
    });
  }

  public playCelebrateWin() {
    const melody = [
      { f: 523.25, d: 0.12, t: 0 },
      { f: 659.25, d: 0.12, t: 0.1 },
      { f: 783.99, d: 0.12, t: 0.2 },
      { f: 1046.5, d: 0.35, t: 0.32 },
      { f: 783.99, d: 0.12, t: 0.5 },
      { f: 1046.5, d: 0.45, t: 0.62 },
    ];
    melody.forEach((n) => {
      this.playTone(n.f, n.d, 'triangle', n.t, 0.15);
    });
  }

  public playTypeTick() {
    this.playTone(720 + Math.random() * 140, 0.025, 'sine', 0, 0.025);
  }

  public playBirthdaySong() {
    // Classic "Happy Birthday" first two lines in gentle music-box bells
    const notes: Array<[number, number, number]> = [
      [392.0, 0.24, 0.0],   // G4
      [392.0, 0.18, 0.28],  // G4
      [440.0, 0.42, 0.5],   // A4
      [392.0, 0.42, 0.96],  // G4
      [523.25, 0.42, 1.42], // C5
      [493.88, 0.72, 1.88], // B4

      [392.0, 0.24, 2.75],  // G4
      [392.0, 0.18, 3.03],  // G4
      [440.0, 0.42, 3.25],  // A4
      [392.0, 0.42, 3.71],  // G4
      [587.33, 0.42, 4.17], // D5
      [523.25, 0.78, 4.63], // C5
    ];
    notes.forEach(([f, dur, start]) => {
      this.playTone(f, dur, 'sine', start, 0.13);
      this.playTone(f * 2, dur * 0.6, 'sine', start, 0.03);
    });
  }
}

export const soundFX = new SoundEngine();
