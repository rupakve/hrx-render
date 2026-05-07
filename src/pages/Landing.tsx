// src/pages/Landing.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/lib/authService";
import { useAuth } from "@/context/AuthContext";
import { setAuth } from "@/lib/authStorage";
import hrxTopImg from "@/assets/hrx_top_img.svg";

export default function Landing() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
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
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center px-4 overflow-y-auto">
      {/* HRX Image */}
      <img
        src={hrxTopImg}
        alt="HRX"
        className="w-full max-w-xl object-contain"
      />

      {/* Tagline */}
      <p
        className="mt-6 text-base max-w-2xl leading-relaxed text-center"
        style={{ color: "#112521" }}
      >
        HRX is the framework for governing how organizations deliver services,
        manage resources, and protect the attention of their people.
      </p>

      {/* Demo Button */}
      {/* <button
        onClick={() => setShowModal(true)}
        className="mt-10 px-10 py-3.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/90 transition shadow-[0_0_20px_hsl(160_62%_48%/0.4)]"
      >
        Request a Demo
      </button> */}

      {isAuthenticated ? (
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-10 px-10 py-3.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_hsl(160_62%_48%/0.4)]"
        >
          Go to Dashboard →
        </button>
      ) : (
        <button
          onClick={() => setShowModal(true)}
          className="mt-10 group relative px-10 py-3.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_hsl(160_62%_48%/0.4)] overflow-hidden"
        >
          {/* Default text — fades out on hover */}
          <span className="block transition-opacity duration-700 group-hover:opacity-0">
            Request a Demo
          </span>

          {/* Hover text — fades in on hover */}
          <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-700 opacity-0 group-hover:opacity-100">
            Click to Continue
          </span>
        </button>
      )}
      {/* Login Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Card */}
          <div className="relative z-10 w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition text-xl leading-none"
            >
              ✕
            </button>

            {/* Logo + Title */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center gap-2.5 mb-5">
                <img
                  src={hrxTopImg}
                  alt="CereBree"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <h1 className="text-white text-2xl font-bold mb-1">
                Welcome to HRX
              </h1>
              <p className="text-white/40 text-sm">
                Please log in to your account
              </p>
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
      )}
    </div>
  );
}
