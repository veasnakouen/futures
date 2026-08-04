import React from "react";
import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, ShieldCheck, KeyRound } from "lucide-react";

interface Props {
  state: any;
}

export default function LoginFormCard({ state }: Props) {
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    loading,
    showPassword,
    setShowPassword,
    handleLogin,
    getCardMotionProps,
    currentFormPreset,
  } = state;

  const cardMotion = getCardMotionProps();

  return (
    <motion.div {...cardMotion}>
      {/* Brand Header & Logo */}
      <div className="text-center space-y-2 mb-8">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="inline-flex p-4 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-indigo-500/30 mb-2 cursor-pointer"
        >
          <ShieldCheck size={36} />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Mlup Tapang MTP System
        </h2>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">
          Microservices Core Enterprise Portal
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-xs font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-300 uppercase tracking-wider block">
            Username / Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User size={18} />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="superadmin / user@mloptapang.org"
              className="w-full pl-10 pr-4 py-3 bg-white/5 dark:bg-gray-950/60 border border-white/10 dark:border-gray-700/60 rounded-xl text-sm font-semibold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-black text-gray-300 uppercase tracking-wider block">
            Security Key / Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-11 py-3 bg-white/5 dark:bg-gray-950/60 border border-white/10 dark:border-gray-700/60 rounded-xl text-sm font-semibold text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-semibold text-gray-400 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              defaultChecked
              className="rounded bg-white/10 border-white/20 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Keep session active</span>
          </label>
          <span className="hover:text-indigo-400 transition-colors cursor-pointer">
            Forgot Password?
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300 transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <KeyRound size={16} /> Authenticate System Access
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
