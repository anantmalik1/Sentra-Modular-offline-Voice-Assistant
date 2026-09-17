import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const STATE_PALETTES = {
  IDLE: { core: 0x00d4ff, ring: 0x0066cc, particle: 0x00f7ff, speed: 0.8 },
  LISTENING: { core: 0x00ff88, ring: 0x00bb77, particle: 0x44ffaa, speed: 2.2 },
  PROCESSING: { core: 0xffaa00, ring: 0xff6600, particle: 0xffcc33, speed: 2.5 },
  THINKING: { core: 0x9d4edd, ring: 0x6a0dad, particle: 0xc77dff, speed: 3.0 },
  EXECUTING: { core: 0x00f7ff, ring: 0x0044ff, particle: 0x77eeff, speed: 2.8 },
  SPEAKING: { core: 0x00d4ff, ring: 0x00ffcc, particle: 0x88ffff, speed: 1.8 },
  ERROR: { core: 0xff2244, ring: 0x880022, particle: 0xff6677, speed: 1.2 },
  OFFLINE: { core: 0x475569, ring: 0x1e293b, particle: 0x64748b, speed: 0.3 },
};

export default function AIOrb({ state = 'IDLE', audioLevel = 0 }) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const coreMeshRef = useRef(null);
  const wireMeshRef = useRef(null);
  const ringsRef = useRef([]);
  const particlesRef = useRef(null);
  const animIdRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 320;

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

    // 1. Central Core Sphere
    const coreGeo = new THREE.SphereGeometry(2.1, 36, 36);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 2. Holographic Outer Wireframe Sphere
    const wireGeo = new THREE.IcosahedronGeometry(2.5, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    orbGroup.add(wireMesh);
    wireMeshRef.current = wireMesh;

    // 3. Orbital Rings
    const rings = [];
    const ringRadii = [3.2, 3.7, 4.2];
    ringRadii.forEach((radius, i) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.02, 16, 100);
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
    ringsRef.current = rings;

    // 4. Quantum Particles Nebula
    const pCount = 140;
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i += 3) {
      const r = 2.8 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.075,
      color: 0x00f7ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    orbGroup.add(particles);
    particlesRef.current = particles;

    // Animate Loop
    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();
      const cfg = STATE_PALETTES[state] || STATE_PALETTES.IDLE;

      const audioBoost = Math.min(audioLevel * 0.8, 1.0);
      const scale = 1.0 + Math.sin(t * 1.5) * 0.04 + audioBoost * 0.18;

      if (coreMeshRef.current) {
        coreMeshRef.current.scale.set(scale, scale, scale);
      }
      if (wireMeshRef.current) {
        const wScale = scale * 1.06;
        wireMeshRef.current.scale.set(wScale, wScale, wScale);
        wireMeshRef.current.rotation.y += 0.005 * cfg.speed;
        wireMeshRef.current.rotation.x += 0.003 * cfg.speed;
      }
      ringsRef.current.forEach((r, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        r.rotation.z += 0.008 * cfg.speed * dir;
        r.rotation.x += 0.004 * cfg.speed;
      });
      if (particlesRef.current) {
        particlesRef.current.rotation.y -= 0.002 * cfg.speed;
      }

      orbGroup.rotation.y = Math.sin(t * 0.25) * 0.1;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update color palette when state changes
  useEffect(() => {
    const cfg = STATE_PALETTES[state] || STATE_PALETTES.IDLE;
    const cCore = new THREE.Color(cfg.core);
    const cRing = new THREE.Color(cfg.ring);
    const cPart = new THREE.Color(cfg.particle);

    if (coreMeshRef.current) coreMeshRef.current.material.color.copy(cCore);
    if (wireMeshRef.current) wireMeshRef.current.material.color.copy(cPart);
    ringsRef.current.forEach((r) => r.material.color.copy(cRing));
    if (particlesRef.current) particlesRef.current.material.color.copy(cPart);
  }, [state]);

  return (
    <div className="hud-panel p-5 relative flex items-center justify-center w-full h-full min-h-[340px] overflow-hidden">
      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-full z-10" />

      {/* Futuristic Center Overlay Text INSIDE Orb */}
      <div className="absolute z-20 pointer-events-none flex flex-col items-center justify-center text-center">
        <div
          className="font-mono font-black tracking-[0.25em] text-cyan-300 uppercase leading-none"
          style={{
            fontSize: '18px',
            textShadow: '0 0 14px rgba(0, 247, 255, 0.9), 0 0 28px rgba(0, 247, 255, 0.45)',
          }}
        >
          SENTRA
        </div>
        <div
          className="font-mono tracking-[0.22em] text-slate-100 uppercase mt-2 leading-none font-bold"
          style={{
            fontSize: '11px',
            letterSpacing: '0.22em',
          }}
        >
          AI CORE
        </div>
        <div
          className="font-mono text-[9px] text-cyan-400/90 mt-1 font-semibold"
          style={{ letterSpacing: '0.12em' }}
        >
          v2.0.0
        </div>
      </div>

      {/* Ambient Radial Glow Behind Orb */}
      <div
        className="absolute w-72 h-72 rounded-full pointer-events-none blur-3xl opacity-35 z-0"
        style={{
          background: 'radial-gradient(circle, rgba(0, 247, 255, 0.35) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
