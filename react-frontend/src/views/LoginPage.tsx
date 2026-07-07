import React, { useState } from "react";
import { useNavigate } from '@/lib/react-router-compat';
import { Lock, User, Eye, EyeOff } from "lucide-react";
import authService from "../services/authService";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
      setError(message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-yellow-900 to-cyan-900 p-4 relative overflow-hidden">
      {/* Decorative glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/30 rounded blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px]  rounded blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded shadow-xl border border-white/20 p-10 relative z-10 animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full hover:scale-110 bg-indigo-600 shadow-lg shadow-indigo-500/30 mb-6">
            <Lock className="text-white" size={28} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            MTP <span className="text-indigo-400">Systems</span>
          </h1>
          <p className="text-indigo-200/70 font-bold uppercase text-[11px] tracking-[0.3em] mt-3">
            Authentication Gateway
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 backdrop-blur-md rounded text-red-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2 block pl-1">
              Username
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
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 text-white placeholder-indigo-200/30 rounded focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-all backdrop-blur-md"
                placeholder="admin@mtp.org"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2 block pl-1">
              Password
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300 group-focus-within:text-white transition-colors"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 text-white placeholder-indigo-200/30 rounded focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent outline-none transition-all backdrop-blur-md"
                placeholder="********"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-black text-[16px] tracking-widest shadow-lg shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-50 hover:shadow-indigo-500/50"
          >
            {loading ? "Validating..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
