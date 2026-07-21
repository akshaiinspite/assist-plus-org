import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface OrbitItemConfig {
  imagePath: string;
  title: string;
  isHero?: boolean;
}

export const ThreeOrbitStage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isCentered, setIsCentered] = useState(false);
  const [webGlAvailable, setWebGlAvailable] = useState(true);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    let animationFrameId: number;
    const clock = new THREE.Clock();

    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Renderer Setup
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      console.warn('WebGL not available for 3D orbit stage:', e);
      setWebGlAvailable(false);
      return;
    }

    // 2. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // 4. Orbit Group
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    // 5. Items Setup
    const items: OrbitItemConfig[] = [
      { imagePath: '/about-nursing.png', title: 'Nursing Staff', isHero: true },
      { imagePath: '/about-housekeeping.png', title: 'Housekeeping' },
      { imagePath: '/about-kitchen.png', title: 'Kitchen & Chef' },
      { imagePath: '/care-homecare.png', title: 'Home Care' },
      { imagePath: '/about-team.png', title: 'Healthcare Team' }
    ];

    const textureLoader = new THREE.TextureLoader();
    const meshes: THREE.Mesh[] = [];
    let heroMesh: THREE.Mesh | undefined;

    const radiusData: { radius: number; initialAngle: number }[] = [];
    const baseRadius = window.innerWidth < 768 ? 1.6 : 2.4;
    const count = items.length;

    const geometry = new THREE.CircleGeometry(0.72, 64);
    const ringGeometry = new THREE.RingGeometry(0.72, 0.77, 64);

    items.forEach((item, index) => {
      const angle = (index / count) * Math.PI * 2;
      const initialRadius = prefersReducedMotion ? 0 : baseRadius;
      radiusData.push({ radius: initialRadius, initialAngle: angle });

      textureLoader.load(item.imagePath, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: item.isHero || prefersReducedMotion ? 1 : 0.9
        });

        const mesh = new THREE.Mesh(geometry, material);

        const ringMaterial = new THREE.MeshBasicMaterial({
          color: item.isHero ? 0xd7262e : 0x1c6f6b,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.9
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.position.z = 0.005;
        mesh.add(ringMesh);

        mesh.position.set(
          initialRadius * Math.cos(angle),
          0,
          initialRadius * Math.sin(angle)
        );

        if (item.isHero) {
          heroMesh = mesh;
          mesh.scale.set(1.15, 1.15, 1.15);
        }

        orbitGroup.add(mesh);
        meshes.push(mesh);
      });
    });

    // Continuous Rotation
    let orbitTween: gsap.core.Tween | undefined;
    if (!prefersReducedMotion) {
      orbitTween = gsap.to(orbitGroup.rotation, {
        y: Math.PI * 2,
        duration: 22,
        ease: 'none',
        repeat: -1
      });
    }

    // Render loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      meshes.forEach((mesh, index) => {
        if (!isCentered) {
          mesh.position.y = Math.sin(elapsedTime * 2.2 + index * 1.3) * 0.12;
        }
        mesh.quaternion.copy(camera.quaternion);
      });

      renderer.render(scene, camera);
    };
    animate();

    // ScrollTrigger Convergence
    let convergeTl: gsap.core.Timeline | undefined;
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        if (orbitTween) orbitTween.pause();

        convergeTl = gsap.timeline({
          onComplete: () => {
            setIsCentered(true);
          }
        });

        convergeTl.to(camera.position, { z: 5.2, duration: 1.4, ease: 'power3.inOut' }, 0);
        convergeTl.to(orbitGroup.rotation, { y: 0, duration: 1.2, ease: 'power3.out' }, 0);

        meshes.forEach((mesh, i) => {
          const data = radiusData[i];
          const isHero = mesh === heroMesh;
          if (!data) return;

          convergeTl?.to(
            data,
            {
              radius: 0,
              duration: 1.3,
              ease: 'power3.inOut',
              onUpdate: () => {
                mesh.position.x = data.radius * Math.cos(data.initialAngle);
                mesh.position.z = data.radius * Math.sin(data.initialAngle);
              }
            },
            i * 0.08
          );

          if (!isHero) {
            const mat = mesh.material as THREE.MeshBasicMaterial;
            convergeTl?.to(mat, { opacity: 0, duration: 0.9, ease: 'power2.in' }, 0.3 + i * 0.08);
            convergeTl?.to(mesh.scale, { x: 0.2, y: 0.2, z: 0.2, duration: 0.9, ease: 'power2.in' }, 0.3 + i * 0.08);
          }
        });

        if (heroMesh) {
          convergeTl.to(heroMesh.position, { x: 0, y: 0, z: 0, duration: 1, ease: 'power3.out' }, 0.8);
          convergeTl.to(heroMesh.scale, { x: 1.65, y: 1.65, z: 1.65, duration: 1.1, ease: 'elastic.out(1, 0.5)' }, 1.1);
        }
      }
    });

    const handleResize = () => {
      const w = container.clientWidth || 500;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      trigger.kill();
      if (orbitTween) orbitTween.kill();
      if (convergeTl) convergeTl.kill();

      meshes.forEach((m) => {
        m.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) child.material.forEach((mat) => mat.dispose());
              else child.material.dispose();
            }
          }
        });
      });
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <div className="orbit-visual-column">
      <div ref={containerRef} className={`orbit-container ${isCentered ? 'is-centered' : ''}`}>
        {webGlAvailable ? (
          <canvas ref={canvasRef} className="orbit-canvas" />
        ) : (
          <img
            src="/about-nursing.png"
            alt="Who We Are - Assist Plus Care"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px', boxShadow: 'var(--shadow-xl)' }}
          />
        )}
        <div className="pulse-ring"></div>
        <div className="about-experience-badge">
          <div className="exp-icon"><i className="fas fa-award"></i></div>
          <div>
            <strong>10+ Years</strong>
            <span>Excellence in Care</span>
          </div>
        </div>
      </div>
    </div>
  );
};
