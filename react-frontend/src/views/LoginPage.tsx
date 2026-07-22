import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useNavigate } from "@/lib/react-router-compat";
import { Lock, User, Eye, EyeOff, ShieldCheck, Sparkles, KeyRound, Zap, Waves, Network, Compass, Layers, Sliders, Box, Cpu, Eye as EyeIcon, Minimize2 } from "lucide-react";
import authService from "../services/authService";

export type BgStyleMode = "3D_GRID" | "COLOR_WAVES" | "CONSTELLATION" | "RAINBOW_WARP" | "NEBULA";
export type FormStyleMode = "TILT_3D" | "HOLO_3D" | "GLASS_FLIP" | "FLAT_CLASSIC";

interface BgPreset {
  id: BgStyleMode;
  name: string;
  icon: React.FC<{ className?: string }>;
  badgeColor: string;
}

interface FormPreset {
  id: FormStyleMode;
  name: string;
  icon: React.FC<{ className?: string }>;
  desc: string;
}

const BG_PRESETS: BgPreset[] = [
  { id: "3D_GRID", name: "3D Cyber Laser Grid", icon: Zap, badgeColor: "text-cyan-400" },
  { id: "COLOR_WAVES", name: "Multi-Color Wave Streams", icon: Waves, badgeColor: "text-pink-400" },
  { id: "CONSTELLATION", name: "3D Constellation Lines", icon: Network, badgeColor: "text-emerald-400" },
  { id: "RAINBOW_WARP", name: "Rainbow Hyperspace Lines", icon: Compass, badgeColor: "text-amber-400" },
  { id: "NEBULA", name: "Glass Nebula Mesh", icon: Layers, badgeColor: "text-purple-400" },
];

const FORM_PRESETS: FormPreset[] = [
  { id: "TILT_3D", name: "3D Interactive Tilt Card", icon: Box, desc: "Mouse 3D parallax tilt & depth layering" },
  { id: "HOLO_3D", name: "3D Holographic Cyber Card", icon: Cpu, desc: "Neon hue scan lines & HUD glow brackets" },
  { id: "GLASS_FLIP", name: "3D Floating Glass Card", icon: Sparkles, desc: "Levitating frosted glass backdrop" },
  { id: "FLAT_CLASSIC", name: "Classic Corporate Flat Card", icon: Minimize2, desc: "Minimalist corporate slate card" },
];

// Multi-Style Animated 3D Line Canvas Component
const MultiStyle3DLineCanvas: React.FC<{ mode: BgStyleMode; mouseX: number; mouseY: number }> = ({ mode, mouseX, mouseY }) => {
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

      // Base Dark Canvas Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, "#060913");
      bgGrad.addColorStop(0.5, "#0b0f1f");
      bgGrad.addColorStop(1, "#040710");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      if (mode === "3D_GRID") {
        // --- RENDER 3D CYBER LASER GRID ---
        const horizonY = height * 0.38 + mouseY * 0.05;
        const horizonX = width * 0.5 + mouseX * 0.05;

        // Radiating Vertical Perspective Lines
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

        // Running Horizontal 3D Lines
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

        // Multi-Color Traveling Lasers
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
        // --- RENDER MULTI-COLOR SINE WAVE LINES ---
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
            const y = yOffset + Math.sin(x * frequency + waveStep + i) * amplitude + Math.cos(x * 0.002 + waveStep) * 15;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      } else if (mode === "CONSTELLATION") {
        // --- RENDER 3D PARTICLE CONSTELLATION LINES ---
        const cursorX = width * 0.5 + mouseX;
        const cursorY = height * 0.5 + mouseY;

        // Update and draw particles
        particles.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Connect nearby particles with multi-colored lines
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

          // Connect to cursor
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

          // Draw node
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } else if (mode === "RAINBOW_WARP") {
        // --- RENDER RAINBOW HYPERSPACE SPEED LINES ---
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
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const navigate = useNavigate();

  // Super Admin Options: Background Style & Form Card 3D Animation Style
  const [bgStyle, setBgStyle] = useState<BgStyleMode>("3D_GRID");
  const [formStyle, setFormStyle] = useState<FormStyleMode>("TILT_3D");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedBg = localStorage.getItem("mtp_login_bg_style") as BgStyleMode;
      if (savedBg) setBgStyle(savedBg);
      const savedForm = localStorage.getItem("mtp_login_form_style") as FormStyleMode;
      if (savedForm) setFormStyle(savedForm);
    }
  }, []);

  const selectBgStyle = (mode: BgStyleMode) => {
    setBgStyle(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("mtp_login_bg_style", mode);
    }
  };

  const selectFormStyle = (mode: FormStyleMode) => {
    setFormStyle(mode);
    if (typeof window !== "undefined") {
      localStorage.setItem("mtp_login_form_style", mode);
    }
  };

  // Mouse position for 3D Parallax Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [rawMouse, setRawMouse] = useState({ x: 0, y: 0 });

  // Smooth physics springs for 3D rotation
  const rotateXSpring = useSpring(useTransform(mouseY, [-300, 300], [12, -12]), {
    stiffness: 250,
    damping: 25,
  });
  const rotateYSpring = useSpring(useTransform(mouseX, [-300, 300], [-12, 12]), {
    stiffness: 250,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offX = e.clientX - centerX;
    const offY = e.clientY - centerY;
    mouseX.set(offX);
    mouseY.set(offY);
    setRawMouse({ x: offX, y: offY });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setRawMouse({ x: 0, y: 0 });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.login(username, password);
      navigate("/");
    } catch (err: any) {
      const errorData = err.response?.data;
      const message =
        typeof errorData === "object"
          ? errorData.message || JSON.stringify(errorData)
          : errorData;
      setError(message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const currentBgPreset = BG_PRESETS.find((p) => p.id === bgStyle) || BG_PRESETS[0];
  const currentFormPreset = FORM_PRESETS.find((p) => p.id === formStyle) || FORM_PRESETS[0];
  const CurrentFormIcon = currentFormPreset.icon;

  // Determine card animation properties based on selected formStyle
  const getCardMotionProps = () => {
    switch (formStyle) {
      case "TILT_3D":
        return {
          style: {
            rotateX: rotateXSpring,
            rotateY: rotateYSpring,
            transformStyle: "preserve-3d" as const,
          },
          className:
            "max-w-md w-full bg-white/10 dark:bg-gray-900/40 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/90 border border-white/20 dark:border-gray-700/60 relative z-10 group",
        };
      case "HOLO_3D":
        return {
          style: { transformStyle: "preserve-3d" as const },
          animate: {
            borderColor: ["rgba(99, 102, 241, 0.6)", "rgba(236, 72, 153, 0.6)", "rgba(56, 189, 248, 0.6)", "rgba(99, 102, 241, 0.6)"],
            boxShadow: [
              "0 0 35px rgba(99, 102, 241, 0.3)",
              "0 0 35px rgba(236, 72, 153, 0.3)",
              "0 0 35px rgba(56, 189, 248, 0.3)",
              "0 0 35px rgba(99, 102, 241, 0.3)",
            ],
          },
          transition: { duration: 6, repeat: Infinity, ease: "linear" as const },
          className:
            "max-w-md w-full bg-gray-950/80 backdrop-blur-3xl rounded-3xl p-8 sm:p-10 border-2 relative z-10 group shadow-2xl",
        };
      case "GLASS_FLIP":
        return {
          style: { transformStyle: "preserve-3d" as const },
          animate: { y: [-6, 6, -6] },
          transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
          className:
            "max-w-md w-full bg-white/15 dark:bg-gray-900/50 backdrop-blur-3xl rounded-3xl p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/30 dark:border-white/10 relative z-10 group",
        };
      case "FLAT_CLASSIC":
      default:
        return {
          style: {},
          className:
            "max-w-md w-full bg-slate-900 rounded-2xl p-8 sm:p-10 shadow-2xl border border-slate-800 relative z-10",
        };
    }
  };

  const cardMotion = getCardMotionProps();

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="min-h-screen w-full flex items-center justify-center bg-[#060913] p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white"
      style={{ perspective: "1200px" }}
    >
      {/* Multi-Style Canvas & Nebula Background Render */}
      {bgStyle === "NEBULA" ? (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -40, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-transparent rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              x: [0, -60, 0],
              y: [0, 50, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/5 w-[600px] h-[600px] bg-gradient-to-bl from-blue-600/25 via-cyan-500/20 to-transparent rounded-full blur-[140px]"
          />
        </div>
      ) : (
        <MultiStyle3DLineCanvas mode={bgStyle} mouseX={rawMouse.x} mouseY={rawMouse.y} />
      )}

      {/* Super Admin Control Bar: Background Line & Form Card 3D Animation Settings */}
      <div className="absolute top-6 right-6 z-30">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowControlPanel(!showControlPanel)}
            className="flex items-center gap-2.5 px-4 py-2.5 bg-white/10 dark:bg-gray-900/70 backdrop-blur-2xl border border-white/20 dark:border-gray-700/60 rounded-2xl text-xs font-black text-white hover:bg-white/20 dark:hover:bg-gray-800 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>3D Theme Customizer</span>
          </button>

          {/* Unified Preset Selection Control Panel */}
          <AnimatePresence>
            {showControlPanel && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 p-4 bg-gray-950/95 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-2xl space-y-4 z-40"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                    <Sparkles size={12} />
                    Super Admin 3D Options
                  </span>
                  <button
                    onClick={() => setShowControlPanel(false)}
                    className="text-gray-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Section 1: Background Line Animation Presets */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 block mb-2">
                    1. Background Line Style:
                  </label>
                  <div className="space-y-1">
                    {BG_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      const isSelected = bgStyle === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => selectBgStyle(preset.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                            isSelected
                              ? "bg-indigo-600/40 text-[#ffffff] border border-indigo-400/40 shadow"
                              : "text-gray-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${preset.badgeColor}`} />
                          <span className="flex-1 truncate">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Form Card 3D Animation Presets */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-wider text-gray-400 block mb-2">
                    2. Login Form Card 3D Animation:
                  </label>
                  <div className="space-y-1">
                    {FORM_PRESETS.map((preset) => {
                      const Icon = preset.icon;
                      const isSelected = formStyle === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => selectFormStyle(preset.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                            isSelected
                              ? "bg-purple-600/40 text-white border border-purple-400/40 shadow"
                              : "text-gray-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-cyan-400" />
                          <div className="flex-1 truncate">
                            <p className="line-clamp-1">{preset.name}</p>
                            <p className="text-[9px] text-gray-400 font-medium line-clamp-1">{preset.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Login Card Container with Dynamic 3D Style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0, ...(cardMotion.animate || {}) }}
        transition={cardMotion.transition || ({ duration: 0.6, ease: "easeOut" } as const)}
        style={cardMotion.style}
        className={cardMotion.className}
      >
        {/* Subtle 3D Glass Sheen Overlay */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />

        {/* Floating 3D Header Badge */}
        <div style={formStyle === "TILT_3D" ? { transform: "translateZ(50px)" } : {}} className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.1, rotateZ: 10 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl shadow-indigo-500/40 mb-5 relative group cursor-pointer"
          >
            <Lock size={36} className="relative z-10" />
            <div className="absolute inset-0 rounded-3xl bg-indigo-500/50 blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            MTP <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">Ecosystem</span>
          </h1>
          <p className="text-indigo-200/80 font-extrabold uppercase text-[10px] sm:text-[11px] tracking-[0.35em] mt-2.5 flex items-center justify-center gap-1.5">
            <Sparkles size={12} className="text-indigo-400" />
            Secure Enterprise Gateway
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={formStyle === "TILT_3D" ? { transform: "translateZ(30px)" } : {}}
            className="mb-6 p-4 bg-rose-500/15 border border-rose-500/40 backdrop-blur-md rounded-2xl text-rose-300 text-xs font-bold text-center flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form with 3D Field Layering */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
          style={formStyle === "TILT_3D" ? { transform: "translateZ(40px)" } : {}}
        >
          {/* Username Field */}
          <div>
            <label className="text-[10px] sm:text-xs font-black text-indigo-200 uppercase tracking-widest mb-2 block pl-1">
              Username or Email
            </label>
            <div className="relative group">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-white transition-colors"
                size={18}
              />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 text-white placeholder-indigo-200/40 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all backdrop-blur-md font-semibold text-sm shadow-inner"
                placeholder="admin@mtp.org"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-[10px] sm:text-xs font-black text-indigo-200 uppercase tracking-widest mb-2 block pl-1">
              Password
            </label>
            <div className="relative group">
              <KeyRound
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-white transition-colors"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-white/10 dark:bg-gray-800/50 border border-white/20 dark:border-gray-700 text-white placeholder-indigo-200/40 rounded-2xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all backdrop-blur-md font-semibold text-sm shadow-inner"
                placeholder="••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-300 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 3D Action Submit Button */}
          <motion.div
            style={formStyle === "TILT_3D" ? { transform: "translateZ(60px)" } : {}}
            className="pt-2"
          >
            <motion.button
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer border border-white/20"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <Sparkles size={16} />
                </>
              )}
            </motion.button>
          </motion.div>
        </form>

        {/* Quick Demo Credentials Footer */}
        <div
          style={formStyle === "TILT_3D" ? { transform: "translateZ(30px)" } : {}}
          className="mt-8 pt-6 border-t border-white/10 text-center"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-300/70">
            MTP Microservices Security Standard
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
