import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, Mail, Lock, User, Camera, Instagram } from "lucide-react";

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, isSignUp, name, instagram, facebook, linkedin, role: 'photographer' })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      login(data);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-3">
              {isSignUp ? "Join the Studio" : "Artist Login"}
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500">
              {isSignUp ? "Create your professional profile" : "Manage your portfolio & bookings"}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold tracking-widest p-4 mb-8 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            )}

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-2">
                  <Instagram className="w-3 h-3" /> Instagram Handle
                </label>
                <input
                  type="text"
                  required
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="username"
                />
              </div>
            )}

            {isSignUp && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Facebook URL</label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">LinkedIn URL</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="artist@jwstudios.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-2">
                  <Lock className="w-3 h-3" /> Password
                </label>
                {!isSignUp && (
                  <Link 
                    to="/reset-password"
                    className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-white transition-colors"
                  >
                    Reset?
                  </Link>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isSignUp ? <Camera className="w-4 h-4" /> : null}
              {loading ? "AUTHENTICATING..." : isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-800 text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-4">
              {isSignUp ? "Already have an account?" : "New to the platform?"}
            </p>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white hover:text-red-400 text-[10px] uppercase font-bold tracking-[0.2em] transition-colors"
            >
              {isSignUp ? "BACK TO LOGIN" : "REGISTER AS PHOTOGRAPHER"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
