import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
  minimumDuration?: number; // Minimum duration in ms
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  minimumDuration = 1800,
}) => {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const statusMessages = [
    'Initializing Assist Plus Portal...',
    'Connecting Healthcare Networks...',
    'Loading Care & Staffing Solutions...',
    'Welcome to Assist Plus Care'
  ];

  useEffect(() => {
    // Prevent document scroll during loader
    document.body.style.overflow = 'hidden';

    const startTime = Date.now();
    const intervalTime = 25;

    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const calculatedProgress = Math.min(
        100,
        Math.floor((elapsedTime / minimumDuration) * 100)
      );

      setProgress(calculatedProgress);

      if (calculatedProgress > 75) {
        setStatusIndex(3);
      } else if (calculatedProgress > 50) {
        setStatusIndex(2);
      } else if (calculatedProgress > 25) {
        setStatusIndex(1);
      } else {
        setStatusIndex(0);
      }

      if (elapsedTime >= minimumDuration) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          setIsHidden(true);
          document.body.style.overflow = '';
          if (onComplete) onComplete();
        }, 700); // Matches CSS transition duration
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = '';
    };
  }, [minimumDuration, onComplete]);

  if (isHidden) return null;

  return (
    <div className={`preloader-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      {/* Background ambient lighting */}
      <div className="preloader-bg-glow preloader-glow-1"></div>
      <div className="preloader-bg-glow preloader-glow-2"></div>

      <div className="preloader-content">
        {/* Logo Container with Orbit Rings */}
        <div className="preloader-logo-wrapper">
          {/* Outer Orbit SVG */}
          <svg className="preloader-orbit orbit-outer" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke="url(#preloaderGrad1)"
              strokeWidth="2.5"
              strokeDasharray="16 10"
            />
            <defs>
              <linearGradient id="preloaderGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1C6F6B" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#D7262E" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner Orbit SVG */}
          <svg className="preloader-orbit orbit-inner" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke="url(#preloaderGrad2)"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
            <defs>
              <linearGradient id="preloaderGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#1C6F6B" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Expanding Pulse Waves */}
          <div className="preloader-pulse-wave wave-1"></div>
          <div className="preloader-pulse-wave wave-2"></div>

          {/* Logo Card */}
          <div className="preloader-logo-card">
            <img
              src="/16__1_-removebg-preview.png"
              alt="Assist Plus Care Logo"
              className="preloader-logo-img"
            />
          </div>
        </div>

        {/* Brand Title & Tagline */}
        <div className="preloader-brand-title">
          <span>ASSIST PLUS</span> <span className="highlight">CARE</span>
        </div>
        <div className="preloader-brand-subtitle">
          Healthcare & Staffing Excellence
        </div>

        {/* Progress Bar & Status */}
        <div className="preloader-progress-section">
          <div className="preloader-bar-container">
            <div
              className="preloader-bar-fill"
              style={{ width: `${progress}%` }}
            >
              <div className="preloader-bar-glow"></div>
            </div>
          </div>

          <div className="preloader-status-meta">
            <span className="preloader-status-text">
              <span className="status-dot"></span>
              {statusMessages[statusIndex]}
            </span>
            <span className="preloader-percentage">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
