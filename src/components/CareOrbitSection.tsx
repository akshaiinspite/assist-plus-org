import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface OrbitStep {
  id: number;
  stepNum: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  badge: string;
  nodeBg: string;
  glowColor: string;
  iconClass: string;
  positionClass: string;
  imageSrc: string;
  illustration?: React.ReactNode;
}

export const CareOrbitSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const orbitWheelRef = useRef<HTMLDivElement>(null);
  const orbitSpinRef = useRef<HTMLDivElement>(null);
  const centerHubRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // 4 Radial Orbit Steps matching the reference design layout
  const steps: OrbitStep[] = [
    {
      id: 0,
      stepNum: '01',
      title: 'Free Consultation',
      subtitle: 'Zero-Obligation Dialogue',
      description: 'Reach out for a confidential chat about your care staffing requirements, clinical rotas, or emergency cover needs.',
      ctaText: 'Schedule Consultation',
      ctaLink: '/quote',
      badge: '24/7 Available',
      nodeBg: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
      glowColor: '#0EA5E9',
      iconClass: 'fas fa-headset',
      positionClass: 'pos-top',
      imageSrc: '/journey_step1_consultation.png'
    },
    {
      id: 1,
      stepNum: '02',
      title: 'Care Assessment',
      subtitle: 'Clinical Audit & Vetting',
      description: 'Our clinical specialists conduct a rigorous assessment to understand patient care plans, staff competencies, and compliance needs.',
      ctaText: 'Explore Assessment',
      ctaLink: '/quote',
      badge: 'CQC Compliant',
      nodeBg: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
      glowColor: '#84CC16',
      iconClass: 'fas fa-notes-medical',
      positionClass: 'pos-right',
      imageSrc: '/journey_step2_assessment.png'
    },
    {
      id: 2,
      stepNum: '03',
      title: 'Personalised Plan',
      subtitle: 'Bespoke Rota & Pricing',
      description: 'We craft a custom care plan and staffing strategy with transparent rates, shift guarantees, and exact clinical matching.',
      ctaText: 'Request Custom Plan',
      ctaLink: '/quote',
      badge: 'Transparent Rates',
      nodeBg: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
      glowColor: '#8B5CF6',
      iconClass: 'fas fa-sliders-h',
      positionClass: 'pos-bottom',
      imageSrc: '/journey_step3_plan.png'
    },
    {
      id: 3,
      stepNum: '04',
      title: 'Care Begins',
      subtitle: 'Seamless Staff Placement',
      description: 'Fully vetted, compassionate healthcare professionals arrive on site, backed by round-the-clock administrative support.',
      ctaText: 'Request Staff Now',
      ctaLink: '/quote',
      badge: '100% Insured',
      nodeBg: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
      glowColor: '#F43F5E',
      iconClass: 'fas fa-user-check',
      positionClass: 'pos-left',
      imageSrc: '/journey_step4_begins.png'
    }
  ];

  const currentStep = steps[activeIndex];

  // Auto-rotate active step every 4.2s unless hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [isHovered, steps.length]);

  // GSAP Animation when active index changes
  useEffect(() => {
    if (!activeCardRef.current) return;
    gsap.fromTo(
      activeCardRef.current,
      { opacity: 0, y: 15, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' }
    );
  }, [activeIndex]);

  // Scroll reveal animation for orbit stage
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (orbitWheelRef.current) {
        gsap.fromTo(
          orbitWheelRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%'
            }
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      className="care-orbit-section"
      id="how"
      ref={sectionRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Lighting & Radial Grid */}
      <div className="orbit-bg-container">
        <div className="orbit-blob orbit-blob-1"></div>
        <div className="orbit-blob orbit-blob-2"></div>
        <div className="orbit-grid-pattern"></div>
      </div>

      <div className="container relative-z">
        {/* Header */}
        <div className="whoweare-intro-header text-center reveal" style={{ marginBottom: '32px' }}>
          <span className="about-badge-logo">
            <i className="fas fa-route"></i> OUR PROCESS
          </span>
          <h2 className="about-title-logo">Interactive Healthcare Journey</h2>
          <p className="about-lead-styled">
            Explore how Assist Plus Care UK delivers seamless healthcare staffing from initial consultation to 24/7 care placement.
          </p>
        </div>

        <div className="radial-orbit-layout">
          {/* Circular Orbit Wheel matching reference image */}
          <div className="orbit-wheel-container" ref={orbitWheelRef}>
            <div className="orbit-wheel" ref={orbitSpinRef}>
              {/* Outer SVG Ring Track */}
              <svg className="orbit-wheel-svg" viewBox="0 0 480 480" fill="none">
                <circle cx="240" cy="240" r="185" stroke="rgba(13, 110, 253, 0.2)" strokeWidth="3" strokeDasharray="8 8" />
                <circle cx="240" cy="240" r="185" stroke="url(#wheelGrad)" strokeWidth="2.5" opacity="0.75" />
                <defs>
                  <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0EA5E9" />
                    <stop offset="33%" stopColor="#84CC16" />
                    <stop offset="66%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#F43F5E" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Central Hub Circle with Large Header Logo */}
              <div className="orbit-center-hub-circle" ref={centerHubRef}>
                <div className="center-hub-inner" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
                  <img
                    src="/logo (3).png"
                    alt="Assist Plus Care UK Logo"
                    style={{ maxHeight: '120px', maxWidth: '155px', width: '100%', height: 'auto', objectFit: 'contain', display: 'block' }}
                  />
                </div>
              </div>

              {/* 4 Radial Circular Nodes */}
              {steps.map((step, idx) => {
                const isActive = activeIndex === idx;
                return (
                  <button
                    key={step.id}
                    ref={(el) => (nodeRefs.current[idx] = el)}
                    className={`radial-node-btn ${step.positionClass} ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveIndex(idx)}
                    onTouchStart={() => setActiveIndex(idx)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    style={{ background: step.nodeBg }}
                    title={step.title}
                  >
                    <span className="node-num-pill">{step.stepNum}</span>
                    <i className={`${step.iconClass} node-icon`}></i>
                    <span className="node-tooltip-label">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Step Details Panel (Spacious, No Collapsing) */}
          <div className="orbit-active-panel-wrap">
            <div className="orbit-active-card" ref={activeCardRef}>
              <div className="active-card-top-bar">
                <div className="active-step-badge" style={{ background: currentStep.nodeBg }}>
                  <span>Step {currentStep.stepNum}</span>
                </div>
                <span className="active-chip-badge">{currentStep.badge}</span>
              </div>

              <div className="active-card-content-grid">
                <div className="active-card-image-container">
                  <div className="active-card-img-wrapper">
                    <img src={currentStep.imageSrc} alt={currentStep.title} className="active-card-img" />
                    <div className="active-card-step-tag" style={{ background: currentStep.nodeBg }}>
                      <i className={`${currentStep.iconClass} me-1`}></i> Step {currentStep.stepNum}
                    </div>
                  </div>
                </div>

                <div className="active-card-text">
                  <span className="active-subtitle">{currentStep.subtitle}</span>
                  <h3 className="active-title">{currentStep.title}</h3>
                  <p className="active-desc">{currentStep.description}</p>

                  <div className="active-cta-wrap">
                    <Link to={currentStep.ctaLink} className="btn btn-primary active-btn">
                      {currentStep.ctaText} <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Auto Progress Bar */}
              <div className="active-progress-bar">
                <div className="active-progress-fill" key={activeIndex}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
