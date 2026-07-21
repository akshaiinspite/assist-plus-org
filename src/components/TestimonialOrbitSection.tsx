import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TestimonialItem {
  id: number;
  role: string;
  location: string;
  quote: string;
  badge: string;
  stars: number;
  accentColor: string;
  positionClass: string;
  illustration: React.ReactNode;
}

export const TestimonialOrbitSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const orbitWheelRef = useRef<HTMLDivElement>(null);
  const orbitSpinRef = useRef<HTMLDivElement>(null);
  const centerHubRef = useRef<HTMLDivElement>(null);
  const spotlightCardRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const testimonials: TestimonialItem[] = [
    {
      id: 0,
      role: 'Care Home Manager',
      location: 'Surrey, UK',
      quote: '"Assist Plus Care UK has transformed our staffing situation. Their nurses are professional, kind, and always reliable."',
      badge: 'Verified Partner',
      stars: 5,
      accentColor: '#0EA5E9',
      positionClass: 'testimonial-pos-top',
      illustration: (
        <svg viewBox="0 0 140 120" fill="none" className="partner-vector-svg">
          <rect x="20" y="15" width="100" height="90" rx="18" fill="url(#tGrad1)" opacity="0.2" />
          <circle cx="70" cy="50" r="28" fill="#0EA5E9" />
          <path d="M 40 100 C 40 78, 100 78, 100 100 Z" fill="#0284C7" />
          <rect x="85" y="35" width="35" height="48" rx="6" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
          <line x1="93" y1="45" x2="112" y2="45" stroke="#38BDF8" strokeWidth="2" />
          <line x1="93" y1="53" x2="108" y2="53" stroke="#38BDF8" strokeWidth="2" />
          <line x1="93" y1="61" x2="114" y2="61" stroke="#38BDF8" strokeWidth="2" />
          <circle cx="70" cy="50" r="14" fill="#FFFFFF" opacity="0.25" />
          <path d="M 64 50 L 68 54 L 76 44" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="tGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 1,
      role: 'Residential Home Owner',
      location: 'Birmingham, UK',
      quote: '"Their HCAs are exceptional. They treat our residents with genuine compassion and dignity."',
      badge: 'Verified Partner',
      stars: 5,
      accentColor: '#10B981',
      positionClass: 'testimonial-pos-right',
      illustration: (
        <svg viewBox="0 0 140 120" fill="none" className="partner-vector-svg">
          <rect x="20" y="15" width="100" height="90" rx="18" fill="url(#tGrad2)" opacity="0.2" />
          <path d="M 70 30 C 58 16, 38 30, 50 48 L 70 68 L 90 48 C 102 30, 82 16, 70 30 Z" fill="#10B981" />
          <path d="M 45 92 C 55 82, 85 82, 95 92" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
          <circle cx="70" cy="45" r="10" fill="#FFFFFF" opacity="0.3" />
          <path d="M 64 45 L 68 49 L 76 39" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="tGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 2,
      role: 'Clinical Lead',
      location: 'Manchester, UK',
      quote: '"The emergency cover service is outstanding. They respond quickly and send competent staff every single time."',
      badge: 'Verified Partner',
      stars: 5,
      accentColor: '#8B5CF6',
      positionClass: 'testimonial-pos-bottom',
      illustration: (
        <svg viewBox="0 0 140 120" fill="none" className="partner-vector-svg">
          <rect x="20" y="15" width="100" height="90" rx="18" fill="url(#tGrad3)" opacity="0.2" />
          <circle cx="70" cy="50" r="30" fill="#8B5CF6" />
          <path d="M 40 100 C 40 76, 100 76, 100 100 Z" fill="#7C3AED" />
          <path d="M 35 60 L 50 45 L 62 65 L 78 30 L 92 75 L 105 60" stroke="#A78BFA" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="tGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 3,
      role: 'Service Manager',
      location: 'London, UK',
      quote: '"Their mental health nurses have made a huge difference in our unit. Highly skilled and supportive."',
      badge: 'Verified Partner',
      stars: 5,
      accentColor: '#F43F5E',
      positionClass: 'testimonial-pos-left',
      illustration: (
        <svg viewBox="0 0 140 120" fill="none" className="partner-vector-svg">
          <rect x="20" y="15" width="100" height="90" rx="18" fill="url(#tGrad4)" opacity="0.2" />
          <path d="M 70 24 C 84 24, 96 29, 96 42 C 96 62, 78 74, 70 84 C 62 74, 44 62, 44 42 C 44 29, 56 24, 70 24 Z" fill="#F43F5E" />
          <circle cx="70" cy="48" r="12" fill="#FFFFFF" opacity="0.3" />
          <path d="M 64 48 L 68 52 L 76 42" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="tGrad4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#FB7185" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  const currentTestimonial = testimonials[activeIndex];

  // Auto-cycle active testimonial every 4.5s
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, testimonials.length]);

  // GSAP Entrance & Continuous Orbit Setup
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance reveal timeline
      if (orbitWheelRef.current) {
        gsap.fromTo(
          orbitWheelRef.current,
          { scale: 0.82, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%'
            }
          }
        );
      }

      // Infinite slow orbit rotation
      if (orbitSpinRef.current) {
        gsap.to(orbitSpinRef.current, {
          rotation: 360,
          duration: 32,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%'
        });
      }

      // Counter-rotate central hub so text stays upright
      if (centerHubRef.current) {
        gsap.to(centerHubRef.current, {
          rotation: -360,
          duration: 32,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%'
        });
      }

      // Counter-rotate each card button so content stays upright
      nodeRefs.current.forEach((card) => {
        if (card) {
          gsap.to(card, {
            rotation: -360,
            duration: 32,
            repeat: -1,
            ease: 'none',
            transformOrigin: '50% 50%'
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // GSAP animation when active testimonial changes
  useEffect(() => {
    if (!spotlightCardRef.current) return;

    const els = spotlightCardRef.current.querySelectorAll('.t-stagger-reveal');
    gsap.fromTo(
      spotlightCardRef.current,
      { opacity: 0, scale: 0.94, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );

    gsap.fromTo(
      els,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: 'power2.out' }
    );
  }, [activeIndex]);

  return (
    <section
      className="testimonial-orbit-section"
      id="testimonials"
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Lighting, Floating Crosses & Particles */}
      <div className="t-bg-container">
        <div className="t-blob t-blob-1"></div>
        <div className="t-blob t-blob-2"></div>
        <div className="t-grid-mesh"></div>
        <div className="t-floating-crosses">
          <i className="fas fa-plus t-cross c1"></i>
          <i className="fas fa-plus t-cross c2"></i>
          <i className="fas fa-plus t-cross c3"></i>
          <i className="fas fa-plus t-cross c4"></i>
        </div>
      </div>

      <div className="container relative-z">
        {/* Section Heading */}
        <div className="whoweare-intro-header text-center reveal" style={{ marginBottom: '36px' }}>
          <span className="about-badge-logo">
            <i className="fas fa-quote-left"></i> TRUSTED HEALTHCARE NETWORK
          </span>
          <h2 className="about-title-logo">What Our Healthcare Partners Say</h2>
          <p className="about-lead-styled">
            Hear from care home managers, residential owners, and clinical leads who rely on Assist Plus Care UK for dependable staffing.
          </p>
        </div>

        {/* 2-Column Split: Orbit Wheel (Left) & Active Spotlight Card (Right) */}
        <div className="testimonial-orbit-layout">
          {/* LEFT: Circular Orbit Wheel */}
          <div className="t-orbit-wheel-container" ref={orbitWheelRef}>
            <div className="t-orbit-wheel" ref={orbitSpinRef}>
              {/* SVG Orbit Track */}
              <svg className="t-orbit-svg" viewBox="0 0 480 480" fill="none">
                <circle cx="240" cy="240" r="185" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="3" strokeDasharray="8 8" />
                <circle cx="240" cy="240" r="185" stroke="url(#tWheelGrad)" strokeWidth="2.5" opacity="0.7" />
                <defs>
                  <linearGradient id="tWheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="33%" stopColor="#10B981" />
                    <stop offset="66%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Central Frosted-Glass Hub */}
              <div className="t-center-hub" ref={centerHubRef}>
                <div className="t-hub-stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <span className="t-hub-subtitle">Trusted by</span>
                <strong className="t-hub-title">Healthcare Partners</strong>
                <span className="t-hub-tag">Across the UK</span>
              </div>

              {/* 4 Orbiting Partner Mini-Cards */}
              {testimonials.map((t, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <div
                    key={t.id}
                    ref={(el) => (nodeRefs.current[idx] = el)}
                    className={`t-orbit-card-node ${t.positionClass} ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    title={t.role}
                    style={{ borderColor: isActive ? t.accentColor : 'rgba(255, 255, 255, 0.8)' }}
                  >
                    <div className="t-node-badge" style={{ background: t.accentColor }}>
                      <i className="fas fa-quote-right"></i>
                    </div>
                    <strong className="t-node-title">{t.role}</strong>
                    <span className="t-node-loc">{t.location}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Active Spotlight Card */}
          <div className="t-spotlight-panel-wrap">
            <div className="t-spotlight-card" ref={spotlightCardRef}>
              <div className="t-spotlight-top">
                <span className="t-stagger-reveal t-partner-badge" style={{ background: `${currentTestimonial.accentColor}18`, color: currentTestimonial.accentColor, borderColor: `${currentTestimonial.accentColor}40` }}>
                  <i className="fas fa-shield-check"></i> {currentTestimonial.badge}
                </span>

                <div className="t-stagger-reveal t-spotlight-stars">
                  {[...Array(currentTestimonial.stars)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
              </div>

              <div className="t-spotlight-grid">
                <div className="t-stagger-reveal t-vector-wrap">
                  {currentTestimonial.illustration}
                </div>

                <div className="t-spotlight-text">
                  <p className="t-stagger-reveal t-quote-text">
                    {currentTestimonial.quote}
                  </p>

                  <div className="t-stagger-reveal t-author-meta">
                    <h4 className="t-author-name">{currentTestimonial.role}</h4>
                    <span className="t-author-location">
                      <i className="fas fa-map-marker-alt" style={{ color: currentTestimonial.accentColor }}></i> {currentTestimonial.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Slide Nav Dots */}
              <div className="t-spotlight-nav">
                {testimonials.map((t, idx) => (
                  <button
                    key={t.id}
                    className={`t-nav-dot ${activeIndex === idx ? 'is-active' : ''}`}
                    style={{ background: activeIndex === idx ? t.accentColor : 'rgba(148, 163, 184, 0.3)' }}
                    onClick={() => setActiveIndex(idx)}
                    title={t.role}
                  ></button>
                ))}
              </div>

              <div className="t-spotlight-bottom-bar" style={{ background: currentTestimonial.accentColor }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
