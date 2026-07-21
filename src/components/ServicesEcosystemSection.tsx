import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceStory {
  id: number;
  num: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  ctaText: string;
  ctaLink: string;
  accentColor: string;
  bgGradient: string;
  image: string;
}

export const ServicesEcosystemSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  // 8 High-Fidelity Healthcare Services with generated 3D illustrations
  const services: ServiceStory[] = [
    {
      id: 0,
      num: '01',
      category: 'Clinical Excellence',
      title: 'Registered Nurses (RNs)',
      subtitle: 'Safe, Evidence-Based NHS & Private Clinical Staffing',
      description: 'Our Registered Nurses deliver exceptional clinical care across NHS hospitals, private clinics, and residential care settings. Experienced in complex medication administration, clinical audits, wound management, and emergency interventions.',
      tags: ['Medication Administration', 'Wound Management', 'Care Planning', 'NMC Registered'],
      ctaText: 'Book Registered Nurses',
      ctaLink: '/quote',
      accentColor: '#0EA5E9',
      bgGradient: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
      image: '/rn_nurse_3d.png'
    },
    {
      id: 1,
      num: '02',
      category: 'Psychological Support',
      title: 'Mental Health Nurses',
      subtitle: 'Compassionate Complex Psychological Care & Crisis Support',
      description: 'Specialised psychiatric and mental health nurses providing therapeutic intervention, behavioral support, and emotional wellness management in secure units, care facilities, and community care settings.',
      tags: ['Behavioral Support', 'Risk Assessment', 'Crisis Intervention', 'Emotional Wellbeing'],
      ctaText: 'Request Mental Health Nurses',
      ctaLink: '/quote',
      accentColor: '#1C6F6B',
      bgGradient: 'radial-gradient(circle, rgba(28, 111, 107, 0.18) 0%, transparent 70%)',
      image: '/mental_health_3d.png'
    },
    {
      id: 2,
      num: '03',
      category: 'Person-Centred Support',
      title: 'Healthcare Assistants (HCAs)',
      subtitle: 'Dignified Daily Living & Personal Care Assistance',
      description: 'Fully vetted HCAs offering compassionate assistance with personal hygiene, nutrition, mobility support, and vital signs monitoring across care homes, hospitals, and assisted living environments.',
      tags: ['Personal Hygiene', 'Mobility Assistance', 'Vital Signs Audit', 'Nutritional Care'],
      ctaText: 'Hire Healthcare Assistants',
      ctaLink: '/quote',
      accentColor: '#84CC16',
      bgGradient: 'radial-gradient(circle, rgba(132, 204, 22, 0.18) 0%, transparent 70%)',
      image: '/hca_assistant_3d.png'
    },
    {
      id: 3,
      num: '04',
      category: '24/7 Domiciliary Care',
      title: 'Live-in Carers',
      subtitle: 'Round-the-Clock Home Independence & Companionship',
      description: 'Dedicated live-in carers providing 24-hour peace of mind in the comfort of home. Combining personal care, meal preparation, housekeeping, companionship, and medication reminders.',
      tags: ['24/7 Home Presence', 'Companionship', 'Housekeeping', 'Medication Prompts'],
      ctaText: 'Request Live-in Carers',
      ctaLink: '/quote',
      accentColor: '#8B5CF6',
      bgGradient: 'radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, transparent 70%)',
      image: '/live_in_carer_3d.png'
    },
    {
      id: 4,
      num: '05',
      category: 'Supported Living',
      title: 'Support Workers',
      subtitle: 'Community Integration & Independence Staffing',
      description: 'Experienced support workers empowering individuals with learning disabilities, physical impairments, or mental health challenges to achieve active community participation and personal independence.',
      tags: ['Supported Living', 'Community Access', 'Life Skills Coaching', '24/7 Rotas'],
      ctaText: 'Book Support Workers',
      ctaLink: '/quote',
      accentColor: '#F59E0B',
      bgGradient: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%)',
      image: '/support_worker_3d.png'
    },
    {
      id: 5,
      num: '06',
      category: 'Specialist Clinical',
      title: 'Specialist Nursing',
      subtitle: 'Advanced Clinical Care for Complex Health Needs',
      description: 'Highly trained specialist nurses proficient in tracheostomy care, stoma and colostomy management, PEG feeding, diabetes monitoring, palliative end-of-life care, and complex neurological conditions.',
      tags: ['Stoma & Colostomy', 'PEG Feeding', 'Palliative Care', 'Diabetes Audit'],
      ctaText: 'Hire Specialist Nurses',
      ctaLink: '/quote',
      accentColor: '#EC4899',
      bgGradient: 'radial-gradient(circle, rgba(236, 72, 153, 0.18) 0%, transparent 70%)',
      image: '/specialist_nurse_3d.png'
    },
    {
      id: 6,
      num: '07',
      category: 'Facility Management',
      title: 'Temporary & Bulk Bookings',
      subtitle: 'Scalable Staffing Rota Solutions for NHS & Care Groups',
      description: 'Streamlined bulk and temporary staffing contracts for care home chains, NHS trusts, and private hospitals needing dependable shift coverage, block bookings, or rapid capacity scaling.',
      tags: ['Block Bookings', 'Rota Coverage', 'Facility Scaling', 'Volume Discounts'],
      ctaText: 'Arrange Bulk Staffing',
      ctaLink: '/quote',
      accentColor: '#06B6D4',
      bgGradient: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, transparent 70%)',
      image: '/temporary_booking_3d.png'
    },
    {
      id: 7,
      num: '08',
      category: '24/7 Rapid Response',
      title: '24/7 Emergency Cover',
      subtitle: 'Immediate Round-the-Clock Shift Dispatch Within 60 Minutes',
      description: 'Urgent staffing dispatch operating 24 hours a day, 365 days a year. Our emergency response team quickly fulfills short-notice sickness cover, sudden surges, and critical clinical gaps.',
      tags: ['60-Min Dispatch', '24/7 Hotline', 'Zero Shortage', 'Fully Vetted'],
      ctaText: 'Request Emergency Staff',
      ctaLink: '/quote',
      accentColor: '#F43F5E',
      bgGradient: 'radial-gradient(circle, rgba(244, 63, 94, 0.22) 0%, transparent 70%)',
      image: '/emergency_cover_3d.png'
    }
  ];

  const currentService = services[activeIndex];

  // GSAP ScrollTrigger Storytelling Pin Setup
  useEffect(() => {
    if (!sectionRef.current || !pinContainerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${services.length * 700}`,
        pin: pinContainerRef.current,
        scrub: 0.8,
        onUpdate: (self) => {
          const step = Math.min(
            services.length - 1,
            Math.floor(self.progress * services.length)
          );
          setActiveIndex(step);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [services.length]);

  // GSAP Entrance animation on active service change
  useEffect(() => {
    if (!leftColRef.current || !rightColRef.current) return;

    gsap.fromTo(
      leftColRef.current,
      { opacity: 0, scale: 0.88, rotateY: -10 },
      { opacity: 1, scale: 1, rotateY: 0, duration: 0.55, ease: 'back.out(1.4)' }
    );

    const textEls = rightColRef.current.querySelectorAll('.story-reveal');
    gsap.fromTo(
      textEls,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }
    );
  }, [activeIndex]);

  // Mouse 3D Parallax Tilt Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!leftColRef.current) return;
    const rect = leftColRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(leftColRef.current, {
      rotationY: x * 0.03,
      rotationX: -y * 0.03,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    if (!leftColRef.current) return;
    gsap.to(leftColRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.6,
      ease: 'power3.out'
    });
  };

  return (
    <section className="services-story-section" id="services" ref={sectionRef}>
      <div
        className="services-story-pin-container"
        ref={pinContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Dynamic Gradient Blobs & Pulse Grid */}
        <div className="story-bg-layer">
          <div
            className="story-bg-blob"
            style={{ background: currentService.bgGradient }}
          ></div>
          <div className="story-grid-mesh"></div>
        </div>

        <div className="container relative-z full-height-container">
          {/* Main 2-Column Product Storytelling Grid */}
          <div className="story-main-grid">
            {/* LEFT SIDE (40%): 3D Vector Healthcare Illustration Stage */}
            <div className="story-left-col">
              <div className="story-illustration-card" ref={leftColRef}>
                <div
                  className="illustration-accent-badge"
                  style={{ background: currentService.accentColor }}
                >
                  <i className="fas fa-stethoscope"></i> Assist Plus Healthcare
                </div>
                <div className="illustration-svg-wrap">
                  <img
                    src={currentService.image}
                    alt={currentService.title}
                    className="service-story-img-asset"
                  />
                </div>
                <div className="illustration-step-indicator">
                  <span>Service {currentService.num} of 08</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE (60%): Service Content Details */}
            <div className="story-right-col" ref={rightColRef}>
              <div className="story-reveal story-category-badge" style={{ color: currentService.accentColor }}>
                <i className="fas fa-sparkles"></i> {currentService.category}
              </div>

              <h2 className="story-reveal story-title">
                {currentService.title}
              </h2>

              <h4 className="story-reveal story-subtitle">
                {currentService.subtitle}
              </h4>

              <p className="story-reveal story-desc">
                {currentService.description}
              </p>

              {/* Feature Pill Tags */}
              <div className="story-reveal story-tags-flex">
                {currentService.tags.map((tag, idx) => (
                  <span key={idx} className="story-tag-pill">
                    <i className="fas fa-check-circle" style={{ color: currentService.accentColor }}></i> {tag}
                  </span>
                ))}
              </div>

              {/* Action CTA & Slide Controls */}
              <div className="story-reveal story-actions">
                <Link
                  to={currentService.ctaLink}
                  className="btn btn-primary story-cta-btn"
                  style={{ background: currentService.accentColor, borderColor: currentService.accentColor }}
                >
                  {currentService.ctaText} <i className="fas fa-arrow-right"></i>
                </Link>

                <div className="story-nav-buttons">
                  <button
                    className="story-nav-btn"
                    onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                    disabled={activeIndex === 0}
                    title="Previous Service"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button
                    className="story-nav-btn"
                    onClick={() => setActiveIndex((prev) => Math.min(services.length - 1, prev + 1))}
                    disabled={activeIndex === services.length - 1}
                    title="Next Service"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LEFT EDGE VERTICAL PROGRESS INDICATOR */}
          <div className="story-vertical-progress-bar">
            {services.map((srv, idx) => {
              const isActive = activeIndex === idx;
              const isCompleted = activeIndex > idx;
              return (
                <button
                  key={srv.id}
                  className={`progress-num-btn ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                  title={srv.title}
                >
                  <span className="progress-num">{srv.num}</span>
                  {isCompleted && <i className="fas fa-check progress-check"></i>}
                  {isActive && <div className="progress-glow-ring" style={{ background: srv.accentColor }}></div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
