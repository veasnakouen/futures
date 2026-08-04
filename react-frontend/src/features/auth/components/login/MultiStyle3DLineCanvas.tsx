import React, { useEffect, useRef } from "react";
import { type BgStyleMode } from "@/features/auth/hooks/useLoginPageState";

interface Props {
  mode: BgStyleMode;
  mouseX: number;
  mouseY: number;
}

export default function MultiStyle3DLineCanvas({ mode, mouseX, mouseY }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // --- Mode 1: 3D GRID State ---
    let speedOffset = 0;
    const lasers = [
      { xRatio: -0.8, progress: 0.1, speed: 0.008, color: "#6366f1" },
      { xRatio: -0.4, progress: 0.6, speed: 0.012, color: "#a855f7" },
      { xRatio: 0, progress: 0.3, speed: 0.009, color: "#38bdf8" },
      { xRatio: 0.4, progress: 0.8, speed: 0.014, color: "#ec4899" },
      { xRatio: 0.8, progress: 0.4, speed: 0.01, color: "#10b981" },
    ];

    // --- Mode 2: COLOR WAVES State ---
    let waveStep = 0;
    const waveColors = ["#6366f1", "#a855f7", "#ec4899", "#38bdf8", "#10b981", "#f59e0b"];

    // --- Mode 3: CONSTELLATION State ---
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 2 + 1,
      color: waveColors[Math.floor(Math.random() * waveColors.length)],
    }));

    // --- Mode 4: RAINBOW WARP State ---
    const warpLines = Array.from({ length: 80 }, () => ({
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 8 + 4,
      dist: Math.random() * width * 0.5,
      len: Math.random() * 40 + 20,
      color: waveColors[Math.floor(Math.random() * waveColors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#060913");
      bgGrad.addColorStop(0.5, "#0b0f1f");
      bgGrad.addColorStop(1, "#040710");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (mode === "3D_GRID") {
        const horizonY = height * 0.38 + mouseY * 0.05;
        const horizonX = width * 0.5 + mouseX * 0.05;

        const lineCount = 30;
        for (let i = -lineCount / 2; i <= lineCount / 2; i++) {
          const spread = (i / (lineCount / 2)) * (width * 1.4);
          const bottomX = horizonX + spread;

          const grad = ctx.createLinearGradient(horizonX, horizonY, bottomX, height);
          grad.addColorStop(0, "rgba(99, 102, 241, 0.02)");
          grad.addColorStop(0.5, "rgba(168, 85, 247, 0.25)");
          grad.addColorStop(1, "rgba(56, 189, 248, 0.5)");

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(horizonX, horizonY);
          ctx.lineTo(bottomX, height);
          ctx.stroke();
        }

        speedOffset = (speedOffset + 0.006) % 1;
        const numHoriz = 20;
        for (let j = 0; j < numHoriz; j++) {
          const depth = (j / numHoriz + speedOffset) % 1;
          const y = horizonY + Math.pow(depth, 2.4) * (height - horizonY);
          const alpha = Math.sin(depth * Math.PI) * 0.45;
          ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
          ctx.lineWidth = 0.5 + depth * 1.5;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        lasers.forEach((laser) => {
          laser.progress = (laser.progress + laser.speed) % 1;
          const depth = laser.progress;
          const y = horizonY + Math.pow(depth, 2.4) * (height - horizonY);
          const x = horizonX + laser.xRatio * (width * 0.7) * depth;

          const radius = 3 + depth * 6;
          const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
          glowGrad.addColorStop(0, laser.color);
          glowGrad.addColorStop(0.5, `${laser.color}88`);
          glowGrad.addColorStop(1, "transparent");

          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(x, y, radius * 0.8, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (mode === "COLOR_WAVES") {
        waveStep += 0.015;
        const numWaves = 7;

        for (let i = 0; i < numWaves; i++) {
          const color = waveColors[i % waveColors.length];
          const yOffset = (height / (numWaves + 1)) * (i + 1);
          const frequency = 0.003 + i * 0.0008;
          const amplitude = 35 + i * 8;

          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;

          ctx.beginPath();
          for (let x = 0; x <= width; x += 10) {
            const y =
              yOffset +
              Math.sin(x * frequency + waveStep + i) * amplitude +
              Math.cos(x * 0.002 + waveStep) * 15;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      } else if (mode === "CONSTELLATION") {
        const cursorX = width * 0.5 + mouseX;
        const cursorY = height * 0.5 + mouseY;

        particles.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          for (let j = idx + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
              const alpha = (1 - dist / 130) * 0.6;
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = alpha;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              ctx.globalAlpha = 1;
            }
          }

          const cdx = p.x - cursorX;
          const cdy = p.y - cursorY;
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cdist < 180) {
            const calpha = (1 - cdist / 180) * 0.8;
            ctx.strokeStyle = "#38bdf8";
            ctx.globalAlpha = calpha;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(cursorX, cursorY);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }

          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } else if (mode === "RAINBOW_WARP") {
        const cx = width * 0.5 + mouseX * 0.1;
        const cy = height * 0.5 + mouseY * 0.1;

        warpLines.forEach((line) => {
          line.dist += line.speed;
          if (line.dist > width * 0.8) {
            line.dist = 10;
            line.angle = Math.random() * Math.PI * 2;
          }

          const x1 = cx + Math.cos(line.angle) * line.dist;
          const y1 = cy + Math.sin(line.angle) * line.dist;
          const x2 = cx + Math.cos(line.angle) * (line.dist + line.len);
          const y2 = cy + Math.sin(line.angle) * (line.dist + line.len);

          const alpha = Math.min(line.dist / (width * 0.4), 1);
          ctx.strokeStyle = line.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = Math.min(line.dist * 0.008 + 0.5, 3);
          ctx.shadowColor = line.color;
          ctx.shadowBlur = 10;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, mouseX, mouseY]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
