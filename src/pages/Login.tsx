// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/lib/authService";
import { useAuth } from "@/context/AuthContext";
import { setAuth } from "@/lib/authStorage";
import logo from "@/assets/logo.svg";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.login(email, password);
      setAuth({
        token: res.token,
        hrx_session_id: res.hrx_session_id,
        user: res.user,
      });
      login(res.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // replace the outer div in Login.tsx
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center px-4 z-50">
      {/* Centered Card */}
      <div className="w-[400px] bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-5">
            <img
              src={logo}
              alt="CereBree"
              className="h-10 w-auto object-contain"
            />
            {/* <span className="text-white text-xl font-semibold tracking-wide">
              CereBree
            </span> */}
          </div>
          <h1 className="text-white text-2xl font-bold mb-1">Welcome to HRX</h1>
          <p className="text-white/40 text-sm">Please log in to your account</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@company.com"
              disabled={loading}
              autoComplete="email"
              className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
          </div>

          <div>
            <label className="block text-sm text-white/60 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              autoComplete="current-password"
              className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl mt-2 hover:opacity-90 transition shadow-[0_0_20px_hsl(160_62%_48%/0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p className="text-xs text-center text-white/20 mt-6">
          Powered by Cerebree AI
        </p>
      </div>
    </div>
  );
}
