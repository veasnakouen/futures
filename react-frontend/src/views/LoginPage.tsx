import React from "react";
import { motion } from "framer-motion";
import { useLoginPageState } from "@/features/auth/hooks/useLoginPageState";

import MultiStyle3DLineCanvas from "@/features/auth/components/login/MultiStyle3DLineCanvas";
import LoginPagePresetsToolbar from "@/features/auth/components/login/LoginPagePresetsToolbar";
import LoginFormCard from "@/features/auth/components/login/LoginFormCard";

const LoginPage: React.FC = () => {
  const state = useLoginPageState();
  const { bgStyle, rawMouse, handleMouseMove, handleMouseLeave } = state;

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
      <LoginPagePresetsToolbar state={state} />

      {/* Interactive 3D Login Card */}
      <LoginFormCard state={state} />
    </div>
  );
};

export default LoginPage;
