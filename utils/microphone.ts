export class BlowDetector {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphone: MediaStreamAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;
  private isListening: boolean = false;
  private blowConsistencyCount: number = 0; // Tracks consecutive frames of "blow" sound

  async start(onBlowDetected: () => void) {
    if (this.isListening) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      
      this.analyser.fftSize = 512; // Higher resolution
      this.analyser.smoothingTimeConstant = 0.3; // Smooth out jitter
      this.microphone.connect(this.analyser);
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      this.isListening = true;
      this.detectLoop(onBlowDetected);
    } catch (err) {
      console.warn("Microphone access denied or error:", err);
    }
  }

  private detectLoop = (callback: () => void) => {
    if (!this.isListening || !this.analyser || !this.dataArray) return;

    requestAnimationFrame(() => this.detectLoop(callback));

    this.analyser.getByteFrequencyData(this.dataArray as any);

    // Algorithm:
    // 1. Calculate average energy in low frequencies (blowing is heavy in bass/wind noise).
    // 2. Requires a certain threshold.
    // 3. Requires consistency (must be loud for X frames) to avoid triggering on a clap or knock.

    let lowEndSum = 0;
    const lowEndBins = 15; // Roughly 0Hz to ~1300Hz depending on sample rate (usually 44.1k/48k)
    
    for (let i = 0; i < lowEndBins; i++) {
        lowEndSum += this.dataArray[i];
    }
    const averageVolume = lowEndSum / lowEndBins;

    // Thresholds
    // Increased threshold to 135 (out of 255) to ignore normal speaking volume
    const BLOW_THRESHOLD = 150; 
    // Increased required frames to 20 (approx 300ms @ 60fps) to ensure it's a sustained breath, not a sharp noise
    const REQUIRED_FRAMES = 20; 

    if (averageVolume > BLOW_THRESHOLD) {
        this.blowConsistencyCount++;
        
        if (this.blowConsistencyCount > REQUIRED_FRAMES) {
             callback();
             this.stop();
        }
    } else {
        // Decay the count if the sound drops, so a stuttery breath doesn't completely reset but a silence does
        this.blowConsistencyCount = Math.max(0, this.blowConsistencyCount - 1);
    }
  }

  stop() {
    this.isListening = false;
    if (this.microphone) this.microphone.disconnect();
    if (this.analyser) this.analyser.disconnect();
    if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close();
    }
  }
}