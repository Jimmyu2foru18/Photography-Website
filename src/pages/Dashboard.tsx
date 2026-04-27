import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { MessageSquare, Calendar, Image as ImageIcon, Loader2 } from "lucide-react";

export function Dashboard() {
  const { appUser } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function fetchData() {
      if (!appUser) return;
      
      // Mock bookings
      setBookings([
        {
          id: "b1",
          userName: "Alice Smith",
          status: "pending",
          message: "Looking for a portrait session.",
          budgetOffer: "$300"
        }
      ]);
      setLoading(false);
    }
    fetchData();
  }, [appUser]);

  const [isUploading, setIsUploading] = useState(false);

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !appUser) return;

    setIsUploading(true);
    try {
      const { compressImage } = await import("../lib/imageUtils");
      const base64 = await compressImage(file, 1200);

      // In a real app we'd save this to a server
      console.log("Mock saved image:", base64.substring(0, 50) + "...");
      
      setTimeout(() => {
        alert("Image uploaded successfully! (Mock)");
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      setIsUploading(false);
    }
  };

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
          <section>
            <div className="flex items-center mb-6 border-b border-zinc-900 pb-4">
              <Calendar className="w-5 h-5 mr-3 text-white" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Your Bookings</h2>
            </div>
            
            {bookings.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 p-8 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                No bookings found. {appUser.role === "client" && <Link to="/photographers" className="text-white hover:text-zinc-300 underline block mt-4">Find a photographer</Link>}
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b.id} className="bg-zinc-900 border border-zinc-800 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="font-serif text-2xl text-white">
                          {appUser.role === "photographer" ? b.userName : 'Booking'}
                        </span>
                        <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded ${
                          b.status === "pending" ? "bg-amber-900/30 text-amber-500" :
                          b.status === "accepted" ? "bg-emerald-900/30 text-emerald-500" :
                          "bg-rose-900/30 text-rose-500"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider line-clamp-2 max-w-lg mb-2">{b.message}</p>
                      <p className="text-[10px] font-bold text-white tracking-widest">OFFER: {b.budgetOffer}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-5 py-2 border border-zinc-800 bg-black text-zinc-300 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-8">
          {appUser.role === "photographer" && (
            <section className="bg-zinc-900 border border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
                <div className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-3 text-white" />
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Portfolio Manager</h2>
                </div>
              </div>
              <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest mb-6 leading-relaxed">Upload new images to your portfolio to share with clients.</p>
              
              {!isUploading ? (
                <label className="w-full flex flex-col items-center justify-center gap-3 py-8 bg-black border-2 border-dashed border-zinc-800 cursor-pointer hover:border-zinc-500 transition-colors group">
                  <ImageIcon className="w-6 h-6 text-zinc-600 group-hover:text-white" />
                  <span className="font-bold text-[11px] uppercase tracking-widest text-zinc-500 group-hover:text-white">Select Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePortfolioUpload} />
                </label>
              ) : (
                <div className="bg-black border border-zinc-800 p-5">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                       Processing and compressing image...
                     </span>
                     <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                </div>
              )}
            </section>
          )}

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
        </div>
      </div>
    </div>
  );
}
