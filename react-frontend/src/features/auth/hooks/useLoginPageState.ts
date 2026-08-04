import { useState, useEffect } from "react";
import { useMotionValue, useTransform, useSpring } from "framer-motion";
import { useNavigate } from "@/lib/react-router-compat";
import authService from "@/services/authService";
import { Zap, Waves, Network, Compass, Layers, Box, Cpu, Sparkles, Minimize2 } from "lucide-react";

export type BgStyleMode = "3D_GRID" | "COLOR_WAVES" | "CONSTELLATION" | "RAINBOW_WARP" | "NEBULA";
export type FormStyleMode = "TILT_3D" | "HOLO_3D" | "GLASS_FLIP" | "FLAT_CLASSIC";

export interface BgPreset {
  id: BgStyleMode;
  name: string;
  icon: any;
  badgeColor: string;
}

export interface FormPreset {
  id: FormStyleMode;
  name: string;
  icon: any;
  desc: string;
}

export const BG_PRESETS: BgPreset[] = [
  { id: "3D_GRID", name: "3D Cyber Laser Grid", icon: Zap, badgeColor: "text-cyan-400" },
  { id: "COLOR_WAVES", name: "Multi-Color Wave Streams", icon: Waves, badgeColor: "text-pink-400" },
  { id: "CONSTELLATION", name: "3D Constellation Lines", icon: Network, badgeColor: "text-emerald-400" },
  { id: "RAINBOW_WARP", name: "Rainbow Hyperspace Lines", icon: Compass, badgeColor: "text-amber-400" },
  { id: "NEBULA", name: "Glass Nebula Mesh", icon: Layers, badgeColor: "text-purple-400" },
];

export const FORM_PRESETS: FormPreset[] = [
  { id: "TILT_3D", name: "3D Interactive Tilt Card", icon: Box, desc: "Mouse 3D parallax tilt & depth layering" },
  { id: "HOLO_3D", name: "3D Holographic Cyber Card", icon: Cpu, desc: "Neon hue scan lines & HUD glow brackets" },
  { id: "GLASS_FLIP", name: "3D Floating Glass Card", icon: Sparkles, desc: "Levitating frosted glass backdrop" },
  { id: "FLAT_CLASSIC", name: "Classic Corporate Flat Card", icon: Minimize2, desc: "Minimalist corporate slate card" },
];

export function useLoginPageState() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const navigate = useNavigate();

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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [rawMouse, setRawMouse] = useState({ x: 0, y: 0 });

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
            borderColor: [
              "rgba(99, 102, 241, 0.6)",
              "rgba(236, 72, 153, 0.6)",
              "rgba(56, 189, 248, 0.6)",
              "rgba(99, 102, 241, 0.6)",
            ],
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

  return {
    username,
    setUsername,
    password,
    setPassword,
    error,
    setError,
    loading,
    setLoading,
    showPassword,
    setShowPassword,
    showControlPanel,
    setShowControlPanel,
    bgStyle,
    setBgStyle,
    formStyle,
    setFormStyle,
    selectBgStyle,
    selectFormStyle,
    mouseX,
    mouseY,
    rawMouse,
    handleMouseMove,
    handleMouseLeave,
    handleLogin,
    currentBgPreset,
    currentFormPreset,
    getCardMotionProps,
  };
}
