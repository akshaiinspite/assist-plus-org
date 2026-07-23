import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ModelItem {
  id: string;
  modelNum: string;
  badge: string;
  title: string;
  desc: string;
  tags: string[];
  ctaText: string;
  ctaIcon: string;
  accentColor: string;
  imgSrc: string;
  iconClass: string;
}

export const WorkforceSpectrumSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const pathGlowRef = useRef<SVGPathElement | null>(null);
  const doctorRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeModelIndex, setActiveModelIndex] = useState<number>(0);

  const models: ModelItem[] = [
    {
      id: 'model-1',
      modelNum: 'MODEL 01',
      badge: 'PLANNED WORKFORCE SUPPORT',
      title: 'Planned Workforce Support',
      desc: 'Structured long-term and block booking solutions to manage maternity leaves, planned expansions, and ongoing workforce stability.',
      tags: ['Maternity Cover', 'Block Bookings', 'Staffing Continuity', 'Planned Expansions'],
      ctaText: 'Request Planned Support',
      ctaIcon: 'fas fa-arrow-right',
      accentColor: '#1C6F6B',
      imgSrc: '/journey_step3_plan.png',
      iconClass: 'fas fa-calendar-check'
    },
    {
      id: 'model-2',
      modelNum: 'MODEL 02',
      badge: 'URGENT SICKNESS & EMERGENCY COVER',
      title: 'Urgent Sickness & Emergency Cover',
      desc: 'Rapid deployment of fully vetted nurses and carers within hours for unexpected staff absences and short-notice shifts.',
      tags: ['Rapid Deployment', '24/7 Hotline', 'Short-Notice Shifts', 'Same-Day Carers'],
      ctaText: 'Book Emergency Cover',
      ctaIcon: 'fas fa-bolt',
      accentColor: '#D7262E',
      imgSrc: '/emergency_cover_3d.png',
      iconClass: 'fas fa-truck-medical'
    },
    {
      id: 'model-3',
      modelNum: 'MODEL 03',
      badge: 'MULTI-SITE & CONTRACT STAFFING',
      title: 'Multi-Site & Contract Staffing',
      desc: 'Custom staffing master agreements across regional care networks, private hospitals, and residential groups.',
      tags: ['Master Agreements', 'Regional Networks', 'Private Hospitals', 'Volume Discounts'],
      ctaText: 'Explore Contract Staffing',
      ctaIcon: 'fas fa-file-contract',
      accentColor: '#10B981',
      imgSrc: '/journey_trust_3d.png',
      iconClass: 'fas fa-city'
    }
  ];

  useEffect(() => {
    if (!sectionRef.current || !doctorRef.current || !pathRef.current) return;

    const section = sectionRef.current;
    const path = pathRef.current;
    const pathGlow = pathGlowRef.current;
    const doctor = doctorRef.current;

    const ctx = gsap.context(() => {
      const pathLength = path.getTotalLength();

      // Initial SVG path state
      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      if (pathGlow) {
        gsap.set(pathGlow, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      }

      // Initial Doctor position
      gsap.set(doctor, { opacity: 0, scale: 0.7 });

      // ScrollTrigger animation scrub
      ScrollTrigger.create({
        trigger: section,
        start: 'top 70%',
        end: 'bottom 50%',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const drawOffset = pathLength * (1 - progress);

          gsap.set(path, { strokeDashoffset: drawOffset });
          if (pathGlow) gsap.set(pathGlow, { strokeDashoffset: drawOffset });

          if (progress > 0.01) {
            const point = path.getPointAtLength(progress * pathLength);
            const bounce = Math.sin(progress * pathLength * 0.1) * 3;

            gsap.set(doctor, {
              x: point.x - 30,
              y: point.y - 45 + bounce,
              opacity: 1,
              scale: 1
            });

            // Calculate rotation tilt along SVG path tangent
            if (progress < 0.99) {
              const nextPoint = path.getPointAtLength(Math.min((progress + 0.01) * pathLength, pathLength));
              const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
              gsap.set(doctor, { rotation: Math.max(-10, Math.min(10, angle * 0.15)) });
            }
          } else {
            gsap.set(doctor, { opacity: 0 });
          }

          // Glow logic: Only the div/card the doctor is currently visiting glows!
          let currentActive = 0;
          if (progress >= 0.66) {
            currentActive = 2; // Model 3
          } else if (progress >= 0.33) {
            currentActive = 1; // Model 2
          } else {
            currentActive = 0; // Model 1
          }

          setActiveModelIndex(currentActive);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="workforce-spectrum-section" ref={sectionRef} id="workforce-spectrum">
      <div className="container relative-z">
        {/* Header */}
        <div className="spectrum-header text-center reveal">
          <span className="spectrum-badge">
            <i className="fas fa-stethoscope"></i> WORKFORCE SPECTRUM
          </span>
          <h2 className="spectrum-title">
            Flexible Solutions Across <span className="highlight-gradient">Every Care Setting</span>
          </h2>
          <p className="spectrum-subtitle">
            Comprehensive healthcare staffing models structured for seamless integration.
          </p>
        </div>

        {/* Spectrum Roadmap Container */}
        <div className="spectrum-roadmap-container">
          {/* Animated Connecting SVG Path */}
          <svg className="spectrum-svg-path-guide" viewBox="0 0 1000 1200" fill="none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="spectrumGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1C6F6B" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#D7262E" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="spectrumGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(28,111,107,0.4)" />
                <stop offset="50%" stopColor="rgba(215,38,46,0.4)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.4)" />
              </linearGradient>
            </defs>
            <path
              d="M 500 50 L 500 400 L 500 750 L 500 1100"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="4"
              strokeDasharray="8 6"
            />
            <path
              ref={pathGlowRef}
              d="M 500 50 L 500 400 L 500 750 L 500 1100"
              stroke="url(#spectrumGlow)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <path
              ref={pathRef}
              d="M 500 50 L 500 400 L 500 750 L 500 1100"
              stroke="url(#spectrumGrad)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Floating Traveling Doctor Icon */}
          <div className="spectrum-doctor-tracker" ref={doctorRef}>
            <div className="spectrum-doctor-pulse"></div>
            <div className="spectrum-doctor-avatar">
              <img src="/doctor_journey_icon.png" alt="Doctor Guide" />
            </div>
            <div className="spectrum-doctor-tooltip">
              <i className="fas fa-user-md"></i> {models[activeModelIndex]?.modelNum}
            </div>
          </div>

          {/* The 3 Staffing Model Cards */}
          <div className="spectrum-cards-grid">
            {models.map((model, idx) => {
              const isGlowing = activeModelIndex === idx;
              return (
                <div
                  key={model.id}
                  ref={(el) => (cardRefs.current[idx] = el)}
                  className={`spectrum-model-card ${isGlowing ? 'is-glowing-active' : ''}`}
                  style={{ '--accent-color': model.accentColor } as React.CSSProperties}
                >
                  <div className="spectrum-card-header">
                    <div className="spectrum-model-num-tag">{model.modelNum}</div>
                    <span className="spectrum-model-badge">
                      <i className={model.iconClass}></i> {model.badge}
                    </span>
                  </div>

                  <div className="spectrum-card-main">
                    <div className="spectrum-card-text">
                      <h3 className="spectrum-model-title">{model.title}</h3>
                      <p className="spectrum-model-desc">{model.desc}</p>

                      <div className="spectrum-tags-row">
                        {model.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="spectrum-tag-pill">
                            <i className="fas fa-check-circle"></i> {tag}
                          </span>
                        ))}
                      </div>

                      <div className="spectrum-card-footer">
                        <Link to="/quote" className="btn spectrum-cta-btn">
                          {model.ctaText} <i className={model.ctaIcon}></i>
                        </Link>
                      </div>
                    </div>

                    <div className="spectrum-card-media">
                      <div className="spectrum-img-frame">
                        <img src={model.imgSrc} alt={model.title} className="spectrum-model-img" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
