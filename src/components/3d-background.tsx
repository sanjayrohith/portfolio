'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 60);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0); // transparent
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particles
    const isMobile = matchMedia('(max-width: 768px)').matches;
    const COUNT = isMobile ? 1400 : 4200;
    const RADIUS = isMobile ? 38 : 55;

  const positions = new Float32Array(COUNT * 3);
  const velocities = new Float32Array(COUNT * 3);
  const spins = new Float32Array(COUNT); // base swirl factor per particle
  const restRadii = new Float32Array(COUNT); // keeps particles near a shell
  const colors = new Float32Array(COUNT * 3);

    // Brand colors: lime -> electric blue
    const cStart = new THREE.Color('#32CD32'); // lime
    const cEnd = new THREE.Color('#7DF9FF'); // electric blue

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      // Random point in a sphere shell
      const r = RADIUS * (0.8 + Math.random() * 0.4); // tighter, nicer thickness
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      // Store target radius for radial spring
      restRadii[i] = r;

      // Small initial velocities
      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

  // Spin between 0.4 and 1.0
  spins[i] = 0.4 + Math.random() * 0.6;

      // Gradient color along distribution
      const t = i / (COUNT - 1);
      const col = cStart.clone().lerp(cEnd, t);
      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isMobile ? 0.06 : 0.08,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Interaction
    const mouse = new THREE.Vector2(0, 0);
    // Track mouse velocity (NDC units per frame) to drive swirl axis
    const mouseVel = new THREE.Vector2(0, 0);
  let lastMoveTs = performance.now();
  const lastNdc = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastMoveTs < 16) return; // ~60fps throttle
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.set(ndcX, ndcY);
      // Velocity in NDC space with smoothing
      const dt = Math.max((now - lastMoveTs) / 1000, 1 / 120);
      const vx = (ndcX - lastNdc.x) / dt;
      const vy = (ndcY - lastNdc.y) / dt;
      // Exponential smoothing to avoid jitter
      mouseVel.x = mouseVel.x * 0.85 + vx * 0.15;
      mouseVel.y = mouseVel.y * 0.85 + vy * 0.15;
      lastNdc.set(ndcX, ndcY);
      lastMoveTs = now;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Physics params
    const RADIAL_K = 0.08; // strength of shell spring
    const DAMPING = 0.967;
    const BASE_SWIRL = 0.18; // base tangential motion
    const MOUSE_SWIRL_GAIN = 0.10; // extra swirl proportional to mouse speed
    const MOUSE_RADIUS = isMobile ? 18 : 26;
    const MOUSE_STRENGTH = 0.35;

    const clock = new THREE.Clock();
    let raf = 0;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.033); // cap dt for stability
      const time = performance.now() * 0.001;

      // Convert mouse NDC to plane at z ~ 0
      const targetX = mouse.x * (RADIUS * 0.9);
      const targetY = mouse.y * (RADIUS * 0.9);

      // Build swirl axis from mouse direction (perpendicular)
      const ax = -mouseVel.y; // axis ~ (-vy, vx, 0)
      const ay = mouseVel.x;
      const az = 0;
      // Mouse speed magnitude in NDC/s, clamped
      const mouseSpeed = Math.min(Math.hypot(mouseVel.x, mouseVel.y), 6);
      const swirlGain = BASE_SWIRL + mouseSpeed * MOUSE_SWIRL_GAIN;

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;

        const x = positions[i3];
        const y = positions[i3 + 1];
        const z = positions[i3 + 2];

        // Radial spring towards per-particle shell radius (keeps scatter)
        const r = Math.sqrt(x * x + y * y + z * z) || 1;
        const rest = restRadii[i];
        const radial = (rest - r) * RADIAL_K * dt;
        const nx = x / r, ny = y / r, nz = z / r;
        velocities[i3] += nx * radial;
        velocities[i3 + 1] += ny * radial;
        velocities[i3 + 2] += nz * radial;

        // Swirl around an axis derived from mouse direction
        const s = (spins[i] * swirlGain) * dt;
        // cross(axis, position): (ay*z - az*y, az*x - ax*z, ax*y - ay*x)
        const cx = ay * z - az * y;
        const cy = az * x - ax * z;
        const cz = ax * y - ay * x;
        velocities[i3] += cx * s;
        velocities[i3 + 1] += cy * s;
        velocities[i3 + 2] += cz * s;

        // Soft noise wobble (no extra deps)
        velocities[i3 + 1] += Math.sin(time * 0.8 + i * 0.003) * 0.0025;

        // Mouse repulsion in X/Y plane
        const dx = x - targetX;
        const dy = y - targetY;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_RADIUS * MOUSE_RADIUS) {
          const inv = 1 / (d2 + 1);
          const f = MOUSE_STRENGTH * inv; // stronger when closer
          velocities[i3] += dx * f * dt;
          velocities[i3 + 1] += dy * f * dt;
        }

        // Integrate
        positions[i3] += velocities[i3];
        positions[i3 + 1] += velocities[i3 + 1];
        positions[i3 + 2] += velocities[i3 + 2];

        // Damping
        velocities[i3] *= DAMPING;
        velocities[i3 + 1] *= DAMPING;
        velocities[i3 + 2] *= DAMPING;

        // Gentle bounds to avoid drifting too far
        const mag2 = x * x + y * y + z * z;
        const maxR = RADIUS * 1.8;
        if (mag2 > maxR * maxR) {
          positions[i3] *= 0.95;
          positions[i3 + 1] *= 0.95;
          positions[i3 + 2] *= 0.95;
        }
      }

      geometry.attributes.position.needsUpdate = true;

  // Slow scene rotation for depth; influenced slightly by mouse
  scene.rotation.y += (0.015 + 0.003 * Math.sign(mouseVel.x)) * dt;
  scene.rotation.x += (0.006 * Math.sign(mouseVel.y)) * dt;

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
  className="fixed inset-0 -z-50 w-full h-full pointer-events-none"
    />
  );
}
