import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Target mouse coordinates
  const mousePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  // Ring lerp coordinates
  const ringPos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable custom cursor on devices with fine pointer (mouse)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const checkHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = Boolean(
        target.closest('a, button, .btn, input, select, textarea, [role="button"], .interactive-hover, summary, label')
      );
      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousemove', checkHoverState);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth Animation Loop (Lerp)
    let animationFrameId: number;
    const render = () => {
      // Lerp for smooth trailing ring effect
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', checkHoverState);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  return (
    <div className={`custom-cursor-container ${isVisible ? 'is-visible' : ''}`}>
      {/* Inner Precision Dot in Logo Gradient */}
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${isHovered ? 'is-hovered' : ''} ${isMouseDown ? 'is-down' : ''}`}
      />
      {/* Outer Halo Ring in Logo Brand Colors */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isHovered ? 'is-hovered' : ''} ${isMouseDown ? 'is-down' : ''}`}
      />
    </div>
  );
};
