import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const STATE_PALETTES = {
  IDLE: {
    coreColor: 0x00c8ff,
    ringColor: 0x0077ff,
    particleColor: 0x00e5ff,
    speed: 0.8,
    pulseSpeed: 1.5,
    ringCount: 3,
    bloomIntensity: 1.0,
  },
  LISTENING: {
    coreColor: 0x00ff88,
    ringColor: 0x00ddaa,
    particleColor: 0x33ffbb,
    speed: 1.8,
    pulseSpeed: 4.0,
    ringCount: 4,
    bloomIntensity: 1.6,
  },
  PROCESSING: {
    coreColor: 0xffaa00,
    ringColor: 0xff7700,
    particleColor: 0xffcc33,
    speed: 2.2,
    pulseSpeed: 3.5,
    ringCount: 4,
    bloomIntensity: 1.4,
  },
  THINKING: {
    coreColor: 0xbd00ff,
    ringColor: 0x7928ca,
    particleColor: 0xe056fd,
    speed: 3.0,
    pulseSpeed: 5.0,
    ringCount: 5,
    bloomIntensity: 1.8,
  },
  EXECUTING: {
    coreColor: 0x00f7ff,
    ringColor: 0x0055ff,
    particleColor: 0x88ffff,
    speed: 2.5,
    pulseSpeed: 4.5,
    ringCount: 4,
    bloomIntensity: 1.7,
  },
  SPEAKING: {
    coreColor: 0x00d4ff,
    ringColor: 0x00ffaa,
    particleColor: 0x80ffff,
    speed: 1.6,
    pulseSpeed: 3.0,
    ringCount: 4,
    bloomIntensity: 1.5,
  },
  ERROR: {
    coreColor: 0xff2244,
    ringColor: 0xaa0022,
    particleColor: 0xff6677,
    speed: 1.0,
    pulseSpeed: 6.0,
    ringCount: 2,
    bloomIntensity: 1.2,
  },
  OFFLINE: {
    coreColor: 0x475569,
    ringColor: 0x334155,
    particleColor: 0x64748b,
    speed: 0.3,
    pulseSpeed: 0.8,
    ringCount: 2,
    bloomIntensity: 0.4,
  },
};

export default function AiOrb({ state = 'IDLE', audioLevel = 0 }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const orbGroupRef = useRef(null);
  const coreMeshRef = useRef(null);
  const wireMeshRef = useRef(null);
  const ringsRef = useRef([]);
  const particlesRef = useRef(null);
  const animFrameId = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 13;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Orb Group
    const orbGroup = new THREE.Group();
    scene.add(orbGroup);
    orbGroupRef.current = orbGroup;

    // 1. Core Sphere (Inner glowing core)
    const coreGeo = new THREE.SphereGeometry(2.4, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00c8ff,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    orbGroup.add(coreMesh);
    coreMeshRef.current = coreMesh;

    // 2. Wireframe Hologram Layer
    const wireGeo = new THREE.IcosahedronGeometry(2.7, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    orbGroup.add(wireMesh);
    wireMeshRef.current = wireMesh;

    // 3. Orbital Rings
    const rings = [];
    const ringRadii = [3.4, 3.9, 4.4, 4.9];
    ringRadii.forEach((radius, i) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.03, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x0077ff,
        transparent: true,
        opacity: 0.5 - i * 0.08,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / (2 + i * 0.5);
      ringMesh.rotation.y = (i * Math.PI) / 4;
      orbGroup.add(ringMesh);
      rings.push(ringMesh);
    });
    ringsRef.current = rings;

    // 4. Quantum Particle Field
    const particleCount = 200;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 3.2 + Math.random() * 3.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      posArray[i] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    orbGroup.add(particles);
    particlesRef.current = particles;

    // Animation Loop
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clockRef.current.getElapsedTime();

      // Read current state config
      const currentConfig = STATE_PALETTES[state] || STATE_PALETTES.IDLE;
      const speed = currentConfig.speed;
      const pulseSpeed = currentConfig.pulseSpeed;

      // Audio reactive multiplier
      const audioBoost = Math.min(audioLevel * 0.8, 1.2);

      // Core Breathing & Audio Pulsing
      const scale = 1.0 + Math.sin(elapsedTime * pulseSpeed) * 0.06 + audioBoost * 0.18;
      if (coreMeshRef.current) {
        coreMeshRef.current.scale.set(scale, scale, scale);
      }
      if (wireMeshRef.current) {
        const wireScale = scale * 1.08;
        wireMeshRef.current.scale.set(wireScale, wireScale, wireScale);
        wireMeshRef.current.rotation.y += 0.005 * speed;
        wireMeshRef.current.rotation.x += 0.003 * speed;
      }

      // Orbital Rings Rotation
      ringsRef.current.forEach((ring, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        ring.rotation.z += 0.01 * speed * dir;
        ring.rotation.x += 0.006 * speed * (idx + 1) * 0.3;
      });

      // Particle Nebula Slow Drift
      if (particlesRef.current) {
        particlesRef.current.rotation.y -= 0.002 * speed;
        particlesRef.current.rotation.x += 0.001 * speed;
      }

      // General Orb Gyroscopic Drift
      if (orbGroupRef.current) {
        orbGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.3) * 0.15;
        orbGroupRef.current.rotation.x = Math.cos(elapsedTime * 0.2) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Visual Palette whenever 'state' changes
  useEffect(() => {
    const config = STATE_PALETTES[state] || STATE_PALETTES.IDLE;
    const targetCore = new THREE.Color(config.coreColor);
    const targetRing = new THREE.Color(config.ringColor);
    const targetParticle = new THREE.Color(config.particleColor);

    if (coreMeshRef.current) {
      coreMeshRef.current.material.color.copy(targetCore);
    }
    if (wireMeshRef.current) {
      wireMeshRef.current.material.color.copy(targetParticle);
    }
    if (ringsRef.current) {
      ringsRef.current.forEach((r) => {
        r.material.color.copy(targetRing);
      });
    }
    if (particlesRef.current) {
      particlesRef.current.material.color.copy(targetParticle);
    }
  }, [state]);

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[380px]">
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full max-w-[480px] max-h-[480px] z-10" />

      {/* Holographic Ambient Glow Aura */}
      <div
        className="absolute w-64 h-64 rounded-full pointer-events-none transition-all duration-700 blur-3xl opacity-40 z-0"
        style={{
          background: `radial-gradient(circle, #${((STATE_PALETTES[state] || STATE_PALETTES.IDLE).coreColor).toString(16).padStart(6, '0')} 0%, transparent 70%)`,
          transform: audioLevel > 0.1 ? `scale(${1 + audioLevel * 0.4})` : 'scale(1)',
        }}
      />
    </div>
  );
}
