'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Detect if the user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      // lerp: smoothing factor — lower = smoother/slower, higher = snappier
      // 0.07 gives a very silky premium feel without feeling sluggish
      lerp: 0.075,
      smoothWheel: true,
      // Slightly reduced wheel multiplier for a controlled, premium feel
      wheelMultiplier: 0.95,
      // Slightly increase touch multiplier for better mobile responsiveness
      touchMultiplier: 1.5,
      // Sync scrollbar with Lenis — cleaner visual
      syncTouch: false,
      // Prevent overscroll rubber-banding interference on desktop
      overscroll: false,
    });

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
