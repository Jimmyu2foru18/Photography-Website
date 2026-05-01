import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Lock, Mail, Loader2, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    setError("");

    try {
      const endpoint = token ? '/api/auth/reset-password' : '/api/auth/change-password';
      const body = token 
        ? { token, password } 
        : { email, oldPassword, newPassword: password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');

      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[#0a0a0a]">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-12 text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-serif text-white mb-4">Password Updated</h2>
          <p className="text-zinc-400 text-sm mb-8 uppercase tracking-widest font-bold">Your password has been changed successfully. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-serif text-white mb-3">
              {token ? "Set New Password" : "Reset Password"}
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-500">
              {token ? "Enter your new password below" : "Provide your details to update your password"}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold tracking-widest p-4 mb-8 text-center flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!token && (
              <>
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
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-2">
                    <Lock className="w-3 h-3" /> Old Password
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-2">
                <Lock className="w-3 h-3" /> {token ? "New Password" : "New Password"}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
