import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProcessStep {
  id: string;
  stepNum: string;
  badge: string;
  title: string;
  desc: string;
  imgSrc: string;
  accentColor: string;
}

export const StaffMatchingProcessSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const pathGlowRef = useRef<SVGPathElement | null>(null);
  const doctorRef = useRef<HTMLDivElement | null>(null);

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const steps: ProcessStep[] = [
    {
      id: 'step-1',
      stepNum: '01',
      badge: 'Requirements Assessment',
      title: 'Understanding Your Requirements',
      desc: 'We thoroughly assess your staffing needs, required clinical qualifications, shift patterns, and care environment specifics.',
      imgSrc: '/whoweare_oncall_support.png',
      accentColor: '#1C6F6B'
    },
    {
      id: 'step-2',
      stepNum: '02',
      badge: 'Staff Selection',
      title: 'Precision Staff Selection',
      desc: 'Suitable healthcare professionals are identified based on clinical experience, location, availability, and care values.',
      imgSrc: '/whoweare_dbs_staff.png',
      accentColor: '#0EA5E9'
    },
    {
      id: 'step-3',
      stepNum: '03',
      badge: 'Compliance Verification',
      title: 'Compliance & DBS Verification',
      desc: 'Before every placement, mandatory credentials, CQC standards, right-to-work, and DBS clearance are re-verified.',
      imgSrc: '/whoweare_cqc_standards.png',
      accentColor: '#D7262E'
    },
    {
      id: 'step-4',
      stepNum: '04',
      badge: 'Ongoing Support',
      title: 'Placement & 24/7 Ongoing Support',
      desc: 'Our professionals arrive ready to integrate into your team, backed by continuous account management support.',
      imgSrc: '/whoweare_fully_insured.png',
      accentColor: '#10B981'
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

      // Initial doctor position
      gsap.set(doctor, { opacity: 0, scale: 0.7 });

      // ScrollTrigger scroll scrub animation
      ScrollTrigger.create({
        trigger: section,
        start: 'top 65%',
        end: 'bottom 45%',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const drawOffset = pathLength * (1 - progress);

          gsap.set(path, { strokeDashoffset: drawOffset });
          if (pathGlow) gsap.set(pathGlow, { strokeDashoffset: drawOffset });

          if (progress > 0.01) {
            const point = path.getPointAtLength(progress * pathLength);
            const bounce = Math.sin(progress * pathLength * 0.08) * 3;

            gsap.set(doctor, {
              x: point.x - 30,
              y: point.y - 45 + bounce,
              opacity: 1,
              scale: 1
            });

            if (progress < 0.99) {
              const nextPoint = path.getPointAtLength(Math.min((progress + 0.01) * pathLength, pathLength));
              const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
              gsap.set(doctor, { rotation: Math.max(-10, Math.min(10, angle * 0.15)) });
            }
          } else {
            gsap.set(doctor, { opacity: 0 });
          }

          // Active Step Glow logic based on doctor progress
          let currentStep = 0;
          if (progress >= 0.75) {
            currentStep = 3;
          } else if (progress >= 0.50) {
            currentStep = 2;
          } else if (progress >= 0.25) {
            currentStep = 1;
          } else {
            currentStep = 0;
          }

          setActiveStepIndex(currentStep);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="matching-process-section" ref={sectionRef} id="staff-matching-process">
      <div className="container relative-z">
        {/* Header */}
        <div className="process-header text-center reveal">
          <span className="process-badge">
            <i className="fas fa-route"></i> STEP-BY-STEP PROCESS
          </span>
          <h2 className="process-title">
            How We Match The <span className="highlight-gradient">Right Staff</span>
          </h2>
          <p className="process-subtitle">
            Our rigorous matching framework guarantees safety, compliance, and clinical compatibility.
          </p>
        </div>

        {/* Process Roadmap Container */}
        <div className="process-roadmap-container">
          {/* Connecting SVG Path */}
          <svg className="process-svg-path-guide" viewBox="0 0 1000 1500" fill="none" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="processGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1C6F6B" stopOpacity="0.8" />
                <stop offset="33%" stopColor="#0EA5E9" stopOpacity="0.8" />
                <stop offset="66%" stopColor="#D7262E" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="processGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(28,111,107,0.4)" />
                <stop offset="33%" stopColor="rgba(14,165,233,0.4)" />
                <stop offset="66%" stopColor="rgba(215,38,46,0.4)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0.4)" />
              </linearGradient>
            </defs>
            <path
              d="M 500 40 L 500 400 L 500 760 L 500 1120 L 500 1450"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="4"
              strokeDasharray="8 6"
            />
            <path
              ref={pathGlowRef}
              d="M 500 40 L 500 400 L 500 760 L 500 1120 L 500 1450"
              stroke="url(#processGlow)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <path
              ref={pathRef}
              d="M 500 40 L 500 400 L 500 760 L 500 1120 L 500 1450"
              stroke="url(#processGrad)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Traveling Doctor Tracker */}
          <div className="process-doctor-tracker" ref={doctorRef}>
            <div className="process-doctor-pulse"></div>
            <div className="process-doctor-avatar">
              <img src="/doctor_journey_icon.png" alt="Doctor Guide" />
            </div>
            <div className="process-doctor-tooltip">
              <i className="fas fa-user-md"></i> Step {steps[activeStepIndex]?.stepNum}
            </div>
          </div>

          {/* The 4 Process Cards */}
          <div className="process-cards-grid">
            {steps.map((st, idx) => {
              const isGlowing = activeStepIndex === idx;
              return (
                <div
                  key={st.id}
                  className={`process-step-card ${isGlowing ? 'is-glowing-active' : ''}`}
                  style={{ '--accent-color': st.accentColor } as React.CSSProperties}
                >
                  <div className="process-step-header">
                    <div className="process-step-num">{st.stepNum}</div>
                    <span className="process-step-badge">
                      <i className="fas fa-shield-check"></i> {st.badge}
                    </span>
                  </div>

                  <div className="process-step-main">
                    <div className="process-step-content">
                      <h3 className="process-step-title">{st.title}</h3>
                      <p className="process-step-desc">{st.desc}</p>
                    </div>

                    <div className="process-step-media">
                      <div className="process-img-wrap">
                        <img src={st.imgSrc} alt={st.title} className="process-img" />
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
