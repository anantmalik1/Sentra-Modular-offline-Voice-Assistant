'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroOrbProps {
  isListening?: boolean;
}

export default function HeroOrb({ isListening = false }: HeroOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 250;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 11.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const orbGroup = new THREE.Group();
    scene.add(orbGroup);

    // 1. Central Core Glow Sphere
    const coreGeo = new THREE.SphereGeometry(2.1, 36, 36);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00d9ff,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(coreMesh);

    // 2. Holographic Rotating Wireframe Sphere
    const wireGeo = new THREE.IcosahedronGeometry(2.55, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    orbGroup.add(wireMesh);

    // 3. Orbital Gyroscope Rings
    const rings: THREE.Mesh[] = [];
    [3.2, 3.7, 4.2].forEach((radius, i) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.02, 16, 90);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0077dd,
        transparent: true,
        opacity: 0.5 - i * 0.1,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / (2.2 + i * 0.4);
      ringMesh.rotation.y = (i * Math.PI) / 3.2;
      orbGroup.add(ringMesh);
      rings.push(ringMesh);
    });

    // 4. Quantum Particle Nodes Nebula
    const pCount = 150;
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      const r = 2.7 + Math.random() * 2.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.07,
      color: 0x00f7ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    orbGroup.add(particles);

    const clock = new THREE.Clock();

    // Render loop
    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const speed = isListening ? 2.5 : 1.0;
      const scale = 1.0 + Math.sin(t * (isListening ? 3.5 : 1.5)) * 0.04;

      coreMesh.scale.set(scale, scale, scale);
      wireMesh.scale.set(scale * 1.05, scale * 1.05, scale * 1.05);
      wireMesh.rotation.y += 0.005 * speed;
      wireMesh.rotation.x += 0.003 * speed;

      rings.forEach((r, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        r.rotation.z += 0.008 * speed * dir;
        r.rotation.x += 0.004 * speed;
      });

      particles.rotation.y -= 0.002 * speed;
      orbGroup.rotation.y = Math.sin(t * 0.25) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isListening]);

  return (
    <div className="hud-panel relative flex items-center justify-center w-full h-full overflow-hidden">
      {/* 3D Canvas */}
      <div ref={containerRef} className="w-full h-full z-10" />

      {/* Futuristic Center Overlay Text: SENTRA / AI CORE / v3.0.0 */}
      <div className="absolute z-20 pointer-events-none flex flex-col items-center justify-center text-center">
        <span
          className="font-mono font-black tracking-[0.25em] text-cyan-300 uppercase leading-none text-base sm:text-lg"
          style={{
            textShadow: '0 0 12px rgba(0, 217, 255, 0.9), 0 0 24px rgba(0, 217, 255, 0.5)',
          }}
        >
          SENTRA
        </span>
        <span className="font-mono tracking-[0.22em] text-slate-200 uppercase text-[9px] mt-1.5 leading-none">
          AI CORE
        </span>
        <span className="font-mono text-[8px] text-cyan-400/80 mt-1 tracking-wider">
          v3.0.0
        </span>
      </div>

      {/* Ambient Glow */}
      <div
        className="absolute w-52 h-52 rounded-full pointer-events-none blur-3xl opacity-35 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0, 217, 255, 0.35) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
