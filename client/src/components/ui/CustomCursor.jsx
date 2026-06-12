import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let raf;

    const moveDot = (e) => {
      dotX = e.clientX;
      dotY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = dotX + 'px';
        dotRef.current.style.top = dotY + 'px';
      }
      setVisible(true);
    };

    const lerpRing = () => {
      ringX += (dotX - ringX) * 0.15;
      ringY += (dotY - ringY) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = ringX + 'px';
        ringRef.current.style.top = ringY + 'px';
      }
      raf = requestAnimationFrame(lerpRing);
    };

    const handleEnter = () => setHovering(true);
    const handleLeave = () => setHovering(false);

    document.addEventListener('mousemove', moveDot);
    document.addEventListener('mouseleave', () => setVisible(false));

    const updateHoverTargets = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach(el => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });
    };

    updateHoverTargets();
    raf = requestAnimationFrame(lerpRing);

    const observer = new MutationObserver(updateHoverTargets);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', moveDot);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`cursor-dot pointer-events-none fixed z-[9999] transition-all duration-150 ${hovering ? 'hovering' : ''}`}
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className={`cursor-ring pointer-events-none fixed z-[9998] transition-all duration-300 ${hovering ? 'hovering' : ''}`}
        style={{ opacity: visible ? 1 : 0 }}
      />
    </>
  );
}
