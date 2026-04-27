import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUP, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignUP && !name) {
        throw new Error("Name is required for sign up.");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }
      await signIn(email, name, isSignUP, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to authenticate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-[#0a0a0a] flex items-center justify-center py-16 px-4 font-sans h-full min-h-[80vh]">
      <div className="max-w-md w-full">
        <div className="bg-zinc-900 border border-zinc-800 p-8">
          <h2 className="text-3xl font-serif text-white mb-8 text-center tracking-tight">
            System Access
          </h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 text-red-400 text-xs uppercase tracking-widest font-bold">
              {error}
            </div>
          )}

          {/* Test Credentials Map */}
          <div className="flex flex-col gap-3 justify-center mb-8 px-4 py-4 bg-black border border-zinc-800 text-center">
            <h3 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest border-b border-zinc-800 pb-2 mb-2">Internal Access Credentials</h3>
            <div className="text-[10px] uppercase font-medium text-zinc-400 tracking-wider">
              <span className="text-white block mb-1">James McGuigan Jr</span>
              jimmyu2foru18@gmail.com / password123
            </div>
            <div className="text-[10px] uppercase font-medium text-zinc-400 tracking-wider mt-2 border-t border-zinc-800 pt-3">
              <span className="text-white block mb-1">Waleed Bhatti</span>
              waleedb219@gmail.com / password123
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">Identifier</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors text-xs placeholder-zinc-700"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">Passphrase</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-white focus:outline-none focus:border-zinc-500 transition-colors text-xs placeholder-zinc-700"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 mt-8 bg-white text-black hover:bg-zinc-200 font-bold text-[11px] uppercase tracking-widest transition-colors disabled:opacity-50"
            >
              {loading ? "INITIALIZING..." : (isSignUP ? "REGISTER ACCESS" : "AUTHORIZE")}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center">
            <button 
              type="button" 
              onClick={() => setIsSignUp(!isSignUP)} 
              className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-600 hover:text-white transition-colors"
            >
              {isSignUP ? "RETURN TO LOGIN" : "REQUEST ACCESS"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
