import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export const HeroBrandThreeBg: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const parent = containerRef.current;

    let animFrameId: number;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(parent.clientWidth, parent.clientHeight);
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, parent.clientWidth / parent.clientHeight, 0.1, 100);
    camera.position.z = 5;

    // --- Ambient Particle Cloud ---
    const particleCount = 75;
    const positions = new Float32Array(particleCount * 3);
    const velocities: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

      velocities.push(
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.002
      );
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.065,
      transparent: true,
      opacity: 0.45
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Laser lines connecting ambient particles
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x1c6f6b,
      transparent: true,
      opacity: 0.08
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    // Mouse parallax variables
    let mouseXNorm = 0;
    let mouseYNorm = 0;

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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      renderer.dispose();
    };
  }, []);

  // GSAP Floating Motion for 3D Stethoscope & Badges
  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Drifting ambient blobs
      gsap.to('.hero-brand-blob-1', {
        x: 40, y: -30, scale: 1.15, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
      gsap.to('.hero-brand-blob-2', {
        x: -45, y: 35, scale: 0.9, duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="hero-brand-three-container" ref={containerRef}>
      {/* Ambient Gradient Blobs in Logo Palette */}
      <div className="hero-brand-blob hero-brand-blob-1"></div>
      <div className="hero-brand-blob hero-brand-blob-2"></div>
      <div className="hero-brand-blob hero-brand-blob-3"></div>

      {/* Modern Grid Overlay */}
      <div className="hero-brand-grid-overlay"></div>

      {/* 3D WebGL Background Canvas */}
      <canvas ref={canvasRef} className="hero-brand-three-canvas" />
    </div>
  );
};
