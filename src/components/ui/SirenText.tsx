'use client';
import React, { useRef, useEffect } from 'react';

export function SirenText() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const startSiren = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    if (oscillatorRef.current) return;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // LFO (Low Frequency Oscillator) to modulate frequency for an "urgent sweep"
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.value = 1100; // Base center frequency
    
    lfo.type = 'sine';
    lfo.frequency.value = 4; // 4 sweeps per second (very urgent/fast yelp)
    lfoGain.gain.value = 500; // Sweep goes up to 1600Hz and down to 600Hz
    
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    
    osc.start();
    lfo.start();
    
    oscillatorRef.current = osc;
    (oscillatorRef.current as any).lfo = lfo; // Store LFO to stop it later
  };

  const stopSiren = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      if ((oscillatorRef.current as any).lfo) {
        (oscillatorRef.current as any).lfo.stop();
        (oscillatorRef.current as any).lfo.disconnect();
      }
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopSiren(); // cleanup on unmount
  }, []);

  return (
    <p 
      className="accent-text siren-hover" 
      style={{ 
        marginBottom: '1.5rem', 
        cursor: 'pointer', 
        display: 'block',
        width: 'fit-content',
        transition: 'all 0.2s ease',
        userSelect: 'none'
      }}
      onMouseEnter={startSiren}
      onMouseLeave={stopSiren}
    >
      Under Construction 🚧
    </p>
  );
}
