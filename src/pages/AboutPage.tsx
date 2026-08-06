import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useTransform, useInView } from 'framer-motion';
import * as THREE from 'three';
import { HeroBrandThreeBg } from '../components/HeroBrandThreeBg';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─── Animated Counter Component ─── */
const AnimatedCounter: React.FC<{ target: string; label: string; icon: string }> = ({ target, label, icon }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);
  const numericTarget = parseInt(target.replace(/\D/g, ''), 10) || 0;

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(numericTarget / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= numericTarget) { setCount(numericTarget); clearInterval(timer); }
      else { setCount(start); }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericTarget]);

  const suffix = target.replace(/[0-9]/g, '');

  return (
    <motion.div
      ref={ref}
      className="about-stat-card"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <div className="about-stat-icon"><i className={icon}></i></div>
      <strong>{count}{suffix}</strong>
      <span>{label}</span>
    </motion.div>
  );
};

/* ─── Industry Card Component ─── */
const IndustryCard: React.FC<{ icon: string; title: string; desc: string; index: number; color: string }> = ({ icon, title, desc, index, color }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className="about-industry-card"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(28,111,107,0.18)' }}
    >
      <div className="about-industry-icon" style={{ background: color }}>
        <i className={icon}></i>
      </div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </motion.div>
  );
};

/* ─── Main About Page Component ─── */
export const AboutPage: React.FC = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const indCanvasRef = useRef<HTMLCanvasElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);

  /* ─── Industries Particle Canvas Effect ─── */
  useEffect(() => {
    if (!indCanvasRef.current) return;
    const canvas = indCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.25 + 0.05
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
        ctx.fillStyle = `rgba(28, 111, 107, ${p.alpha})`;
        ctx.fill();
      });
    };
    render();

    return () => cancelAnimationFrame(animId);
  }, []);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useTransform(mouseX, (v) => v - 200);
  const glowY = useTransform(mouseY, (v) => v - 200);

  /* ─── Mouse Move Handler for Cursor Glow ─── */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  /* ─── Three.js Floating Particles Background ─── */
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;

    let animFrameId: number;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(parent.clientWidth, parent.clientHeight);
    } catch { return; }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, parent.clientWidth / parent.clientHeight, 0.1, 100);
    camera.position.z = 5;

    // Create floating particles
    const particleCount = 80;
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      velocities.push((Math.random() - 0.5) * 0.003, (Math.random() - 0.5) * 0.003, (Math.random() - 0.5) * 0.002);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: 0x1c6f6b, size: 0.06, transparent: true, opacity: 0.35 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Connection lines
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x1c6f6b, transparent: true, opacity: 0.06 });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    let mouseXNorm = 0, mouseYNorm = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseXNorm = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseYNorm = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const posArr = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i * 3];
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3 + 2] += velocities[i * 3 + 2];
        if (Math.abs(posArr[i * 3]) > 6) velocities[i * 3] *= -1;
        if (Math.abs(posArr[i * 3 + 1]) > 4) velocities[i * 3 + 1] *= -1;
        if (Math.abs(posArr[i * 3 + 2]) > 3) velocities[i * 3 + 2] *= -1;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Connection lines between nearby particles
      const linePositions: number[] = [];
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = posArr[i * 3] - posArr[j * 3];
          const dy = posArr[i * 3 + 1] - posArr[j * 3 + 1];
          const dz = posArr[i * 3 + 2] - posArr[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < 1.8) {
            linePositions.push(posArr[i * 3], posArr[i * 3 + 1], posArr[i * 3 + 2]);
            linePositions.push(posArr[j * 3], posArr[j * 3 + 1], posArr[j * 3 + 2]);
          }
        }
      }
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      // Mouse parallax on camera
      camera.position.x += (mouseXNorm * 0.3 - camera.position.x) * 0.02;
      camera.position.y += (-mouseYNorm * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!parent) return;
      camera.aspect = parent.clientWidth / parent.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(parent.clientWidth, parent.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animFrameId);
      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  /* ─── Magnetic Hover Micro-Interaction for CTA Button ─── */
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

      // Master Hero Timeline
      const heroTl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 1 },
        scrollTrigger: {
          trigger: '.about-hero-section',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      if (isReducedMotion) {
        // Fallback for reduced motion
        heroTl.to('.about-hero-img', { opacity: 1, duration: 0.5 })
              .to('.about-hero-badge', { opacity: 1, duration: 0.4 })
              .to('.hero-word', { opacity: 1, duration: 0.4 })
              .to('.about-hero-para', { opacity: 1, duration: 0.4 })
              .to('.about-magnetic-cta', { opacity: 1, duration: 0.4 })
              .to('.hero-stat-card', { opacity: 1, duration: 0.4 });
      } else {
        // 1. Background image initial scale & opacity + scroll parallax
        heroTl.fromTo('.about-hero-img',
          { scale: 1.15, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out' },
          0
        );

        // Continuous parallax scroll drift for image
        gsap.to('.about-hero-img', {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: '.about-hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        // 2. Eyebrow badge + horizontal line scaleX: 0 -> 1
        heroTl.fromTo('.about-hero-badge',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          0.2
        );

        heroTl.fromTo('.about-eyebrow-line',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: 'power3.out' },
          0.2
        );

        // 3. Heading split text reveal (rotateX: -40, y: 60, opacity: 0 -> rotateX: 0, y: 0, opacity: 1)
        heroTl.fromTo('.hero-word',
          { y: 60, opacity: 0, rotateX: -40 },
          { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, ease: 'back.out(1.4)', duration: 0.8 },
          0.4
        );

        // 4. Paragraph text (y: 30, opacity: 0 -> y: 0, opacity: 1, starting at -=0.4)
        heroTl.fromTo('.about-hero-para',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          '-=0.4'
        );

        // 5. CTA Button ("Get in Touch") (scale: 0.8, opacity: 0 -> scale: 1, opacity: 1)
        heroTl.fromTo('.about-magnetic-cta',
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'back.out(1.7)', duration: 0.7 },
          '-=0.3'
        );

        // 6. Stats Strip fade/slide up with stagger: 0.15
        heroTl.fromTo('.hero-stat-card',
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out' },
          '-=0.2'
        );

        // 7. Counter number animations (innerText counter from 0 to target)
        const statElements = pageRef.current?.querySelectorAll('.hero-stat-number');
        statElements?.forEach((el) => {
          const targetVal = parseInt(el.getAttribute('data-target') || '0', 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const obj = { val: 0 };

          heroTl.to(obj, {
            val: targetVal,
            duration: 1.5,
            ease: 'power1.out',
            onUpdate: () => {
              el.textContent = Math.floor(obj.val) + suffix;
            }
          }, '-=0.6');
        });

        // Scale in stat underlines once counter finishes
        heroTl.fromTo('.hero-stat-underline',
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
          '-=0.4'
        );
      }

      /* Scroll-Based Section Reveals */
      const sections = pageRef.current?.querySelectorAll('.about-reveal');
      sections?.forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        );
      });

      /* Journey Section — SVG Line Draw & Doctor Icon Scroll Movement */
      const journeyPath = pageRef.current?.querySelector('.about-journey-path') as SVGPathElement | null;
      if (journeyPath) {
        const len = journeyPath.getTotalLength();
        gsap.set(journeyPath, { strokeDasharray: len, strokeDashoffset: len });

        gsap.fromTo(journeyPath,
          { strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '.about-journey-section',
              start: 'top 65%',
              end: 'bottom 65%',
              scrub: 0.3,
              onUpdate: (self) => {
                const p = self.progress;
                const doctorEl = pageRef.current?.querySelector('.about-journey-doctor') as HTMLElement | null;
                const visualEl = pageRef.current?.querySelector('.about-journey-visual') as HTMLElement | null;
                const cardEls = pageRef.current?.querySelectorAll('.about-journey-card');
                const dotEls = pageRef.current?.querySelectorAll('.about-journey-dot');

                if (doctorEl && visualEl && cardEls && cardEls.length > 0) {
                  const visualRect = visualEl.getBoundingClientRect();
                  const firstCard = cardEls[0] as HTMLElement;
                  const lastCard = cardEls[cardEls.length - 1] as HTMLElement;

                  const startY = (firstCard.getBoundingClientRect().top + firstCard.getBoundingClientRect().height / 2) - visualRect.top;
                  const endY = (lastCard.getBoundingClientRect().top + lastCard.getBoundingClientRect().height / 2) - visualRect.top;

                  const currentY = startY + p * (endY - startY);
                  gsap.set(doctorEl, { y: currentY, opacity: 1 });

                  // Dynamic rotation tilt
                  const bounce = Math.sin(p * Math.PI * 4) * 2;
                  gsap.set(doctorEl, { rotation: bounce * 3 });

                  // Highlight corresponding dot as doctor passes by
                  cardEls.forEach((card, idx) => {
                    const cardCenterY = (card.getBoundingClientRect().top + card.getBoundingClientRect().height / 2) - visualRect.top;
                    const dot = dotEls ? (dotEls[idx] as HTMLElement | null) : null;
                    if (Math.abs(currentY - cardCenterY) < 35) {
                      if (dot) dot.classList.add('is-active');
                    } else {
                      if (dot) dot.classList.remove('is-active');
                    }
                  });
                }
              }
            }
          }
        );
      }

      /* Approach Image Zoom */
      gsap.fromTo('.about-approach-img',
        { scale: 1.15, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out',
          scrollTrigger: { trigger: '.about-approach-section', start: 'top 75%' }
        }
      );

      /* ═══════════════════════════════════════════ */
      /* INDUSTRIES WE SUPPORT GSAP ANIMATIONS       */
      /* ═══════════════════════════════════════════ */
      // Drifting background blobs
      gsap.to('.ind-bg-blob-1', {
        x: 60, y: -40, scale: 1.1, duration: 25, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
      gsap.to('.ind-bg-blob-2', {
        x: -50, y: 50, scale: 1.08, duration: 32, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
      gsap.to('.ind-bg-blob-3', {
        x: 40, y: 30, scale: 0.95, duration: 28, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });

      // Circular Orbital Starting Positions for 6 cards (matching UnmatchedTrustSection)
      const isMobile = window.innerWidth < 768;
      const xOrbit = isMobile ? 200 : 420;
      const yOrbit = isMobile ? 220 : 320;

      const initialConfigs = [
        { x: -xOrbit, y: -yOrbit, rotation: -140 }, // Card 0 Top-Left Orbit
        { x: 0, y: -yOrbit * 1.25, rotation: 160 },   // Card 1 Top-Center Orbit
        { x: xOrbit, y: -yOrbit, rotation: -130 },  // Card 2 Top-Right Orbit
        { x: -xOrbit, y: yOrbit, rotation: 150 },   // Card 3 Bottom-Left Orbit
        { x: 0, y: yOrbit * 1.25, rotation: -160 },  // Card 4 Bottom-Center Orbit
        { x: xOrbit, y: yOrbit, rotation: 140 }     // Card 5 Bottom-Right Orbit
      ];

      // Set initial orbital state for all 6 cards
      const sectorCards = gsap.utils.toArray<HTMLElement>('.ind-card');
      sectorCards.forEach((card, idx) => {
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
      const indTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#industries-section',
          start: 'top 78%',
          toggleActions: 'play none none none'
        }
      });

      indTl.fromTo('.ind-badge',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
      .fromTo('.ind-title-line',
        { opacity: 0, y: 35, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'power3.out' },
        '-=0.4'
      )
      .fromTo('.ind-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      )
      .to(sectorCards, {
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
          sectorCards.forEach((card, index) => {
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
        }
      }, '-=0.3');

      // Idle gentle floating motion for icons
      gsap.to('.ind-card-icon', {
        y: -5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.2
      });

      /* Partnership Sticky Scroll Storytelling */
      const stickyItems = pageRef.current?.querySelectorAll('.about-sticky-text-item');
      stickyItems?.forEach((item) => {
        gsap.fromTo(item,
          { opacity: 0, x: -30, filter: 'blur(6px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power2.out',
            scrollTrigger: { trigger: item, start: 'top 80%', toggleActions: 'play none none reverse' }
          }
        );
      });

      /* CTA Section Reveal */
      gsap.fromTo('.about-cta-section',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: '.about-cta-section', start: 'top 85%' }
        }
      );

    }, pageRef);

    return () => ctx.revert();
  }, []);

  /* ─── Helper for Split Text Reveal ─── */
  const splitHeadingWords = (text: string) => {
    return text.split(' ').map((word, i) => (
      <span key={i} className="hero-word-wrap">
        <span className="hero-word">
          {word === 'Trusted' || word === 'Healthcare' || word === 'Staffing' ? (
            <span className="about-highlight">{word}</span>
          ) : (
            word
          )}
        </span>
      </span>
    ));
  };

  /* ─── Industries Data ─── */
  const industries = [
    { 
      icon: 'fas fa-house-medical', 
      title: 'Nursing Homes', 
      desc: 'Supporting elderly residents with qualified nurses and healthcare professionals who promote dignity, comfort, and clinical excellence.',
      image: '/sector_nursing_homes.jpg',
      outfitTag: 'Teal Scrubs • Clinical Care',
      outfitColor: '#0D9488',
      objectPosition: 'center 15%',
      color: 'linear-gradient(135deg, #1C6F6B, #0D9488)' 
    },
    { 
      icon: 'fas fa-home', 
      title: 'Residential Care Homes', 
      desc: 'Providing experienced carers and support workers who help residents maintain independence while receiving compassionate daily care.',
      image: '/sector_residential_care.jpg',
      outfitTag: 'Royal Blue • Daily Support',
      outfitColor: '#2563EB',
      objectPosition: 'center 15%',
      color: 'linear-gradient(135deg, #1E40AF, #2563EB)' 
    },
    { 
      icon: 'fas fa-brain', 
      title: 'Mental Health Services', 
      desc: 'Supplying professionals experienced in supporting individuals with diverse mental health needs across secure units and community services.',
      image: '/sector_mental_health.jpg',
      outfitTag: 'Dark Burgundy • Specialist Care',
      outfitColor: '#BE123C',
      objectPosition: 'center 10%',
      color: 'linear-gradient(135deg, #881337, #BE123C)' 
    },
    { 
      icon: 'fas fa-people-roof', 
      title: 'Supported Living', 
      desc: 'Helping people live independently through skilled support workers focused on personalised care and empowerment.',
      image: '/sector_supported_living.jpg',
      outfitTag: 'Mustard Gold • Empowerment',
      outfitColor: '#D97706',
      objectPosition: 'center 15%',
      color: 'linear-gradient(135deg, #B45309, #D97706)' 
    },
    { 
      icon: 'fas fa-hospital', 
      title: 'Private Healthcare', 
      desc: 'Partnering with private hospitals and specialist clinics to provide dependable temporary and long-term healthcare professionals.',
      image: '/sector_private_healthcare.jpg',
      outfitTag: 'Navy & White • Specialist Staff',
      outfitColor: '#059669',
      objectPosition: 'center 10%',
      color: 'linear-gradient(135deg, #0F766E, #059669)' 
    },
    { 
      icon: 'fas fa-hand-holding-heart', 
      title: 'Hospice & Palliative Care', 
      desc: 'Supporting specialist teams delivering compassionate end-of-life care with dignity, sensitivity, and professionalism.',
      image: '/sector_hospice_palliative.jpg',
      outfitTag: 'Soft Lavender • End-of-Life',
      outfitColor: '#7C3AED',
      objectPosition: 'center 15%',
      color: 'linear-gradient(135deg, #6B21A8, #7C3AED)' 
    },
  ];


  return (
    <div ref={pageRef} className="about-page">
      {/* Cursor Glow Effect */}
      <motion.div
        className="about-cursor-glow"
        style={{ x: glowX, y: glowY }}
      />

      {/* ═══════════════════════════════════════════ */}
      {/* HERO SECTION — GSAP Timeline Animated       */}
      {/* ═══════════════════════════════════════════ */}
      <section className="about-hero-section">
        <HeroBrandThreeBg />
        <div className="about-hero-overlay"></div>

        <div className="container about-hero-grid">
          <div className="about-hero-text">
            {/* Eyebrow Label & Horizontal Accent Line */}
            <div className="about-eyebrow-container">
              <span className="about-eyebrow-line"></span>
              <div className="about-hero-badge">
                <i className="fas fa-route" style={{ color: '#7ce3db' }}></i> OUR JOURNEY
              </div>
            </div>

            {/* Split Text Heading */}
            <h1 className="about-hero-heading">
              {splitHeadingWords('Supporting Better Care Through Trusted Healthcare Staffing')}
            </h1>

            {/* Paragraph Text */}
            <p className="about-hero-para">
              Every healthcare organisation deserves dependable professionals who deliver compassionate, person-centred care. At Assist Plus Care UK, we help care providers strengthen their workforce with experienced healthcare professionals who seamlessly integrate into existing teams and maintain the highest standards of care. Whether supporting planned staffing requirements or responding to urgent shortages, we are committed to providing reliable healthcare staffing solutions across the UK.
            </p>

            {/* CTA Button with Magnetic Hover */}
            <div className="about-hero-cta-wrap">
              <Link 
                to="/quote" 
                ref={ctaBtnRef}
                className="btn btn-accent btn-glow about-magnetic-cta"
              >
                Get in Touch <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* Hero Image with Scale & Parallax Drift */}
          <div className="about-hero-img-wrap">
            <img src="/about_journey_human_hero.png" alt="Assist Plus Care Team" className="about-hero-img" />
            <div className="about-hero-img-badge">
              <i className="fas fa-award"></i>
              <div>
                <strong>Est. 2024</strong>
                <span>Trusted Staffing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FLOATING STATS BANNER                      */}
      {/* ═══════════════════════════════════════════ */}
      <div className="about-floating-stats-bar">
        <div className="container">
          <div className="about-hero-stats-grid">
            <div className="hero-stat-card">
              <div className="hero-stat-icon"><i className="fas fa-smile-beam"></i></div>
              <strong className="hero-stat-number" data-target="98" data-suffix="%">0%</strong>
              <span className="hero-stat-label">Client Satisfaction</span>
              <div className="hero-stat-underline"></div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-icon"><i className="fas fa-user-nurse"></i></div>
              <strong className="hero-stat-number" data-target="500" data-suffix="+">0+</strong>
              <span className="hero-stat-label">Shifts Fulfilled</span>
              <div className="hero-stat-underline"></div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-icon"><i className="fas fa-headset"></i></div>
              <strong className="hero-stat-number" data-target="24" data-suffix="/7">0/7</strong>
              <span className="hero-stat-label">Hour Support</span>
              <div className="hero-stat-underline"></div>
            </div>
            <div className="hero-stat-card">
              <div className="hero-stat-icon"><i className="fas fa-handshake"></i></div>
              <strong className="hero-stat-number" data-target="100" data-suffix="+">0+</strong>
              <span className="hero-stat-label">Healthcare Partners</span>
              <div className="hero-stat-underline"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* OUR JOURNEY SECTION — SVG Line Draw         */}
      {/* ═══════════════════════════════════════════ */}
      <section className="about-journey-section about-reveal" id="about-journey">
        <div className="container">
          <div className="about-section-header text-center">
            <span className="about-section-badge"><i className="fas fa-route"></i> OUR JOURNEY</span>
            <h2>Built on Trust. <span className="about-highlight">Driven by Care.</span></h2>
          </div>

          <div className="about-journey-grid">
            <div className="about-journey-visual">
              <svg className="about-journey-svg" viewBox="0 0 60 400" preserveAspectRatio="xMidYMid meet">
                <path className="about-journey-path" d="M 30 10 C 30 80, 30 80, 30 130 C 30 180, 30 180, 30 230 C 30 280, 30 280, 30 330 C 30 360, 30 360, 30 390" stroke="rgba(28,111,107,0.5)" strokeWidth="3" fill="none" strokeLinecap="round" />
              </svg>
              <div className="about-journey-dot" style={{ top: '2%' }}><i className="fas fa-seedling"></i></div>
              <div className="about-journey-dot" style={{ top: '32%' }}><i className="fas fa-users"></i></div>
              <div className="about-journey-dot" style={{ top: '62%' }}><i className="fas fa-chart-line"></i></div>
              <div className="about-journey-dot" style={{ top: '92%' }}><i className="fas fa-trophy"></i></div>

              {/* Traveling Doctor Icon */}
              <div className="about-journey-doctor">
                <div className="about-doctor-pulse"></div>
                <div className="about-doctor-avatar">
                  <img src="/doctor_journey_icon.png" alt="Doctor Guide" />
                </div>
              </div>
            </div>
            <div className="about-journey-content">
              <div className="about-journey-card about-reveal">
                <h3>Founded on Purpose</h3>
                <p>Founded in 2024, Assist Plus Care UK was established to address one of healthcare's greatest challenges—finding skilled professionals who can deliver exceptional care while adapting quickly to different healthcare environments.</p>
              </div>
              <div className="about-journey-card about-reveal">
                <h3>Understanding Healthcare Needs</h3>
                <p>As healthcare demands continue to evolve, organisations require staffing partners who understand both clinical excellence and the importance of compassionate care. Our team works closely with healthcare providers to ensure every placement contributes positively to patient wellbeing.</p>
              </div>
              <div className="about-journey-card about-reveal">
                <h3>Operational Excellence</h3>
                <p>We focus on operational efficiency and continuity of care, ensuring that healthcare organisations receive consistent, high-quality staffing support that meets their evolving needs.</p>
              </div>
              <div className="about-journey-card about-reveal">
                <h3>Building Lasting Trust</h3>
                <p>Today, we continue to build lasting partnerships by delivering dependable staffing solutions that healthcare organisations can trust.</p>
              </div>
            </div>

            <div className="about-journey-image-col about-reveal">
              <div className="about-journey-img-wrap">
                <img src="/about_journey_human_hero.png" alt="Compassionate Care" className="about-journey-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* OUR APPROACH SECTION                        */}
      {/* ═══════════════════════════════════════════ */}
      <section className="about-approach-section about-reveal">
        <div className="container">
          <div className="about-approach-grid">
            <div className="about-approach-img-col">
              <div className="about-approach-img-wrap">
                <img src="/about_approach_image.png" alt="Our Approach" className="about-approach-img" />
              </div>
            </div>
            <div className="about-approach-text">
              <span className="about-section-badge"><i className="fas fa-compass"></i> OUR APPROACH</span>
              <h2>More Than <span className="about-highlight">Recruitment</span></h2>
              <p>We believe successful healthcare staffing goes beyond filling vacancies. Every placement is carefully matched to ensure professionals possess not only the right qualifications and experience, but also the values and interpersonal skills needed to provide outstanding care.</p>
              <p>By understanding each client's unique environment, staffing requirements, and expectations, we create workforce solutions that support both healthcare teams and the individuals they care for.</p>
              <div className="about-approach-features">
                <div className="about-approach-feat"><i className="fas fa-user-check"></i><span>Qualified & Vetted Staff</span></div>
                <div className="about-approach-feat"><i className="fas fa-heart-pulse"></i><span>Person-Centred Matching</span></div>
                <div className="about-approach-feat"><i className="fas fa-comments"></i><span>Client-Focused Service</span></div>
                <div className="about-approach-feat"><i className="fas fa-shield-halved"></i><span>CQC & DBS Compliant</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* INDUSTRIES WE SUPPORT — Premium GSAP Section */}
      {/* ═══════════════════════════════════════════ */}
      <section className="about-industries-section" id="industries-section">
        {/* Background Floating Blurred Gradient Circles */}
        <div className="ind-bg-blob ind-bg-blob-1"></div>
        <div className="ind-bg-blob ind-bg-blob-2"></div>
        <div className="ind-bg-blob ind-bg-blob-3"></div>

        {/* Floating Particle Canvas */}
        <canvas ref={indCanvasRef} className="ind-particles-canvas" />

        <div className="container relative-z">
          {/* Centered Section Header */}
          <div className="about-section-header text-center ind-header">
            <span className="about-section-badge ind-badge">
              <i className="fas fa-hospital-user" style={{ color: 'var(--primary)' }}></i> INDUSTRIES WE SUPPORT
            </span>
            <h2 className="ind-title">
              <span className="ind-title-line">Partnering Across <span className="about-highlight">Healthcare Sectors</span></span>
            </h2>
            <p className="ind-subtitle">
              We proudly work alongside organisations across a wide range of healthcare sectors, helping maintain safe staffing levels and consistent standards of care.
            </p>
          </div>

          {/* 6 Industry Cards (Responsive 3x2 Grid) */}
          <div className="about-industries-grid">
            {industries.map((ind, i) => (
              <div key={i} className="about-industry-card ind-card">
                {/* Sector Image Banner */}
                <div className="ind-card-img-wrap">
                  <img 
                    src={ind.image} 
                    alt={ind.title} 
                    className="ind-card-img" 
                    style={{ objectPosition: ind.objectPosition || 'center top' }}
                    loading="lazy" 
                  />
                </div>

                {/* Card Content Body */}
                <div className="ind-card-body">
                  <h4 className="ind-card-title">{ind.title}</h4>
                  <p className="ind-card-desc">{ind.desc}</p>
                  
                  <Link to="/services" className="ind-card-link">
                    <span>Explore Sector</span>
                    <i className="fas fa-arrow-right ind-card-arrow"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* PARTNERSHIPS & VALUES — Compact Cards       */}
      {/* ═══════════════════════════════════════════ */}
      <section className="about-values-section about-reveal">
        <div className="container">
          <div className="about-section-header text-center" style={{ marginBottom: '40px' }}>
            <span className="about-section-badge"><i className="fas fa-handshake-angle"></i> OUR VALUES</span>
            <h2>Building Lasting <span className="about-highlight">Partnerships</span></h2>
          </div>

          <div className="about-values-grid">
            <div className="about-sticky-text-item about-value-card">
              <div className="about-value-icon"><i className="fas fa-people-arrows"></i></div>
              <h3>Working Together for Better Outcomes</h3>
              <p>We work collaboratively with care providers to anticipate workforce demands and develop long-term staffing strategies that improve continuity of care.</p>
              <p className="about-value-accent">A trusted extension of every organisation we support.</p>
            </div>

            <div className="about-sticky-text-item about-value-card">
              <div className="about-value-icon"><i className="fas fa-medal"></i></div>
              <h3>Our Commitment to Quality</h3>
              <p>Our recruitment process identifies professionals with clinical competence, clear communication, and genuine dedication to patient wellbeing.</p>
              <p className="about-value-accent">Consistently high standards across every placement.</p>
            </div>

            <div className="about-sticky-text-item about-value-card">
              <div className="about-value-icon"><i className="fas fa-heart"></i></div>
              <h3>A People-First Philosophy</h3>
              <p>Every staffing request centers on safe, compassionate, and uninterrupted care for individuals and healthcare teams.</p>
              <p className="about-value-accent">Creating positive experiences for care teams &amp; residents.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* LOOKING AHEAD — Future Vision & Why Us      */}
      {/* ═══════════════════════════════════════════ */}
      <section className="about-future-section about-reveal">
        <div className="container">
          <div className="about-future-grid">
            <div className="about-future-text">
              <span className="about-section-badge"><i className="fas fa-rocket"></i> LOOKING AHEAD</span>
              <h2>Investing in the Future of <span className="about-highlight">Healthcare Staffing</span></h2>
              <p>As healthcare evolves, Assist Plus Care UK grows alongside our partners—strengthening recruitment networks and operational processes across the UK &amp; Ireland.</p>
              <p className="about-future-goal"><strong>Our Goal:</strong> To be recognised as the UK &amp; Ireland's most trusted healthcare staffing provider for reliability, professionalism, and service.</p>
            </div>
            <div className="about-future-why">
              <h3>Why Organisations Work With Us</h3>
              <ul className="about-why-list">
                <li><i className="fas fa-check-circle"></i> Long-term relationships built on trust</li>
                <li><i className="fas fa-check-circle"></i> Deep understanding of organizational needs</li>
                <li><i className="fas fa-check-circle"></i> High professional care standards</li>
                <li><i className="fas fa-check-circle"></i> Responsive 24/7 staffing assistance</li>
                <li><i className="fas fa-check-circle"></i> Safe environments for staff and patients</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* CLOSING CTA WITH BANNER                     */}
      {/* ═══════════════════════════════════════════ */}
      <section className="about-cta-section">
        <div className="about-cta-overlay"></div>
        <div className="container text-center">
          <div className="about-cta-badge">
            <i className="fas fa-handshake" style={{ color: '#7ce3db' }}></i> WORKFORCE SOLUTIONS
          </div>
          <h2 className="about-cta-title">Let's Build Stronger Care Teams <span className="about-highlight">Together</span></h2>
          <p className="about-cta-desc">Tailored workforce solutions for planned staffing requirements or 24/7 emergency cover.</p>
          <div className="about-cta-btns">
            <Link to="/quote" className="btn btn-accent btn-glow about-magnetic-btn">Get in Touch <i className="fas fa-arrow-right"></i></Link>
            <a href="tel:02036526052" className="btn btn-outline-white about-magnetic-btn"><i className="fas fa-phone"></i> Request a Callback</a>
          </div>
        </div>
      </section>
    </div>
  );
};
