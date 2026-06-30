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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-md shadow-xl p-8 border dark:border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black dark:text-white tracking-tight">
            MTP Systems
          </h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">
            Authentication Gateway
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-md text-red-600 text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
              Username
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="admin@mtp.org"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Validating..." : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
