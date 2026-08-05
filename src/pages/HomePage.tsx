import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThreeOrbitStage } from '../components/ThreeOrbitStage';
import { MissionVisionSection } from '../components/MissionVisionSection';
import { ServicesEcosystemSection } from '../components/ServicesEcosystemSection';
import { CareOrbitSection } from '../components/CareOrbitSection';
import { UnmatchedTrustSection } from '../components/UnmatchedTrustSection';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export const HomePage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = React.useState(false);

  // Wait for video to buffer its first frame, then show it — no blank screen flash
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleReady = () => {
      setVideoReady(true);
    };

    // If the video already has enough data (e.g. cached), fire immediately
    if (video.readyState >= 3) {
      handleReady();
    } else {
      video.addEventListener('canplay', handleReady);
    }

    video.muted = true;
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('canplay', handleReady);
    };
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      // Reveal animations for sections on scroll
      const reveals = pageRef.current?.querySelectorAll('.reveal');
      reveals?.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });

      // ============================================
      // INTERACTIVE MEDICAL JOURNEY ANIMATION
      // ============================================
      const journeySection = pageRef.current?.querySelector('.journey-section') as HTMLElement | null;
      const journeyPath = pageRef.current?.querySelector('.journey-svg-path') as SVGPathElement | null;
      const journeyPathGlow = pageRef.current?.querySelector('.journey-svg-path-glow') as SVGPathElement | null;
      const doctorIcon = pageRef.current?.querySelector('.journey-doctor') as HTMLElement | null;
      const journeyStops = pageRef.current?.querySelectorAll('.journey-stop') as NodeListOf<HTMLElement> | null;

      if (journeySection && journeyPath && doctorIcon && journeyStops && journeyStops.length > 0) {
        const pathLength = journeyPath.getTotalLength();

        // Set initial path state
        gsap.set(journeyPath, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        if (journeyPathGlow) {
          gsap.set(journeyPathGlow, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        }

        // Hide checkmarks initially
        journeyStops.forEach((stop) => {
          const check = stop.querySelector('.journey-check');
          if (check) gsap.set(check, { opacity: 0, scale: 0 });
        });

        gsap.set(doctorIcon, { opacity: 0, scale: 0.6 });

        const stopPositions = [0.12, 0.35, 0.58, 0.80];

        // Header reveal
        const journeyHeader = journeySection.querySelector('.whoweare-intro-header') as HTMLElement | null;
        if (journeyHeader) {
          gsap.set(journeyHeader.children, { opacity: 0, y: 25 });
        }

        // Master scrub — path draw + doctor movement + dynamic card activation
        ScrollTrigger.create({
          trigger: journeySection,
          start: 'top 75%',
          end: 'bottom 45%',
          scrub: 0.6,
          onUpdate: (self) => {
            const progress = self.progress;
            const drawOffset = pathLength * (1 - progress);
            gsap.set(journeyPath, { strokeDashoffset: drawOffset });
            if (journeyPathGlow) gsap.set(journeyPathGlow, { strokeDashoffset: drawOffset });

            // Doctor position & tilt
            if (progress > 0.005) {
              const point = journeyPath.getPointAtLength(progress * pathLength);
              const bounce = Math.sin(progress * pathLength * 0.08) * 3;
              gsap.set(doctorIcon, { x: point.x - 32, y: point.y - 58 + bounce, opacity: 1, scale: 1 });

              if (progress < 0.995) {
                const nextPoint = journeyPath.getPointAtLength(Math.min((progress + 0.01) * pathLength, pathLength));
                const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
                gsap.set(doctorIcon, { rotation: Math.max(-8, Math.min(8, angle * 0.15)) });

                // Direction arrow rotation along path curve
                const arrowEl = doctorIcon.querySelector('.doctor-direction-arrow') as HTMLElement | null;
                if (arrowEl) {
                  gsap.set(arrowEl, { rotation: angle + 45 }); // +45 deg offset for location-arrow icon
                }
              }
            }

            // DYNAMIC CARD ACTIVATION:
            // Cards only become active/colored when the doctor icon reaches their stop position
            stopPositions.forEach((pos, idx) => {
              const stop = journeyStops[idx];
              if (progress >= pos - 0.03) {
                if (!stop.classList.contains('is-active')) {
                  stop.classList.add('is-active');
                  const check = stop.querySelector('.journey-check');
                  if (check) {
                    gsap.to(check, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' });
                  }
                  const icon = stop.querySelector('.journey-stop-icon');
                  if (icon) {
                    gsap.fromTo(icon, { scale: 0.8, rotation: -10 }, { scale: 1.1, rotation: 0, duration: 0.4, ease: 'back.out(2)' });
                  }
                }
              } else {
                if (stop.classList.contains('is-active')) {
                  stop.classList.remove('is-active');
                  const check = stop.querySelector('.journey-check');
                  if (check) {
                    gsap.to(check, { opacity: 0, scale: 0, duration: 0.2 });
                  }
                }
              }
            });
          }
        });

        // Header entrance
        if (journeyHeader) {
          ScrollTrigger.create({
            trigger: journeySection, start: 'top 80%',
            onEnter: () => {
              gsap.to(journeyHeader.children, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power4.out' });
              gsap.to(doctorIcon, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' });
            },
            once: true,
          });
        }

        // Card entrance staggered reveal (subdued layout)
        journeyStops.forEach((stop, index) => {
          ScrollTrigger.create({
            trigger: journeySection,
            start: `top+=${stopPositions[index] * 100}% 80%`,
            onEnter: () => {
              gsap.fromTo(stop,
                { opacity: 0, y: 30, scale: 0.92 },
                { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
              );
            },
            once: true,
          });
        });

        // Final completion badge entrance
        const finalBadge = journeySection.querySelector('.journey-final-badge') as HTMLElement | null;
        if (finalBadge) gsap.set(finalBadge, { opacity: 0, y: 25, scale: 0.9 });

        ScrollTrigger.create({
          trigger: journeySection, start: 'bottom 45%',
          onEnter: () => {
            if (finalBadge) gsap.to(finalBadge, { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.6)' });
          },
          once: true,
        });

        // Hover interactions
        journeyStops.forEach((stop) => {
          stop.addEventListener('mouseenter', () => {
            if (stop.classList.contains('is-active')) {
              gsap.to(stop, { y: -8, boxShadow: '0 25px 55px rgba(28,111,107,0.28)', duration: 0.35, ease: 'power2.out' });
            } else {
              gsap.to(stop, { y: -4, duration: 0.35, ease: 'power2.out' });
            }
          });
          stop.addEventListener('mouseleave', () => {
            gsap.to(stop, { y: 0, boxShadow: stop.classList.contains('is-active') ? '0 16px 45px rgba(28, 111, 107, 0.22)' : '0 8px 24px rgba(0,0,0,0.03)', duration: 0.35, ease: 'power2.out' });
          });
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="home-page">
      {/* HERO SECTION */}
      <section className="hero" id="home">
        {/* Full-Cover Background Video — hidden until first frame is buffered */}
        <video
          ref={videoRef}
          className="hero-video-bg"
          style={{ opacity: videoReady ? 1 : 0, transition: 'opacity 0.4s ease' }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/Nurse_holding_hands_elderly_woman_202607211104.mp4" type="video/mp4" />
        </video>

        {/* Dark Gradient Overlay for High Contrast & Professional Aesthetics */}
        <div className="hero-video-overlay"></div>

        {/* Watermark Shadow Mask to Cover Gemini Icon in Corner */}
        <div className="hero-video-watermark-mask"></div>

        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fas fa-shield-alt" style={{ color: '#7ce3db' }}></i> CQC Compliant &amp; DBS Checked • Est. 2024
            </div>
            {/* HERO HEADING BRAND IMAGE */}
            <div className="hero-heading-box">
              <h1 className="hero-main-title-img-wrap">
                <img 
                  src="/hero_title_image.png" 
                  alt="Assist Plus Care — Building Teams to Care" 
                  className="hero-title-img" 
                />
              </h1>
            </div>
            <p className="hero-lead">
              Trusted healthcare staffing provider supplying compassionate, fully vetted nurses, carers, and support workers to care facilities across the UK &amp; Ireland.
            </p>

            <div className="hero-btns">
              <Link to="/quote" className="btn btn-accent btn-glow">Request Staff Now <i className="fas fa-arrow-right"></i></Link>
              <a href="#services" className="btn btn-outline-white">Our Services</a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>Est. 2024</strong>
                <span>Trusted Staffing</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <strong>UK &amp; Ireland</strong>
                <span>Full Coverage</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <strong>24/7</strong>
                <span>Emergency Cover</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STAFFING SOLUTIONS MARQUEE TICKER */}
      <div className="marquee-banner">
        <div className="marquee-label">
          <span><i className="fas fa-user-nurse"></i> STAFFING SOLUTIONS</span>
        </div>
        <div className="marquee-track-container">
          <div className="marquee-track">
            {/* Loop 1 */}
            <div className="marquee-item">
              <i className="fas fa-user-md marquee-icon-img" style={{ color: '#7ce3db', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>Registered Nurses</strong>
                <span>Clinical Care Support</span>
              </div>
            </div>

            <div className="marquee-item highlight-specialist">
              <i className="fas fa-brain marquee-icon-img" style={{ color: '#ff9e9e', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>Registered Mental Health Nurses</strong>
                <span>Psychological &amp; Crisis Support</span>
              </div>
            </div>

            <div className="marquee-item">
              <i className="fas fa-hands-helping marquee-icon-img" style={{ color: '#7ce3db', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>Healthcare Assistants</strong>
                <span>HCAs Daily Care &amp; Mobility</span>
              </div>
            </div>

            <div className="marquee-item highlight-livein">
              <i className="fas fa-house-user marquee-icon-img" style={{ color: '#67e8f9', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>Live in Carers</strong>
                <span>24/7 Home Support</span>
              </div>
            </div>

            <div className="marquee-item">
              <i className="fas fa-clinic-medical marquee-icon-img" style={{ color: '#7ce3db', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>Specialist Nursing Services</strong>
              </div>
            </div>

            <div className="marquee-item highlight-specialist">
              <i className="fas fa-bolt marquee-icon-img" style={{ color: '#facc15', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>24/7 Emergency Cover</strong>
                <span>Immediate Urgent Support</span>
              </div>
            </div>

            {/* Loop 2 (Duplicate for smooth infinite scroll) */}
            <div className="marquee-item">
              <i className="fas fa-user-md marquee-icon-img" style={{ color: '#7ce3db', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>Registered Nurses</strong>
                <span>Clinical Care Support</span>
              </div>
            </div>

            <div className="marquee-item highlight-specialist">
              <i className="fas fa-brain marquee-icon-img" style={{ color: '#ff9e9e', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>Registered Mental Health Nurses</strong>
                <span>Psychological &amp; Crisis Support</span>
              </div>
            </div>

            <div className="marquee-item">
              <i className="fas fa-hands-helping marquee-icon-img" style={{ color: '#7ce3db', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>Healthcare Assistants</strong>
                <span>HCAs Daily Care &amp; Mobility</span>
              </div>
            </div>

            <div className="marquee-item highlight-livein">
              <i className="fas fa-house-user marquee-icon-img" style={{ color: '#67e8f9', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>Live in Carers</strong>
                <span>24/7 Home Support</span>
              </div>
            </div>

            <div className="marquee-item">
              <i className="fas fa-clinic-medical marquee-icon-img" style={{ color: '#7ce3db', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>Specialist Nursing Services</strong>
              </div>
            </div>

            <div className="marquee-item highlight-specialist">
              <i className="fas fa-bolt marquee-icon-img" style={{ color: '#facc15', fontSize: '1.2rem' }}></i>
              <div className="marquee-text">
                <strong>24/7 Emergency Cover</strong>
                <span>Immediate Urgent Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* GSAP MISSION & VISION STORYTELLING SECTION   */}
      {/* ============================================ */}
      <MissionVisionSection />

      {/* ============================================ */}
      {/* INTERACTIVE MEDICAL JOURNEY - WHO WE ARE     */}
      {/* ============================================ */}
      <section className="journey-section" id="about">
        <div className="container">
          <div className="whoweare-intro-header text-center reveal">
            <span className="about-badge-logo">
              <i className="fas fa-shield-heart"></i> ABOUT US — EST. 2024
            </span>
            <h2 className="about-title-logo">
              Assist Plus Care UK — <span className="highlight-tagline">Building Teams to Care</span>
            </h2>
            <p className="about-lead-styled">
              Assist Plus Care UK is a leading healthcare staffing agency dedicated to delivering safe, compassionate, and professional care through highly skilled staff. Since our establishment in 2024, we have become a trusted partner for organisations across the UK and Ireland, known for our <strong className="text-teal">reliability, professionalism, and person-centred approach</strong>.
            </p>
          </div>

          <div className="journey-roadmap">
            {/* SVG Curved Roadmap Path */}
            <svg className="journey-svg" viewBox="0 0 1000 2300" fill="none" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(28,111,107,0.15)" />
                  <stop offset="50%" stopColor="rgba(28,111,107,0.5)" />
                  <stop offset="100%" stopColor="rgba(28,111,107,0.3)" />
                </linearGradient>
                <linearGradient id="pathGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(28,111,107,0.0)" />
                  <stop offset="50%" stopColor="rgba(28,111,107,0.35)" />
                  <stop offset="100%" stopColor="rgba(28,111,107,0.0)" />
                </linearGradient>
              </defs>
              <path d="M 200 60 C 200 240, 800 240, 800 480 C 800 680, 200 680, 200 880 C 200 1080, 800 1080, 800 1280 C 800 1560, 500 1650, 500 1850" stroke="rgba(28,111,107,0.08)" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path className="journey-svg-path-glow" d="M 200 60 C 200 240, 800 240, 800 480 C 800 680, 200 680, 200 880 C 200 1080, 800 1080, 800 1280 C 800 1560, 500 1650, 500 1850" stroke="url(#pathGlow)" strokeWidth="12" fill="none" strokeLinecap="round" />
              <path className="journey-svg-path" d="M 200 60 C 200 240, 800 240, 800 480 C 800 680, 200 680, 200 880 C 200 1080, 800 1080, 800 1280 C 800 1560, 500 1650, 500 1850" stroke="url(#pathGrad)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            </svg>

            {/* Doctor Icon — follows the path with direction arrow & pulse aura */}
            <div className="journey-doctor">
              <div className="doctor-pulse-ring"></div>
              <div className="doctor-avatar-wrap">
                <img src="/doctor_journey_icon.png" alt="Doctor Guide" />
              </div>
              <div className="doctor-direction-arrow">
                <i className="fas fa-location-arrow"></i>
              </div>
              <div className="doctor-glow"></div>
            </div>

            {/* STOP 1 — CQC (Left) */}
            <div className="journey-stop stop-left stop-1">
              <div className="journey-check"><i className="fas fa-check-circle"></i></div>
              <div className="journey-stop-icon"><i className="fas fa-shield-alt"></i></div>
              <div className="journey-stop-number">01</div>
              <div className="whoweare-card-image-wrapper"><img src="/care qulaity comission.jpg" alt="CQC Compliant Standards" className="whoweare-card-image" /></div>
              <div className="whoweare-card-body">
                <span className="whoweare-card-label"><i className="fas fa-shield-alt"></i> QUALITY ASSURANCE</span>
                <h3 className="whoweare-card-heading">CQC Compliant Standards</h3>
                <p className="whoweare-card-desc">Meeting top UK healthcare guidelines with regular clinical audits, policy alignment, and continuous compliance monitoring.</p>
              </div>
            </div>

            {/* STOP 2 — DBS (Right) */}
            <div className="journey-stop stop-right stop-2">
              <div className="journey-check"><i className="fas fa-check-circle"></i></div>
              <div className="journey-stop-icon"><i className="fas fa-id-card"></i></div>
              <div className="journey-stop-number">02</div>
              <div className="whoweare-card-image-wrapper"><img src="/dbs checked.png" alt="DBS Checked Staff" className="whoweare-card-image" /></div>
              <div className="whoweare-card-body">
                <span className="whoweare-card-label"><i className="fas fa-id-card"></i> VETTING &amp; SAFETY</span>
                <h3 className="whoweare-card-heading">DBS Checked Staff</h3>
                <p className="whoweare-card-desc">Rigorously vetted nursing, care, and support professionals with enhanced background checks and identity verification.</p>
              </div>
            </div>

            {/* STOP 3 — 24/7 (Left) */}
            <div className="journey-stop stop-left stop-3">
              <div className="journey-check"><i className="fas fa-check-circle"></i></div>
              <div className="journey-stop-icon"><i className="fas fa-headset"></i></div>
              <div className="journey-stop-number">03</div>
              <div className="whoweare-card-image-wrapper"><img src="/support.jpg" alt="24/7 On-Call Support" className="whoweare-card-image" /></div>
              <div className="whoweare-card-body">
                <span className="whoweare-card-label"><i className="fas fa-headset"></i> 24/7 AVAILABILITY</span>
                <h3 className="whoweare-card-heading">24/7 On-Call Support</h3>
                <p className="whoweare-card-desc">Round-the-clock staffing assistance and emergency care dispatch across hospitals, care homes, and private clients.</p>
              </div>
            </div>

            {/* STOP 4 — Insured (Right) */}
            <div className="journey-stop stop-right stop-4">
              <div className="journey-check"><i className="fas fa-check-circle"></i></div>
              <div className="journey-stop-icon"><i className="fas fa-file-contract"></i></div>
              <div className="journey-stop-number">04</div>
              <div className="whoweare-card-image-wrapper"><img src="/fully insured.jpg" alt="Fully Insured Service" className="whoweare-card-image" /></div>
              <div className="whoweare-card-body">
                <span className="whoweare-card-label"><i className="fas fa-file-contract"></i> PEACE OF MIND</span>
                <h3 className="whoweare-card-heading">Fully Insured Service</h3>
                <p className="whoweare-card-desc">Comprehensive liability insurance coverage and quality guarantee for healthcare providers, families, and facilities.</p>
              </div>
            </div>

            {/* Final Destination Badge */}
            <div className="journey-final-badge">
              <i className="fas fa-heart-pulse"></i>
              <strong>Healthcare Journey Complete</strong>
              <span>Quality care, every step of the way.</span>
              <Link to="/quote" className="btn btn-primary btn-glow">Request Your Care Plan <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>
        </div>
      </section>

      {/* IMMERSIVE GSAP SERVICES ECOSYSTEM SECTION */}
      <ServicesEcosystemSection />

      {/* INTERACTIVE HEALTHCARE CARE ORBIT SECTION */}
      <CareOrbitSection />

      {/* MODERN UNMATCHED TRUST & METRICS SECTION WITH GSAP ORBIT ASSEMBLY & THREE.JS PARTICLES */}
      <UnmatchedTrustSection />

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="faq-section" id="faq">
        <div className="container">
          <div className="whoweare-intro-header text-center reveal" style={{ marginBottom: '40px' }}>
            <span className="about-badge-logo">
              <i className="fas fa-question-circle"></i> FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="about-title-logo">Got Questions? We Have Answers</h2>
            <p className="about-lead-styled">
              Everything you need to know about our healthcare staffing and specialist nursing services across the UK.
            </p>
          </div>

          <div className="faq-accordion-grid reveal">
            {/* FAQ 1 */}
            <details className="faq-card">
              <summary className="faq-summary">
                <div className="faq-question-wrap">
                  <i className="fas fa-globe-uk faq-icon"></i>
                  <span>Do you cover all regions across the UK and Ireland?</span>
                </div>
                <i className="fas fa-chevron-down faq-arrow"></i>
              </summary>
              <div className="faq-answer">
                <p>
                  Yes, we supply healthcare staff across all regions of the UK and Ireland for nursing homes, care homes, hospitals, mental health units, and private clients.
                </p>
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="faq-card">
              <summary className="faq-summary">
                <div className="faq-question-wrap">
                  <i className="fas fa-user-check faq-icon"></i>
                  <span>Are your healthcare staff fully vetted and compliant?</span>
                </div>
                <i className="fas fa-chevron-down faq-arrow"></i>
              </summary>
              <div className="faq-answer">
                <p>
                  All staff undergo enhanced DBS checks, reference checks, right to work verification, and clinical competency assessments before placement.
                </p>
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="faq-card">
              <summary className="faq-summary">
                <div className="faq-question-wrap">
                  <i className="fas fa-notes-medical faq-icon"></i>
                  <span>Do you provide specialist clinical care?</span>
                </div>
                <i className="fas fa-chevron-down faq-arrow"></i>
              </summary>
              <div className="faq-answer">
                <p>
                  Yes — including stoma &amp; colostomy care, palliative care, diabetes monitoring, podiatry services, and complex neurological support.
                </p>
              </div>
            </details>

            {/* FAQ 4 */}
            <details className="faq-card">
              <summary className="faq-summary">
                <div className="faq-question-wrap">
                  <i className="fas fa-bolt faq-icon"></i>
                  <span>Can you provide urgent or short-notice emergency cover?</span>
                </div>
                <i className="fas fa-chevron-down faq-arrow"></i>
              </summary>
              <div className="faq-answer">
                <p>
                  Yes, our dedicated on-call staffing team operates 24/7 to provide immediate response for urgent cover and unexpected shortages.
                </p>
              </div>
            </details>

            {/* FAQ 5 */}
            <details className="faq-card">
              <summary className="faq-summary">
                <div className="faq-question-wrap">
                  <i className="fas fa-tags faq-icon"></i>
                  <span>Do you offer competitive pricing and price matching?</span>
                </div>
                <i className="fas fa-chevron-down faq-arrow"></i>
              </summary>
              <div className="faq-answer">
                <p>
                  We offer transparent, competitive rates for both long-term and temporary staffing, backed by our price match commitment for comparable services.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* PREMIUM CTA BANNER */}
      <section className="cta-banner-section" id="cta-banner">
        <div className="cta-banner-bg">
          <img src="/healthcare_trust_banner.png" alt="" className="cta-banner-bg-img" />
          <div className="cta-banner-overlay"></div>
          <div className="cta-banner-particles">
            <span className="cta-particle cta-p1"></span>
            <span className="cta-particle cta-p2"></span>
            <span className="cta-particle cta-p3"></span>
            <span className="cta-particle cta-p4"></span>
            <span className="cta-particle cta-p5"></span>
          </div>
        </div>
        <div className="container relative-z">
          <div className="cta-banner-content reveal">
            <span className="cta-banner-badge">
              <i className="fas fa-headset"></i> 24/7 STAFFING HOTLINE
            </span>
            <h2 className="cta-banner-title">
              Need Skilled Healthcare Staff<br />or Emergency Cover?
            </h2>
            <p className="cta-banner-desc">
              Let Assist Plus Care UK help you build strong, reliable care teams. Contact our 24/7 team today for a personalised quote.
            </p>
            <div className="cta-banner-btns">
              <Link to="/quote" className="btn btn-white cta-quote-btn">
                Request Staff Quote <i className="fas fa-arrow-right"></i>
              </Link>
              <a href="tel:02036526052" className="btn cta-call-btn">
                <i className="fas fa-phone"></i> Call 020 3652 6052
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
