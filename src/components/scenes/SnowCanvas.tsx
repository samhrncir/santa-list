"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  r: number;
  fall: number;
  sway: number;
  phase: number;
  vx: number;
  vy: number;
  alpha: number;
};

/**
 * Snowfall on a full-screen canvas. Flakes drift with a slow wind, and the
 * pointer pushes nearby flakes away and drags them along when it moves fast.
 */
export default function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speedScale = reducedMotion ? 0.45 : 1;
    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, lastX: 0, lastY: 0, lastT: 0, active: false };
    let wind = 0;
    let windTarget = 0;
    let windTimer = 0;
    let frameId = 0;
    let last = performance.now();
    let running = true;

    const makeFlake = (anywhere: boolean): Flake => {
      const depth = Math.random();
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : -10,
        r: 0.8 + depth * 2.6,
        fall: (18 + depth * 50) * speedScale,
        sway: 8 + depth * 22,
        phase: Math.random() * Math.PI * 2,
        vx: 0,
        vy: 0,
        alpha: 0.35 + depth * 0.6,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(Math.max((width * height) / 7000, 60), reducedMotion ? 90 : 360));
      if (flakes.length > target) flakes = flakes.slice(0, target);
      while (flakes.length < target) flakes.push(makeFlake(true));
    };

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      if (pointer.active) {
        const dt = Math.max(now - pointer.lastT, 8) / 1000;
        pointer.vx = (event.clientX - pointer.lastX) / dt;
        pointer.vy = (event.clientY - pointer.lastY) / dt;
      }
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.lastX = event.clientX;
      pointer.lastY = event.clientY;
      pointer.lastT = now;
      pointer.active = true;
    };

    const onPointerGone = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
      pointer.vx = 0;
      pointer.vy = 0;
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) onPointerGone();
    };

    const RADIUS = 150;
    const RADIUS_SQ = RADIUS * RADIUS;

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      windTimer -= dt;
      if (windTimer <= 0) {
        windTarget = (Math.random() - 0.5) * 40;
        windTimer = 4 + Math.random() * 6;
      }
      wind += (windTarget - wind) * Math.min(dt * 0.4, 1);

      // Pointer velocity fades quickly once the pointer stops moving.
      const pointerDecay = Math.pow(0.02, dt);
      pointer.vx *= pointerDecay;
      pointer.vy *= pointerDecay;

      const damping = Math.pow(0.12, dt);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fff";

      for (const f of flakes) {
        f.phase += dt * (0.8 + f.r * 0.3);

        if (pointer.active) {
          const dx = f.x - pointer.x;
          const dy = f.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < RADIUS_SQ && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const k = 1 - d / RADIUS;
            const push = k * k * 700 * dt;
            f.vx += (dx / d) * push + pointer.vx * k * 0.6 * dt;
            f.vy += (dy / d) * push + pointer.vy * k * 0.6 * dt;
          }
        }

        f.vx *= damping;
        f.vy *= damping;
        f.x += (Math.sin(f.phase) * f.sway + wind * (0.3 + f.r * 0.25) + f.vx) * dt;
        f.y += (f.fall + f.vy) * dt;

        if (f.y > height + 6) Object.assign(f, makeFlake(false));
        if (f.x < -8) f.x = width + 8;
        else if (f.x > width + 8) f.x = -8;

        ctx.globalAlpha = f.alpha;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frameId);
      running = document.visibilityState === "visible";
      if (running) {
        last = performance.now();
        frameId = requestAnimationFrame(frame);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerGone);
    window.addEventListener("pointercancel", onPointerGone);
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("blur", onPointerGone);
    document.addEventListener("visibilitychange", onVisibility);
    frameId = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointerup", onPointerGone);
      window.removeEventListener("pointercancel", onPointerGone);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", onPointerGone);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="snow-canvas" />;
}
