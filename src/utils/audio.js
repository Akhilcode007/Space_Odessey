// Web Audio API Synthesizer for Nothing OS minimal UI sounds & deep space ambiance
// Zero external audio files required!

class SpaceAudioSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.droneGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
  }

  toggleSound() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.startAmbientDrone();
      this.playBlip(880, 0.08, 'sine');
    } else {
      this.stopAmbientDrone();
    }
    return !this.isMuted;
  }

  startAmbientDrone() {
    if (!this.ctx || this.isMuted) return;
    try {
      if (this.droneGain) {
        this.droneGain.gain.setTargetAtTime(0.12, this.ctx.currentTime, 0.5);
        return;
      }

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.droneGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 2.5);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(45, this.ctx.currentTime); // Low F# sub drone

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(45.5, this.ctx.currentTime); // Slight detune for pulsing beat

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch (e) {
      console.warn('Audio drone error:', e);
    }
  }

  stopAmbientDrone() {
    if (this.droneGain && this.ctx) {
      try {
        this.droneGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.4);
      } catch (e) {
        // ignore
      }
    }
  }

  // Futuristic UI telemetry click / chirp
  playBlip(freq = 1200, duration = 0.06, type = 'sine') {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // ignore
    }
  }

  // Target lock sound when selecting a hotspot
  playTargetLock() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [800, 1200, 1600].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        gain.gain.setValueAtTime(0.05, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.05);
      });
    } catch (e) {
      // ignore
    }
  }

  // Whoosh sound when transitioning between planets
  playTransition() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.3);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {
      // ignore
    }
  }
}

export const soundManager = new SpaceAudioSystem();
