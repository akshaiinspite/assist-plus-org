import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TrustCardItem {
  id: string;
  badgeText: string;
  badgeIcon: string;
  badgeClass: string;
  imageSrc: string;
  metricIconSrc: string;
  altText: string;
  targetValue: number;
  valueSuffix: string;
  valueColorClass: string;
  title: string;
  description: string;
  iconBoxClass: string;
  footerLineClass: string;
  svgIcon: React.ReactNode;
}

export const UnmatchedTrustSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const imageFrameRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State to hold counter values for smooth numeric interpolation
  const [counts, setCounts] = useState<number[]>([0, 0, 0]);

  // Data for the 3 statistics cards
  const cardsData: TrustCardItem[] = [
    {
      id: 'reviews',
      badgeText: '5-Star Rated',
      badgeIcon: 'fas fa-star',
      badgeClass: 'pill-gold',
      imageSrc: '/trust_positive_reviews.png',
      metricIconSrc: '/icon_positive_reviews.png',
      altText: '100% Positive Reviews',
      targetValue: 100,
      valueSuffix: '%',
      valueColorClass: 'val-gold',
      title: 'Positive Reviews',
      description: 'From clients and families across the UK & Ireland.',
      iconBoxClass: 'icon-reviews',
      footerLineClass: 'line-gold',
      svgIcon: (
        <svg viewBox="0 0 60 60" fill="none" className="trust-svg-icon animated-star-svg">
          <circle cx="30" cy="30" r="26" fill="url(#reviewsGrad)" opacity="0.15" />
          <circle cx="30" cy="30" r="22" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="5 3" className="rotating-outer-ring" />
          <path d="M 30 14 L 34 23 L 44 24 L 36 31 L 39 41 L 30 36 L 21 41 L 24 31 L 16 24 L 26 23 Z" fill="url(#starGoldGrad)" filter="drop-shadow(0 4px 10px rgba(245,158,11,0.4))" />
          <defs>
            <linearGradient id="reviewsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="starGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'satisfied',
      badgeText: 'Guaranteed',
      badgeIcon: 'fas fa-shield-alt',
      badgeClass: 'pill-teal',
      imageSrc: '/trust_satisfied_clients.png',
      metricIconSrc: '/icon_satisfied_clients.png',
      altText: '100% Satisfied Clients',
      targetValue: 100,
      valueSuffix: '%',
      valueColorClass: 'val-teal',
      title: 'Satisfied Clients',
      description: 'Consistently exceeding expectations through reliable, high-standard healthcare staffing.',
      iconBoxClass: 'icon-satisfied',
      footerLineClass: 'line-teal',
      svgIcon: (
        <svg viewBox="0 0 60 60" fill="none" className="trust-svg-icon animated-shield-svg">
          <circle cx="30" cy="30" r="26" fill="url(#satisfiedGrad)" opacity="0.15" />
          <path d="M 30 14 C 38 14, 44 17, 44 24 C 44 34, 35 41, 30 46 C 25 41, 16 34, 16 24 C 16 17, 22 14, 30 14 Z" fill="url(#shieldTealGrad)" stroke="#10B981" strokeWidth="2" filter="drop-shadow(0 4px 10px rgba(16,185,129,0.3))" />
          <path d="M 24 28 L 28 32 L 36 24" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="satisfiedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#0D6EFD" />
            </linearGradient>
            <linearGradient id="shieldTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      )
    },
    {
      id: 'commitment',
      badgeText: 'Est. 2024',
      badgeIcon: 'fas fa-award',
      badgeClass: 'pill-blue',
      imageSrc: '/trust_care_commitment.png',
      metricIconSrc: '/icon_care_commitment.png',
      altText: '100% Care Commitment',
      targetValue: 100,
      valueSuffix: '%',
      valueColorClass: 'val-blue',
      title: 'Care Commitment',
      description: 'Unwavering commitment to healthcare excellence, safety, and client-focused care.',
      iconBoxClass: 'icon-commitment',
      footerLineClass: 'line-blue',
      svgIcon: (
        <svg viewBox="0 0 60 60" fill="none" className="trust-svg-icon animated-medal-svg">
          <circle cx="30" cy="30" r="26" fill="url(#commitmentGrad)" opacity="0.15" />
          <path d="M 22 36 L 19 50 L 30 44 L 41 50 L 38 36" fill="url(#ribbonGrad)" />
          <circle cx="30" cy="24" r="14" fill="url(#medalGoldGrad)" stroke="#0D6EFD" strokeWidth="2.5" filter="drop-shadow(0 4px 8px rgba(13,110,253,0.3))" />
          <path d="M 30 20 C 28 17, 24 17, 24 21 C 24 26, 30 29, 30 29 C 30 29, 36 26, 36 21 C 36 17, 32 17, 30 20 Z" fill="#ffffff" className="beating-heart-path" />
          <defs>
            <linearGradient id="commitmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D6EFD" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="medalGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ];

  // 1. THREE.JS HEATHCARE PARTICLES BACKGROUND & AMBIENT GLOW
  useEffect(() => {
    if (!canvasRef.current || !sectionRef.current) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;

    let animFrameId: number;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL setup skipped:', e);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, section.clientWidth / section.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 10);

    const updateSize = () => {
      if (!section || !renderer) return;
      const w = section.clientWidth;
      const h = section.clientHeight;
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    updateSize();

    // Create custom particle texture for glowing soft circles and crosses
    const particleCount = 70;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color('#0D6EFD'), // Primary blue
      new THREE.Color('#38BDF8'), // Cyan / Light blue
      new THREE.Color('#10B981'), // Healthcare Teal
      new THREE.Color('#FFFFFF')  // Pure White
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 0.18 + 0.08;

      velocities[i * 3] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 1] = Math.random() * 0.004 + 0.002; // Upward drift
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Canvas Material
    const canvasTexture = (() => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const ctx = pCanvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.fill();
      }
      return new THREE.CanvasTexture(pCanvas);
    })();

    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      map: canvasTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Parallax & Scroll tracking
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateSize);

    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i * 3] + Math.sin(elapsedTime + i) * 0.001;
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3 + 2] += velocities[i * 3 + 2];

        // Reset particle position if drifted past upper bounds
        if (posArr[i * 3 + 1] > 6) {
          posArr[i * 3 + 1] = -6;
          posArr[i * 3] = (Math.random() - 0.5) * 16;
        }
      }
      posAttr.needsUpdate = true;

      // Parallax effect with scroll
      camera.position.y = (scrollY * 0.0005) % 2;
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateSize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  // 2. GSAP CINEMATIC ORBIT ASSEMBLY ENTRANCE + NUMBER COUNTER ANIMATION
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Circular Orbital Starting Positions for 3 cards
      const orbitOffset = isMobile ? 180 : 380;
      const initialConfigs = [
        { x: -orbitOffset, y: -240, rotation: -140 }, // Card 0 Top-Left Orbit
        { x: 0, y: orbitOffset, rotation: 160 },       // Card 1 Bottom-Center Orbit
        { x: orbitOffset, y: -240, rotation: -130 }   // Card 2 Top-Right Orbit
      ];

      // Set initial orbital state for all cards
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        const config = initialConfigs[idx] || { x: 0, y: 150, rotation: 45 };
        gsap.set(card, {
          x: config.x,
          y: config.y,
          rotation: config.rotation,
          scale: 0.68,
          opacity: 0,
          filter: 'blur(8px)',
          transformOrigin: '50% 50%'
        });
      });

      // Master Orbital Assembly Timeline on ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      });

      // Assemble cards from orbit into clean horizontal layout
      tl.to(cardsRef.current, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 2.1,
        stagger: 0.22,
        ease: 'power3.out',
        onComplete: () => {
          // Initiate Continuous Subtle Idle Floating after entrance finishes
          cardsRef.current.forEach((card, index) => {
            if (!card) return;
            gsap.to(card, {
              y: index % 2 === 0 ? -6 : 6,
              rotation: index % 2 === 0 ? 0.8 : -0.8,
              duration: 3.2 + index * 0.4,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: index * 0.15
            });
          });

          // Continuous subtle float on inner uncropped image containers
          imageFrameRefs.current.forEach((frame, idx) => {
            if (!frame) return;
            gsap.to(frame, {
              y: -4,
              duration: 2.8 + idx * 0.3,
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut'
            });
          });
        }
      });

      // Animate percentage counters from 0 -> 100 once on enter
      const counterObj = { val0: 0, val1: 0, val2: 0 };
      tl.to(
        counterObj,
        {
          val0: 100,
          val1: 100,
          val2: 100,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            setCounts([
              Math.round(counterObj.val0),
              Math.round(counterObj.val1),
              Math.round(counterObj.val2)
            ]);
          }
        },
        '-=1.6' // Start counter animation in parallel with card snapping
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="trust-section" id="trust" ref={sectionRef}>
      {/* 3D Canvas Background for Floating Healthcare Particles */}
      <canvas ref={canvasRef} className="trust-canvas-bg" />

      {/* Ambient Lighting Blobs & Light Grid */}
      <div className="trust-bg-effects">
        <div className="trust-blob trust-blob-1"></div>
        <div className="trust-blob trust-blob-2"></div>
        <div className="trust-grid-overlay"></div>
      </div>

      <div className="container relative-z">
        {/* Section Header */}
        <div className="whoweare-intro-header text-center reveal" style={{ marginBottom: '48px' }}>
          <span className="about-badge-logo">
            <i className="fas fa-award"></i> UNMATCHED TRUST &amp; EXCELLENCE
          </span>
          <h2 className="about-title-logo">Driven by 100% Quality &amp; Compassion</h2>
          <p className="about-lead-styled">
            Our unwavering dedication to clinical excellence, client satisfaction, and compassionate care defines every placement across the UK &amp; Ireland.
          </p>
        </div>

        {/* 3 Responsive Statistics Cards (Desktop Row, Tablet 2x2, Mobile Stack) */}
        <div className="trust-cards-grid">
          {cardsData.map((card, idx) => (
            <div
              key={card.id}
              ref={(el) => (cardsRef.current[idx] = el)}
              className={`trust-card trust-card-${card.id}`}
            >
              {/* Uncropped, Padded Image Container with Object-Fit Contain */}
              <div
                ref={(el) => (imageFrameRefs.current[idx] = el)}
                className="trust-card-img-frame"
              >
                <img
                  src={card.imageSrc}
                  alt={card.altText}
                  className="trust-banner-img-uncropped"
                />
                <span className={`trust-verified-pill ${card.badgeClass} trust-pill-floating`}>
                  <i className={card.badgeIcon}></i> {card.badgeText}
                </span>
              </div>

              {/* Card Header Info & Professional 3D Metric Icon Badge */}
              <div className="trust-card-top" style={{ marginTop: '20px' }}>
                <div className={`trust-icon-box ${card.iconBoxClass}`}>
                  {card.svgIcon}
                </div>
                <div className="trust-metric-badge-wrap">
                  <img
                    src={card.metricIconSrc}
                    alt={`${card.title} Icon`}
                    className="trust-metric-3d-icon"
                  />
                  <div className="trust-metric-value-pill">
                    <span className={`trust-value ${card.valueColorClass}`}>
                      {counts[idx]}{card.valueSuffix}
                    </span>
                    <i className="fas fa-check-circle trust-check-mini"></i>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="trust-card-body">
                <h3 className="trust-title">{card.title}</h3>
                <p className="trust-desc">{card.description}</p>
              </div>

              {/* Subtle Glowing Footer Accent Bar */}
              <div className={`trust-card-footer-line ${card.footerLineClass}`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
