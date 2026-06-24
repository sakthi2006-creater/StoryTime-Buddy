import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Soft synthesized background melody + humming pad.
 * No audio files needed — uses the WebAudio API.
 */
export function useHumming() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const ctx = ctxRef.current;
    if (ctx && masterRef.current) {
      masterRef.current.gain.cancelScheduledValues(ctx.currentTime);
      masterRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      window.setTimeout(() => {
        ctx.close().catch(() => {});
        ctxRef.current = null;
        masterRef.current = null;
      }, 700);
    }
    setPlaying(false);
  }, []);

  const start = useCallback(() => {
    if (ctxRef.current) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.2);
    masterRef.current = master;

    // --- Humming pad (two detuned sine voices) ---
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 900;
    padFilter.Q.value = 0.6;
    padFilter.connect(master);

    const padGain = ctx.createGain();
    padGain.gain.value = 0.35;
    padGain.connect(padFilter);

    const voices: OscillatorNode[] = [];
    [220, 277.18, 329.63].forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.value = 0.2;
      // gentle LFO for hum tremor
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.18 + i * 0.07;
      lfoGain.gain.value = 0.04;
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();
      o.connect(g).connect(padGain);
      o.start();
      voices.push(o);
    });

    // --- Sparkly melody ---
    const melodyGain = ctx.createGain();
    melodyGain.gain.value = 0.0;
    const melodyFilter = ctx.createBiquadFilter();
    melodyFilter.type = "lowpass";
    melodyFilter.frequency.value = 3200;
    melodyGain.connect(melodyFilter).connect(master);

    // C major pentatonic-ish, cheerful & kid-friendly
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const pattern = [0, 2, 4, 3, 1, 4, 2, 5];
    let step = 0;

    const playNote = () => {
      if (!ctxRef.current) return;
      const now = ctx.currentTime;
      const freq = scale[pattern[step % pattern.length]];
      step++;

      const o = ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.18, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
      o.connect(g).connect(melodyGain);
      melodyGain.gain.setValueAtTime(1, now);
      o.start(now);
      o.stop(now + 1.0);
    };

    // play a note every ~700ms
    timerRef.current = window.setInterval(playNote, 700);
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stop();
    else start();
  }, [playing, start, stop]);

  // Auto-start on mount; if the browser blocks autoplay, start on first user gesture.
  useEffect(() => {
    start();
    const kick = () => {
      start();
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      window.removeEventListener("touchstart", kick);
    };
    window.addEventListener("pointerdown", kick, { once: true });
    window.addEventListener("keydown", kick, { once: true });
    window.addEventListener("touchstart", kick, { once: true });
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      window.removeEventListener("touchstart", kick);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { playing, toggle };
}
