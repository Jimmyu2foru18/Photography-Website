import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, Upload, Camera, Save } from "lucide-react";
import { compressImage } from "../lib/imageUtils";

export function EditProfile() {
  const { appUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    pricingRules: "",
    instagram: "",
    linkedin: "",
    facebook: "",
    availability: "",
    equipment: "",
    profileImage: "",
    coverImage: "",
    published: true,
  });

  useEffect(() => {
    async function fetchData() {
      if (!appUser) return;
      
      try {
        const res = await fetch(`/api/photographers/${appUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            pricingRules: data.pricing_rules || "",
            instagram: data.instagram || "",
            facebook: data.facebook || "",
            linkedin: data.linkedin || "",
            availability: data.availability || "",
            equipment: data.equipment || "",
            profileImage: data.profile_image || "",
            coverImage: data.cover_image || "",
            published: true,
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
      setLoading(false);
    }
    fetchData();
  }, [appUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "profileImage" | "coverImage") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const base64 = await compressImage(file, field === "coverImage" ? 1200 : 400);
      setFormData(prev => ({ ...prev, [field]: base64 }));
    } catch (err) {
      console.error("Image compression failed", err);
      alert("Failed to compress image");
    }
  };

  const handleSave = async () => {
    if (!appUser) return;
    setSaving(true);
    
    try {
      const res = await fetch(`/api/photographers/${appUser.uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");
      
      setSaving(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to save profile. Make sure you are connected to the database.");
      setSaving(false);
    }
  };

  if (!appUser) return <Navigate to="/" />;
  if (loading) return <div className="flex h-screen items-center justify-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-24 font-sans">
      <div className="mb-12 border-b border-zinc-800 pb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-2 text-white tracking-tight">Edit Profile</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Update your public appearance</p>
        </div>
        <Link to="/dashboard" className="text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors">Back to Dashboard</Link>
      </div>

      <div className="space-y-8 bg-zinc-900 p-8 border border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 md:col-span-2">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-3">Cover Image</label>
              <div className="relative h-48 bg-black rounded overflow-hidden border-2 border-dashed border-zinc-800 flex items-center justify-center">
                {formData.coverImage ? (
                  <img src={formData.coverImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center text-zinc-600">
                    <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">No Cover Image</span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors cursor-pointer flex items-center justify-center group">
                  <span className="bg-white px-4 py-2 text-[10px] font-bold uppercase text-black opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">Upload Cover</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "coverImage")} />
                </label>
              </div>
            </div>

            <div className="flex items-end gap-6 relative -mt-12 ml-8">
              <div className="w-32 h-32 rounded-full border-4 border-[#0a0a0a] bg-zinc-900 overflow-hidden relative shadow-md">
                {formData.profileImage ? (
                  <img src={formData.profileImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 bg-black">
                    <Camera className="w-8 h-8" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/0 hover:bg-black/60 transition-colors cursor-pointer flex items-center justify-center group">
                  <span className="bg-white p-2 rounded-full text-black opacity-0 group-hover:opacity-100 transition-opacity"><Upload className="w-4 h-4" /></span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "profileImage")} />
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Display Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Instagram (URL or handle)</label>
            <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors" />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Facebook (URL)</label>
            <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors" />
          </div>
          
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">LinkedIn (URL)</label>
            <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Bio / Tagline</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors resize-none"></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Pricing Rules</label>
            <textarea name="pricingRules" value={formData.pricingRules} onChange={handleChange} rows={3} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors resize-none"></textarea>
          </div>
          
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Equipment</label>
            <input type="text" name="equipment" value={formData.equipment} onChange={handleChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors" />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Availability</label>
            <input type="text" name="availability" value={formData.availability} onChange={handleChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors" />
          </div>

        </div>
        
        <div className="mt-8 flex justify-end pt-6 border-t border-zinc-800">
           <button onClick={handleSave} disabled={saving} className="px-8 py-4 bg-white text-black hover:bg-zinc-200 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50">
             {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {saving ? "SAVING..." : "SAVE PROFILE"}
           </button>
        </div>
      </div>
    </div>
  );
}
