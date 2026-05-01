import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { User, Settings } from "lucide-react";

export function Dashboard() {
  const { appUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appUser) {
      setLoading(false);
    }
  }, [appUser]);

  if (!appUser) return <Navigate to="/" />;

  if (loading) return <div className="flex h-screen items-center justify-center text-zinc-400">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 font-sans">
      <div className="mb-12 border-b border-zinc-800 pb-8">
        <h1 className="text-4xl md:text-5xl font-serif mb-2 text-white tracking-tight">Welcome, {appUser.name}</h1>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{appUser.role} Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-zinc-900 border border-zinc-800 p-8 text-center h-full flex flex-col justify-center">
             <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6">Studio Overview</h2>
             <p className="text-xs text-zinc-400 uppercase tracking-widest leading-loose">
               Manage your professional presence from this command center. 
               Use the settings to update your profile bio, equipment, and public artifacts.
             </p>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-zinc-900 border border-zinc-800 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white"></div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-zinc-800 pb-4 mt-2">Profile Settings</h2>
            
            <div className="space-y-4">
              <Link to="/dashboard/edit-profile" className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors block">
                Edit Profile Info
              </Link>
              
              <Link to={`/photographers/${appUser.uid}`} className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors block">
                View Public Profile
              </Link>
            </div>
          </section>
          
          {appUser.role === "admin" && (
            <Link to="/admin" className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 hover:text-red-500 transition-colors block text-center">
              Access System Directory →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
