import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import * as THREE from 'three';
import { WorkforceSpectrumSection } from '../components/WorkforceSpectrumSection';
import { HeroBrandThreeBg } from '../components/HeroBrandThreeBg';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Healthcare Professional Panel Data ─── */
interface ProfessionalPanel {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  image: string;
  color: string;
  desc: string;
  responsibilities: string[];
  suitableFor: string[];
}

const professionalsData: ProfessionalPanel[] = [
  {
    id: 'rn',
    title: 'Registered Nurses (RN)',
    subtitle: 'Safe, Evidence-Based Clinical Care',
    badge: 'Clinical Care',
    icon: 'fas fa-user-nurse',
    image: '/rn_nurse_3d.png',
    color: 'linear-gradient(135deg, #1C6F6B, #14524F)',
    desc: 'Our Registered Nurses provide safe, evidence-based clinical care across a variety of healthcare environments. They work closely with multidisciplinary teams to ensure patients receive high-quality treatment while maintaining accurate documentation and professional standards.',
    responsibilities: [
      'Medication administration & IV therapy',
      'Comprehensive clinical assessments',
      'Care planning & evaluation',
      'Wound management & dressing care',
      'Vital signs & patient monitoring',
      'Meticulous clinical documentation'
    ],
    suitableFor: ['Nursing Homes', 'Private Hospitals', 'Residential Care Facilities', 'Rehabilitation Centres']
  },
  {
    id: 'mhn',
    title: 'Mental Health Nurses (RMN)',
    subtitle: 'Compassionate Mental Wellbeing & Recovery',
    badge: 'Specialist Recovery',
    icon: 'fas fa-brain',
    image: '/mental_health_3d.png',
    color: 'linear-gradient(135deg, #6366f1, #4338ca)',
    desc: 'Our Mental Health Nurses support individuals experiencing a wide range of mental health conditions, delivering compassionate care while promoting emotional wellbeing, safety, and recovery.',
    responsibilities: [
      'Mental health risk assessments',
      'Behavioral support & de-escalation',
      'Crisis intervention & management',
      'Therapeutic emotional support',
      'Care planning & multi-agency liaison',
      'Medication management for RMN care'
    ],
    suitableFor: ['Mental Health Units', 'Secure Facilities', 'Community Services', 'Supported Living']
  },
  {
    id: 'hca',
    title: 'Healthcare Assistants (HCAs)',
    subtitle: 'Dignity, Independence & Personal Support',
    badge: 'Essential Care',
    icon: 'fas fa-hands-holding-child',
    image: '/hca_assistant_3d.png',
    color: 'linear-gradient(135deg, #0891b2, #0e7490)',
    desc: 'Healthcare Assistants play a vital role in supporting residents with everyday activities while encouraging dignity, independence, personal hygiene, and daily comfort.',
    responsibilities: [
      'Personal care & hygiene assistance',
      'Assistance with mobility & transfers',
      'Nutrition, feeding & hydration support',
      'Monitoring routine observations',
      'Daily living assistance & companionship',
      'Promoting resident dignity & respect'
    ],
    suitableFor: ['Residential Care Homes', 'Nursing Homes', 'Community Care', 'Hospices']
  },
  {
    id: 'sw',
    title: 'Support Workers',
    subtitle: 'Empowering Independent Living & Community Access',
    badge: 'Community & Independence',
    icon: 'fas fa-people-roof',
    image: '/support_worker_3d.png',
    color: 'linear-gradient(135deg, #2F4F56, #1a3a40)',
    desc: 'Our Support Workers provide practical assistance and emotional encouragement to individuals requiring help with independent living, community integration, and social engagement.',
    responsibilities: [
      'Daily living & household skills support',
      'Community access & social activities',
      'Emotional wellbeing & confidence building',
      'Positive behavior support plans',
      'Life skills training & independence',
      'Personalised care routine management'
    ],
    suitableFor: ['Supported Living', 'Community Services', 'Learning Disability Care', 'Day Care Centres']
  },
  {
    id: 'livein',
    title: 'Live-in Carers',
    subtitle: 'Continuous One-to-One Home Care Support',
    badge: 'Home Care',
    icon: 'fas fa-house-user',
    image: '/live_in_carer_3d.png',
    color: 'linear-gradient(135deg, #059669, #047857)',
    desc: 'Our Live-in Carers provide continuous one-to-one care within the comfort of an individual’s own home, helping clients remain independent while receiving dedicated, personalised support.',
    responsibilities: [
      '24/7 personal care & hygiene support',
      'Medication prompting & reminders',
      'Fresh meal preparation & shopping',
      'Light housekeeping & laundry',
      'Companionship & emotional support',
      'Overnight assistance & safety monitor'
    ],
    suitableFor: ['Private Domiciliary Care', 'Palliative Home Support', 'Post-Hospital Discharge', 'Elderly Independence']
  },
  {
    id: 'specialist',
    title: 'Specialist Nursing Services',
    subtitle: 'Advanced Clinical & Complex Care',
    badge: 'Complex Nursing',
    icon: 'fas fa-heart-circle-bolt',
    image: '/specialist_nurse_3d.png',
    color: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    desc: 'For individuals requiring advanced clinical support, our specialist healthcare professionals deliver tailored care based on complex medical needs and specialist clinical protocols.',
    responsibilities: [
      'Stoma & colostomy care management',
      'Tracheostomy & catheter care',
      'Palliative & end-of-life specialist care',
      'Diabetes management & insulin therapy',
      'Pressure area & complex wound care',
      'Podiatry & complex physical care'
    ],
    suitableFor: ['Specialist Units', 'Complex Home Care', 'Hospices', 'Private Hospitals']
  }
];

export const ServicesPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);

  const [activePanel, setActivePanel] = useState<string>('rn');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useTransform(mouseX, (v) => v - 200);
  const glowY = useTransform(mouseY, (v) => v - 200);

  /* ─── Cursor Tracking ─── */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  /* ─── Hero Particle Canvas Effect ─── */
  useEffect(() => {
    if (!heroCanvasRef.current) return;
    const canvas = heroCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.3 + 0.05
      });
    }

    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 227, 219, ${p.alpha})`;
        ctx.fill();
      });
    };
    render();

    return () => cancelAnimationFrame(animId);
  }, []);

  /* ─── Magnetic Hover for CTA Button ─── */
  useEffect(() => {
    const btn = ctaBtnRef.current;
    if (!btn) return;
    const onMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: 'power2.out' });
    };
    const onMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    };
    btn.addEventListener('mousemove', onMouseMove);
    btn.addEventListener('mouseleave', onMouseLeave);
    return () => {
      btn.removeEventListener('mousemove', onMouseMove);
      btn.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  /* ─── GSAP ScrollTrigger Animations ─── */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!pageRef.current) return;

    const ctx = gsap.context(() => {
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      /* HERO TIMELINE */
      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1 },
        scrollTrigger: { trigger: '.srv-hero-section', start: 'top 80%' }
      });

      if (!isReducedMotion) {
        heroTl.fromTo('.srv-hero-badge',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 }, 0.2
        )
        .fromTo('.srv-hero-heading-line',
          { y: 40, opacity: 0, filter: 'blur(10px)' },
          { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' }, 0.35
        )
        .fromTo('.srv-hero-desc',
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 }, '-=0.4'
        )
        .fromTo('.srv-hero-btn',
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.15, ease: 'back.out(1.6)' }, '-=0.3'
        )
        .fromTo('.srv-hero-img-wrap',
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.4, ease: 'power3.inOut' }, 0.4
        );

        // Continuous Hero Parallax
        gsap.to('.srv-hero-img', {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: '.srv-hero-section', start: 'top top', end: 'bottom top', scrub: true }
        });
      }

      /* INTRODUCTION SECTION */
      gsap.fromTo('.srv-intro-img-wrap',
        { scale: 1.15, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: '.srv-intro-section', start: 'top 75%' }
        }
      );

      /* TIMELINE SECTION SVG LINE DRAW */
      const srvLinePath = pageRef.current?.querySelector('.srv-timeline-svg-path') as SVGPathElement | null;
      if (srvLinePath) {
        const len = srvLinePath.getTotalLength();
        gsap.set(srvLinePath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(srvLinePath, {
          strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut',
          scrollTrigger: { trigger: '.srv-overview-section', start: 'top 70%' }
        });
      }

      /* FLEXIBLE STAFFING CARDS STAGGER */
      gsap.fromTo('.srv-flex-card',
        { opacity: 0, y: 60, scale: 0.94 },
        {
          opacity: 1, y: 0, scale: 1, stagger: 0.14, duration: 0.9, ease: 'power4.out',
          scrollTrigger: { trigger: '.srv-flex-section', start: 'top 75%' }
        }
      );

      /* HEALTHCARE SETTINGS GRID REVEAL */
      gsap.fromTo('.srv-setting-card',
        { opacity: 0, y: 40, rotateX: -15 },
        {
          opacity: 1, y: 0, rotateX: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.srv-settings-section', start: 'top 75%' }
        }
      );

      /* MATCHING PROCESS VERTICAL LINE GROW & DOCTOR MOVEMENT THROUGH DIV NUMBERS */
      gsap.fromTo('.srv-process-line-progress',
        { height: '0%' },
        {
          height: '100%', ease: 'none',
          scrollTrigger: {
            trigger: '.srv-process-section',
            start: 'top 65%',
            end: 'bottom 65%',
            scrub: 0.3,
            onUpdate: (self) => {
              const p = self.progress;
              const doctorEl = document.querySelector('.srv-process-doctor') as HTMLElement | null;
              const timelineEl = document.querySelector('.srv-process-timeline') as HTMLElement | null;
              const stepEls = document.querySelectorAll('.srv-process-step');

              if (doctorEl && timelineEl && stepEls.length > 0) {
                const timelineRect = timelineEl.getBoundingClientRect();
                const firstStep = stepEls[0] as HTMLElement;
                const lastStep = stepEls[stepEls.length - 1] as HTMLElement;

                const firstCircle = firstStep.querySelector('.srv-step-number') as HTMLElement | null;
                const lastCircle = lastStep.querySelector('.srv-step-number') as HTMLElement | null;

                if (firstCircle && lastCircle) {
                  const startY = (firstCircle.getBoundingClientRect().top + firstCircle.getBoundingClientRect().height / 2) - timelineRect.top;
                  const endY = (lastCircle.getBoundingClientRect().top + lastCircle.getBoundingClientRect().height / 2) - timelineRect.top;

                  const currentY = startY + p * (endY - startY);
                  gsap.set(doctorEl, { y: currentY, opacity: 1 });

                  // Dynamic rotation tilt
                  const bounce = Math.sin(p * Math.PI * 4) * 2;
                  gsap.set(doctorEl, { rotation: bounce * 3 });

                  // Activate step number circle when doctor arrives at its Y center
                  stepEls.forEach((step) => {
                    const circle = step.querySelector('.srv-step-number') as HTMLElement | null;
                    if (circle) {
                      const circleY = (circle.getBoundingClientRect().top + circle.getBoundingClientRect().height / 2) - timelineRect.top;
                      if (Math.abs(currentY - circleY) < 35) {
                        circle.classList.add('is-active');
                      } else {
                        circle.classList.remove('is-active');
                      }
                    }
                  });
                }
              }
            }
          }
        }
      );

      /* FREQUENT SUPPORT PILLS STAGGER */
      gsap.fromTo('.srv-support-pill',
        { opacity: 0, scale: 0.85, y: 20 },
        {
          opacity: 1, scale: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'back.out(1.5)',
          scrollTrigger: { trigger: '.srv-support-section', start: 'top 80%' }
        }
      );

    }, pageRef);

    return () => ctx.revert();
  }, []);

  /* ─── Split Text Helper ─── */
  const splitWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="hero-word-wrap">
        <span className="hero-word">
          {word === 'Healthcare' || word === 'Staffing' || word === 'Care' || word === 'Setting' ? (
            <span className="about-highlight">{word}</span>
          ) : (
            word
          )}
        </span>
      </span>
    ));
  };

  /* ─── Healthcare Settings Data ─── */
  const settingsData = [
    { icon: 'fas fa-house-medical', title: 'Nursing Homes', desc: 'Expert clinical nursing & personal care support.' },
    { icon: 'fas fa-home', title: 'Residential Care', desc: 'Compassionate daily living & personal care.' },
    { icon: 'fas fa-people-roof', title: 'Supported Living', desc: 'Promoting community access & independent life.' },
    { icon: 'fas fa-brain', title: 'Mental Health Facilities', desc: 'Qualified RMNs for therapeutic care & safety.' },
    { icon: 'fas fa-hospital', title: 'Private Hospitals', desc: 'Dependable surgical, acute & ward nursing.' },
    { icon: 'fas fa-hand-holding-heart', title: 'Hospice & Palliative', desc: 'Sensitive end-of-life care with dignity.' },
    { icon: 'fas fa-wheelchair', title: 'Rehabilitation Centres', desc: 'Restorative therapy & mobility recovery.' },
    { icon: 'fas fa-user-doctor', title: 'Community Services', desc: 'Flexible domiciliary & local healthcare support.' }
  ];

  /* ─── Why Choose Features ─── */
  const whyFeatures = [
    { icon: 'fas fa-clock-rotate-left', title: 'Responsive Service', desc: 'Fast turnaround times for planned bookings and urgent emergency requests.' },
    { icon: 'fas fa-calendar-days', title: 'Flexible Workforce', desc: 'Staff available for single shifts, weekends, ongoing contracts, and block bookings.' },
    { icon: 'fas fa-user-shield', title: 'Experienced Professionals', desc: 'Qualified, fully vetted healthcare workers dedicated to clinical excellence.' },
    { icon: 'fas fa-comments-dollar', title: 'Transparent Communication', desc: 'Dedicated consultants who keep you informed throughout every stage of placement.' },
    { icon: 'fas fa-sliders', title: 'Tailored Solutions', desc: 'Staffing plans customized to suit the unique operational requirements of your care setting.' }
  ];

  /* ─── Frequently Requested Support Items ─── */
  const shiftTypes = [
    { icon: 'fas fa-umbrella-beach', title: 'Holiday Cover' },
    { icon: 'fas fa-calendar-week', title: 'Weekend Shifts' },
    { icon: 'fas fa-moon', title: 'Night Shifts' },
    { icon: 'fas fa-truck-medical', title: 'Emergency Absences' },
    { icon: 'fas fa-chart-line', title: 'Planned Workforce Expansion' },
    { icon: 'fas fa-stethoscope', title: 'Specialist Clinical Support' },
    { icon: 'fas fa-user-clock', title: 'Long-Term Placements' },
    { icon: 'fas fa-building-user', title: 'Multiple Site Coverage' }
  ];

  return (
    <div ref={pageRef} className="services-page">
      {/* Ambient Cursor Glow */}
      <motion.div className="about-cursor-glow" style={{ x: glowX, y: glowY }} />

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 1 — HERO BANNER                    */}
      {/* ═══════════════════════════════════════════ */}
      <section className="srv-hero-section">
        <HeroBrandThreeBg />
        <div className="about-hero-overlay"></div>

        <div className="container srv-hero-grid">
          <div className="srv-hero-text">
            <div className="about-eyebrow-container srv-hero-badge">
              <span className="about-eyebrow-line"></span>
              <div className="about-hero-badge">
                <i className="fas fa-hand-holding-medical" style={{ color: '#7ce3db' }}></i> OUR SERVICES &amp; WORKFORCE SOLUTIONS
              </div>
            </div>

            <h1 className="about-hero-heading srv-hero-heading">
              <span className="srv-hero-heading-line">{splitWords('Healthcare Staffing Solutions')}</span>
              <span className="srv-hero-heading-sub">Professional Healthcare Staff, Tailored to Your Care Setting</span>
            </h1>

            <p className="srv-hero-desc">
              Assist Plus Care UK delivers flexible healthcare staffing solutions to organisations across the UK and Ireland. Whether you require emergency cover, temporary placements, or long-term workforce support, we provide qualified professionals who integrate seamlessly into your team and uphold the highest standards of care.
            </p>

            <div className="about-hero-btns srv-hero-btns">
              <Link to="/quote" className="btn btn-accent btn-glow srv-hero-btn">
                Request Staff <i className="fas fa-arrow-right"></i>
              </Link>
              <a href="tel:02036526052" className="btn btn-outline-white srv-hero-btn">
                <i className="fas fa-phone"></i> Speak to Our Team
              </a>
            </div>
          </div>

          <div className="srv-hero-img-wrap">
            <img src="/about_hero_image.png" alt="Healthcare Staffing Solutions" className="srv-hero-img" />
            <div className="srv-hero-img-badge">
              <i className="fas fa-award"></i>
              <div>
                <strong>CQC &amp; DBS Vetted</strong>
                <span>24/7 Rapid Staffing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 2 — INTRODUCTION                   */}
      {/* ═══════════════════════════════════════════ */}
      <section className="srv-intro-section about-reveal">
        <div className="container">
          <div className="srv-intro-grid">
            <div className="srv-intro-img-col">
              <div className="srv-intro-img-wrap">
                <img src="/about_approach_image.png" alt="Tailored Staffing" className="srv-intro-img" />
                <div className="srv-intro-quote-card">
                  <i className="fas fa-quote-left srv-quote-icon"></i>
                  <p>"Dependable staffing that helps maintain continuity of care without compromising clinical quality."</p>
                </div>
              </div>
            </div>
            <div className="srv-intro-text">
              <span className="about-section-badge"><i className="fas fa-sliders"></i> TAILORED CARE SUPPORT</span>
              <h2>Staffing Solutions Designed Around <span className="about-highlight">Your Needs</span></h2>
              <p>Every healthcare organisation operates differently, which is why our staffing solutions are tailored to meet your specific operational and clinical requirements.</p>
              <p>Whether you require a single healthcare professional for one shift or a complete team for ongoing support, we provide dependable staffing that helps maintain continuity of care without compromising quality.</p>
              <div className="srv-intro-pills">
                <div className="srv-intro-pill"><i className="fas fa-circle-check"></i> Single shift to full team support</div>
                <div className="srv-intro-pill"><i className="fas fa-circle-check"></i> Tailored to clinical requirements</div>
                <div className="srv-intro-pill"><i className="fas fa-circle-check"></i> Zero compromise on care quality</div>
                <div className="srv-intro-pill"><i className="fas fa-circle-check"></i> 24/7 dedicated account team</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 3 — WORKFORCE SPECTRUM (INTERACTIVE) */}
      {/* ═══════════════════════════════════════════ */}
      <WorkforceSpectrumSection />

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 4 — HEALTHCARE PROFESSIONALS       */}
      {/* ═══════════════════════════════════════════ */}
      <section className="srv-pro-section about-reveal" id="professionals-section">
        <div className="container">
          <div className="about-section-header text-center">
            <span className="about-section-badge"><i className="fas fa-user-doctor"></i> OUR HEALTHCARE PROFESSIONALS</span>
            <h2>Skilled Practitioners For <span className="about-highlight">Every Discipline</span></h2>
            <p className="about-section-sub">Explore our range of qualified clinical and support staff. Click any panel to view responsibilities and care settings.</p>
          </div>

          <div className="srv-pro-accordion">
            {professionalsData.map((pro) => {
              const isOpen = activePanel === pro.id;
              return (
                <div key={pro.id} className={`srv-pro-panel ${isOpen ? 'active' : ''}`} onClick={() => setActivePanel(pro.id)}>
                  <div className="srv-pro-header">
                    <div className="srv-pro-header-left">
                      <div className="srv-pro-icon" style={{ background: pro.color }}>
                        <i className={pro.icon}></i>
                      </div>
                      <div>
                        <span className="srv-pro-badge">{pro.badge}</span>
                        <h3>{pro.title}</h3>
                        <p className="srv-pro-sub">{pro.subtitle}</p>
                      </div>
                    </div>
                    <div className="srv-pro-toggle">
                      <i className={`fas ${isOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                    </div>
                  </div>

                  {isOpen && (
                    <motion.div 
                      className="srv-pro-body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                      <div className="srv-pro-body-top">
                        <div className="srv-pro-img-wrap">
                          <img src={pro.image} alt={pro.title} className="srv-pro-img" />
                        </div>
                        <p className="srv-pro-desc">{pro.desc}</p>
                      </div>
                      <div className="srv-pro-details-grid">
                        <div className="srv-pro-col">
                          <h4><i className="fas fa-list-check" style={{ color: 'var(--primary)' }}></i> Typical Responsibilities</h4>
                          <ul className="srv-pro-list">
                            {pro.responsibilities.map((res, idx) => (
                              <li key={idx}><i className="fas fa-check-circle"></i> {res}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="srv-pro-col">
                          <h4><i className="fas fa-hospital" style={{ color: 'var(--primary)' }}></i> Suitable Care Settings</h4>
                          <div className="srv-pro-tags">
                            {pro.suitableFor.map((setting, idx) => (
                              <span key={idx} className="srv-pro-tag"><i className="fas fa-building"></i> {setting}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 5 — FLEXIBLE STAFFING OPTIONS      */}
      {/* ═══════════════════════════════════════════ */}
      <section className="srv-flex-section about-reveal">
        <div className="container">
          <div className="about-section-header text-center">
            <span className="about-section-badge"><i className="fas fa-clock"></i> FLEXIBLE ENGAGEMENTS</span>
            <h2>Staffing Options Tailored to <span className="about-highlight">Your Pace</span></h2>
            <p className="about-section-sub">Choose the engagement model that best aligns with your care setting's operational demands.</p>
          </div>

          <div className="srv-flex-grid">
            <div className="srv-flex-card">
              <div className="srv-flex-card-img"><img src="/temporary_booking_3d.png" alt="Temporary Staffing" /></div>
              <div className="srv-flex-card-icon" style={{ background: 'linear-gradient(135deg, #1C6F6B, #14524F)' }}><i className="fas fa-bolt"></i></div>
              <h3>Temporary Staffing</h3>
              <p>Ideal for sickness cover, annual leave, unexpected absences, and sudden seasonal demand.</p>
              <div className="srv-flex-footer"><span>24/7 Availability</span><i className="fas fa-arrow-right"></i></div>
            </div>

            <div className="srv-flex-card">
              <div className="srv-flex-card-img"><img src="/care-personal.png" alt="Long-Term Placements" /></div>
              <div className="srv-flex-card-icon" style={{ background: 'linear-gradient(135deg, #2F4F56, #1a3a40)' }}><i className="fas fa-calendar-days"></i></div>
              <h3>Long-Term Placements</h3>
              <p>Reliable professionals available for extended assignments, parental leave, and ongoing workforce stability.</p>
              <div className="srv-flex-footer"><span>Consistent Staffing</span><i className="fas fa-arrow-right"></i></div>
            </div>

            <div className="srv-flex-card">
              <div className="srv-flex-card-img"><img src="/about-team.png" alt="Block Bookings" /></div>
              <div className="srv-flex-card-icon" style={{ background: 'linear-gradient(135deg, #0891b2, #0e7490)' }}><i className="fas fa-layer-group"></i></div>
              <h3>Block &amp; Bulk Bookings</h3>
              <p>Efficient staffing solutions for providers requiring multiple professionals across several shifts or sites.</p>
              <div className="srv-flex-footer"><span>Cost-Effective</span><i className="fas fa-arrow-right"></i></div>
            </div>

            <div className="srv-flex-card">
              <div className="srv-flex-card-img"><img src="/emergency_cover_3d.png" alt="Emergency Staffing" /></div>
              <div className="srv-flex-card-icon" style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}><i className="fas fa-truck-medical"></i></div>
              <h3>Emergency Staffing</h3>
              <p>Rapid deployment of qualified healthcare professionals for urgent short-notice requirements, day or night.</p>
              <div className="srv-flex-footer"><span>Under 2 Hour Dispatch</span><i className="fas fa-arrow-right"></i></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 6 — HEALTHCARE SETTINGS WE SUPPORT  */}
      {/* ═══════════════════════════════════════════ */}
      <section className="srv-settings-section about-reveal">
        <div className="container">
          <div className="about-section-header text-center">
            <span className="about-section-badge"><i className="fas fa-building-circle-check"></i> CARE ENVIRONMENTS</span>
            <h2>Healthcare Settings We <span className="about-highlight">Proudly Support</span></h2>
            <p className="about-section-sub">Our vetted professionals integrate seamlessly into diverse clinical and residential environments.</p>
          </div>

          <div className="srv-settings-grid">
            {settingsData.map((st, i) => (
              <div key={i} className="srv-setting-card">
                <div className="srv-setting-icon"><i className={st.icon}></i></div>
                <h4>{st.title}</h4>
                <p>{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 7 — STAFF MATCHING PROCESS          */}
      {/* ═══════════════════════════════════════════ */}
      <section className="srv-process-section about-reveal" id="staff-matching-process">
        <div className="container">
          <div className="about-section-header text-center">
            <span className="about-section-badge"><i className="fas fa-route"></i> STEP-BY-STEP PROCESS</span>
            <h2>How We Match The <span className="about-highlight">Right Staff</span></h2>
            <p className="about-section-sub">Our rigorous matching framework guarantees safety, compliance, and clinical compatibility.</p>
          </div>

          <div className="srv-process-timeline">
            <div className="srv-process-line-bg">
              <div className="srv-process-line-progress"></div>
            </div>

            {/* Traveling Doctor Icon overlay along timeline */}
            <div className="srv-process-doctor">
              <div className="srv-doctor-pulse"></div>
              <div className="srv-doctor-avatar">
                <img src="/doctor_journey_icon.png" alt="Doctor Guide" />
              </div>
            </div>

            <div className="srv-process-step about-reveal">
              <div className="srv-step-number">01</div>
              <div className="srv-step-card">
                <div className="srv-step-content">
                  <h3>Understanding Your Requirements</h3>
                  <p>We thoroughly assess your staffing needs, required clinical qualifications, shift patterns, and care environment specifics.</p>
                </div>
                <div className="srv-step-img"><img src="/whoweare_oncall_support.png" alt="Requirements Assessment" /></div>
              </div>
            </div>

            <div className="srv-process-step about-reveal">
              <div className="srv-step-number">02</div>
              <div className="srv-step-card">
                <div className="srv-step-content">
                  <h3>Precision Staff Selection</h3>
                  <p>Suitable healthcare professionals are identified based on clinical experience, location, availability, and care values.</p>
                </div>
                <div className="srv-step-img"><img src="/whoweare_dbs_staff.png" alt="Staff Selection" /></div>
              </div>
            </div>

            <div className="srv-process-step about-reveal">
              <div className="srv-step-number">03</div>
              <div className="srv-step-card">
                <div className="srv-step-content">
                  <h3>Compliance &amp; DBS Verification</h3>
                  <p>Before every placement, mandatory credentials, CQC standards, right-to-work, and DBS clearance are re-verified.</p>
                </div>
                <div className="srv-step-img"><img src="/whoweare_cqc_standards.png" alt="Compliance Verification" /></div>
              </div>
            </div>

            <div className="srv-process-step about-reveal">
              <div className="srv-step-number">04</div>
              <div className="srv-step-card">
                <div className="srv-step-content">
                  <h3>Placement &amp; 24/7 Ongoing Support</h3>
                  <p>Our professionals arrive ready to integrate into your team, backed by continuous account management support.</p>
                </div>
                <div className="srv-step-img"><img src="/whoweare_fully_insured.png" alt="Ongoing Support" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 8 — WHY CHOOSE OUR SERVICES        */}
      {/* ═══════════════════════════════════════════ */}
      <section className="srv-why-section about-reveal">
        <div className="container">
          <div className="srv-why-grid">
            <div className="srv-why-highlight-col">
              <div className="srv-why-highlight-card">
                <span className="about-section-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                  <i className="fas fa-award"></i> WHY ASSIST PLUS
                </span>
                <h3>Built on Trust. Driven by Clinical Excellence.</h3>
                <p>We don't just fill rotas; we build reliable, long-term workforce partnerships that protect patient safety and care continuity.</p>
                <div className="srv-why-card-img">
                  <img src="/healthcare_trust_banner.png" alt="Trusted Healthcare Staffing" />
                </div>
                <div className="srv-why-stat">
                  <strong>98%</strong>
                  <span>On-Time Shift Fulfillment Rate</span>
                </div>
              </div>
            </div>

            <div className="srv-why-features-col">
              {whyFeatures.map((feat, i) => (
                <div key={i} className="srv-why-feat-item">
                  <div className="srv-why-feat-icon"><i className={feat.icon}></i></div>
                  <div>
                    <h4>{feat.title}</h4>
                    <p>{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 9 — FREQUENTLY REQUESTED SUPPORT    */}
      {/* ═══════════════════════════════════════════ */}
      <section className="srv-support-section about-reveal">
        <div className="container">
          <div className="srv-support-layout">
            <div className="srv-support-text-col">
              <div className="about-section-header">
                <span className="about-section-badge"><i className="fas fa-hand-holding-medical"></i> FREQUENTLY REQUESTED</span>
                <h2>Common Staffing <span className="about-highlight">Support Scenarios</span></h2>
                <p className="about-section-sub">We regularly assist healthcare providers with specialized cover requirements.</p>
              </div>

              <div className="srv-support-pills-grid">
                {shiftTypes.map((st, i) => (
                  <div key={i} className="srv-support-pill">
                    <i className={st.icon}></i>
                    <span>{st.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="srv-support-img-col">
              <div className="srv-support-img-wrap">
                <img src="/care-respite.png" alt="Healthcare Support" className="srv-support-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 10 — OUR COMMITMENT TO EVERY CARE   */}
      {/* ═══════════════════════════════════════════ */}
      <section className="srv-commitment-section about-reveal">
        <div className="container">
          <div className="srv-commitment-grid">
            <div className="srv-commitment-text">
              <span className="about-section-badge"><i className="fas fa-heart-pulse"></i> OUR COMMITMENT</span>
              <h2>Dedicated to Quality in <span className="about-highlight">Every Placement</span></h2>
              <p>Every member of staff supplied by Assist Plus Care UK represents our commitment to professionalism, compassion, and reliability.</p>
              <p>We understand the importance of maintaining continuity of care and work diligently to ensure every placement contributes positively to both your team and those receiving care.</p>
              <div className="srv-commitment-box">
                <i className="fas fa-shield-check"></i>
                <div>
                  <strong>CQC &amp; DBS Compliant Staffing</strong>
                  <span>Rigorous clinical audits and ongoing professional development.</span>
                </div>
              </div>
            </div>

            <div className="srv-commitment-img-col">
              <div className="srv-commitment-img-wrap">
                <img src="/about_journey_image.png" alt="Our Commitment to Care" className="srv-commitment-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 11 — FINAL CALL TO ACTION          */}
      {/* ═══════════════════════════════════════════ */}
      <section className="about-cta-section srv-cta-section">
        <div className="about-cta-overlay"></div>
        <div className="container text-center">
          <div className="about-cta-badge">
            <i className="fas fa-handshake" style={{ color: '#7ce3db' }}></i> PARTNER WITH ASSIST PLUS
          </div>
          <h2 className="about-cta-title">Ready to Strengthen Your <span className="about-highlight">Healthcare Team?</span></h2>
          <p className="about-cta-desc">Partner with Assist Plus Care UK for flexible, dependable, and professional healthcare staffing solutions tailored to your organisation's needs.</p>
          <div className="about-cta-btns">
            <Link to="/quote" ref={ctaBtnRef} className="btn btn-accent btn-glow about-magnetic-cta">
              Request Staff <i className="fas fa-arrow-right"></i>
            </Link>
            <a href="tel:02036526052" className="btn btn-outline-white about-magnetic-cta">
              <i className="fas fa-phone"></i> Contact Our Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
