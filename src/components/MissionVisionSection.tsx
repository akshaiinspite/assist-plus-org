import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const MissionVisionSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const missionCardRef = useRef<HTMLDivElement>(null);
  const visionCardRef = useRef<HTMLDivElement>(null);

  // Path SVG refs
  const pathLineRef = useRef<SVGPathElement>(null);
  const arrowPathRef = useRef<SVGPathElement>(null);

  // Mission Element Refs
  const missionHeadingRef = useRef<HTMLHeadingElement>(null);
  const missionDescRef = useRef<HTMLDivElement>(null);
  const missionCrossRef = useRef<SVGPathElement>(null);
  const missionSilhouettesRef = useRef<SVGGElement>(null);
  const missionPulseRef = useRef<SVGPathElement>(null);

  // Vision Element Refs
  const visionHeadingRef = useRef<HTMLHeadingElement>(null);
  const visionDescRef = useRef<HTMLDivElement>(null);
  const visionHospitalRef = useRef<SVGPathElement>(null);
  const visionDoctorsRef = useRef<SVGGElement>(null);
  const visionNodesRef = useRef<SVGGElement>(null);
  const visionShieldRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial SVG path lengths for DrawSVG effect
      const setupDrawPath = (pathEl: SVGPathElement | null) => {
        if (!pathEl) return 0;
        const len = pathEl.getTotalLength();
        gsap.set(pathEl, { strokeDasharray: len, strokeDashoffset: len });
        return len;
      };

      setupDrawPath(pathLineRef.current);
      setupDrawPath(arrowPathRef.current);
      setupDrawPath(missionCrossRef.current);
      setupDrawPath(missionPulseRef.current);
      setupDrawPath(visionHospitalRef.current);

      // Mission & Vision description lines for staggered blur slide
      const missionLines = missionDescRef.current?.querySelectorAll('.mv-line') || [];
      const visionLines = visionDescRef.current?.querySelectorAll('.mv-line') || [];

      // Initial States
      gsap.set(sectionRef.current, { opacity: 0, y: 30 });
      gsap.set(missionCardRef.current, { scale: 0.94, opacity: 0, y: 25 });
      gsap.set(visionCardRef.current, { scale: 0.94, opacity: 0, y: 25 });
      gsap.set(missionSilhouettesRef.current, { opacity: 0 });
      gsap.set(visionDoctorsRef.current, { opacity: 0 });
      gsap.set(visionNodesRef.current, { opacity: 0, scale: 0.5 });
      gsap.set(visionShieldRef.current, { opacity: 0, scale: 0.5 });
      gsap.set(missionHeadingRef.current, { opacity: 0 });
      gsap.set(visionHeadingRef.current, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0 });

      // Build Master Storytelling Timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      // 1. Section Entrance
      masterTl
        .to(sectionRef.current, { opacity: 1, y: 0, duration: 0.45, ease: 'power4.out' })
        .fromTo(titleRef.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.3')

        // 2. Draw Curved Pathway Line between Mission & Vision
        .to(pathLineRef.current, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.2')

        // 3. Mission Card Activation
        .to(missionCardRef.current, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'power4.out' }, '-=0.35')

        // 4. Mission Heading Wipe & Staggered Description Lines
        .to(missionHeadingRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.25')
        .fromTo(
          missionLines,
          { y: 12, opacity: 0, filter: 'blur(6px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.35, stagger: 0.08, ease: 'power2.out' },
          '-=0.2'
        )

        // 5. Mission SVG Illustration Assembly
        .to(missionCrossRef.current, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' }, '-=0.25')
        .to(missionSilhouettesRef.current, { opacity: 1, duration: 0.3 }, '-=0.15')
        .to(missionPulseRef.current, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, '-=0.15')

        // 6. Brief Pause
        .to({}, { duration: 0.1 })

        // 7. Pathway Arrow Growth to Vision
        .to(arrowPathRef.current, { strokeDashoffset: 0, duration: 0.45, ease: 'power2.inOut' })

        // 8. Vision Card Activation
        .to(visionCardRef.current, { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'power4.out' }, '-=0.3')

        // 9. Vision Heading Reveal & Description Reveal
        .to(visionHeadingRef.current, { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1, duration: 0.4, ease: 'power3.out' }, '-=0.3')
        .fromTo(
          visionLines,
          { y: 12, opacity: 0, filter: 'blur(6px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.35, stagger: 0.08, ease: 'power2.out' },
          '-=0.2'
        )

        // 10. Vision SVG Illustration Assembly
        .to(visionHospitalRef.current, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.inOut' }, '-=0.25')
        .to(visionDoctorsRef.current, { opacity: 1, duration: 0.3 }, '-=0.15')
        .to(visionNodesRef.current, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.06, ease: 'back.out(1.5)' }, '-=0.15')
        .to(visionShieldRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, '-=0.15');

      // Subtle 6s Idle Breathing Loop
      gsap.to([missionCardRef.current, visionCardRef.current], {
        y: -4,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.6
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mission-vision-section" ref={sectionRef}>
      {/* Background Soft Blurs & Floating Medical Particles */}
      <div className="mv-bg-blur-1"></div>
      <div className="mv-bg-blur-2"></div>
      
      <div className="container relative-z">
        {/* Section Header */}
        <div className="mv-header text-center" ref={titleRef}>
          <span className="mv-badge">
            <i className="fas fa-compass" style={{ color: '#38BDF8' }}></i> OUR PURPOSE
          </span>
          <h2 className="mv-title">A TRUSTED STAFFING PARTNER</h2>
          <p className="mv-subtitle">
            Supporting care homes to maintain safe, compliant, &amp; high-quality care delivery without compromising operational efficiency.
          </p>
        </div>

        {/* Storytelling Cards Container */}
        <div className="mv-cards-wrapper">
          {/* SVG Connection Pathway Line */}
          <div className="mv-pathway-svg-wrap">
            <svg className="mv-pathway-svg" viewBox="0 0 800 120" fill="none" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0D6EFD" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#38BDF8" stopOpacity="1" />
                  <stop offset="100%" stopColor="#1C6F6B" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Pathway Line */}
              <path
                ref={pathLineRef}
                d="M 120 60 C 280 20, 520 100, 680 60"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                filter="url(#glow)"
              />

              {/* Pathway Arrow to Vision */}
              <path
                ref={arrowPathRef}
                d="M 665 48 L 685 60 L 665 72"
                stroke="#38BDF8"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* MISSION CARD */}
          <div className="mv-card mission-card" ref={missionCardRef}>
            <div className="mv-card-header">
              <span className="mv-card-tag mission-tag">
                <i className="fas fa-bullseye"></i> OUR MISSION
              </span>
            </div>

            {/* Mission Isometric SVG Illustration */}
            <div className="mv-illustration-wrap">
              <svg className="mv-svg-illustration" viewBox="0 0 240 180" fill="none">
                {/* Background Halo */}
                <circle cx="120" cy="90" r="70" fill="url(#haloMission)" opacity="0.15" />

                {/* Medical Cross Outer Line (DrawSVG) */}
                <path
                  ref={missionCrossRef}
                  d="M 105 45 H 135 V 75 H 165 V 105 H 135 V 135 H 105 V 105 H 75 V 75 H 105 Z"
                  stroke="#0D6EFD"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* Healthcare Professional & Patient Silhouettes */}
                <g ref={missionSilhouettesRef}>
                  {/* Nurse Avatar */}
                  <circle cx="95" cy="85" r="14" fill="#0D6EFD" opacity="0.9" />
                  <path d="M 75 125 C 75 105, 115 105, 115 125 Z" fill="#0D6EFD" opacity="0.85" />
                  
                  {/* Patient Avatar */}
                  <circle cx="145" cy="92" r="11" fill="#38BDF8" opacity="0.9" />
                  <path d="M 128 125 C 128 110, 162 110, 162 125 Z" fill="#38BDF8" opacity="0.85" />
                </g>

                {/* Heart Pulse Waveform (DrawSVG) */}
                <path
                  ref={missionPulseRef}
                  d="M 40 90 H 70 L 80 75 L 92 105 L 105 65 L 118 115 L 128 85 L 138 95 H 200"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                <defs>
                  <radialGradient id="haloMission" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0D6EFD" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            <h3 className="mv-card-title mission-title-wipe" ref={missionHeadingRef}>
              Excellence in Healthcare Workforce
            </h3>

            <div className="mv-card-desc" ref={missionDescRef}>
              <p className="mv-line">To build strong, compassionate care teams that deliver safe, high-quality, and dignified care to every individual across nursing homes, care homes, and complex care settings.</p>
            </div>

            <div className="mv-card-footer">
              <span className="mv-highlight-chip"><i className="fas fa-check"></i> Quality First</span>
              <span className="mv-highlight-chip"><i className="fas fa-heart"></i> Person-Centred</span>
            </div>
          </div>

          {/* VISION CARD */}
          <div className="mv-card vision-card" ref={visionCardRef}>
            <div className="mv-card-header">
              <span className="mv-card-tag vision-tag">
                <i className="fas fa-eye"></i> OUR VISION
              </span>
            </div>

            {/* Vision Isometric SVG Illustration */}
            <div className="mv-illustration-wrap">
              <svg className="mv-svg-illustration" viewBox="0 0 240 180" fill="none">
                {/* Background Halo */}
                <circle cx="120" cy="90" r="75" fill="url(#haloVision)" opacity="0.18" />

                {/* Hospital Outline (DrawSVG) */}
                <path
                  ref={visionHospitalRef}
                  d="M 60 135 V 75 L 120 45 L 180 75 V 135 H 60 Z M 100 135 V 105 H 140 V 135"
                  stroke="#1C6F6B"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* Connected Doctors & Digital Healthcare Nodes */}
                
                <g ref={visionDoctorsRef}>
                  <circle cx="60" cy="75" r="8" fill="#38BDF8" />
                  <circle cx="180" cy="75" r="8" fill="#38BDF8" />
                  <circle cx="120" cy="45" r="9" fill="#0D6EFD" />
                </g>

                <g ref={visionNodesRef}>
                  <line x1="60" y1="75" x2="120" y2="45" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="180" y1="75" x2="120" y2="45" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1="60" y1="135" x2="180" y2="135" stroke="rgba(28,111,107,0.3)" strokeWidth="2" />
                </g>

                {/* Central Shield Icon with Pulsing Halo */}
                <g ref={visionShieldRef}>
                  <path
                    d="M 120 85 C 105 85, 105 110, 120 122 C 135 110, 135 85, 120 85 Z"
                    fill="#1C6F6B"
                    opacity="0.95"
                  />
                  <path d="M 120 93 V 112 M 111 102 H 129" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
                </g>

                <defs>
                  <radialGradient id="haloVision" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            <h3 className="mv-card-title vision-title-mask" ref={visionHeadingRef}>
              Empowering Healthcare Continuity
            </h3>

            <div className="mv-card-desc" ref={visionDescRef}>
              <p className="mv-line">A healthcare system where every care provider has immediate access to the right staff at the right time — ensuring unbroken continuity, patient safety, and clinical excellence.</p>
            </div>

            <div className="mv-card-footer">
              <span className="mv-highlight-chip vision-chip"><i className="fas fa-bolt"></i> 24/7 Continuity</span>
              <span className="mv-highlight-chip vision-chip"><i className="fas fa-shield-alt"></i> Total Safety</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
