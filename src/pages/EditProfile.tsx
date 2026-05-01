import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2, Upload, Camera, Save, Plus, Trash2 } from "lucide-react";
import { compressImage } from "../lib/imageUtils";

export function EditProfile() {
  const { appUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  
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

  const [portfolio, setPortfolio] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!appUser) return;
      
      try {
        const res = await fetch(`/api/photographers/${appUser.uid}`);
        if (res.ok) {
          const data = await res.json();
          // Add cache busting to existing images
          const cacheBuster = `?t=${Date.now()}`;
          setFormData({
            name: data.name || "",
            bio: data.bio || "",
            pricingRules: data.pricing_rules || "",
            instagram: data.instagram || "",
            facebook: data.facebook || "",
            linkedin: data.linkedin || "",
            availability: data.availability || "",
            equipment: data.equipment || "",
            profileImage: data.profile_image ? (data.profile_image.includes('data:image') ? data.profile_image : `${data.profile_image}${cacheBuster}`) : "",
            coverImage: data.cover_image ? (data.cover_image.includes('data:image') ? data.cover_image : `${data.cover_image}${cacheBuster}`) : "",
            published: true,
          });
        }

        const portRes = await fetch(`/api/photographers/${appUser.uid}/portfolio`);
        if (portRes.ok) {
          setPortfolio(await portRes.json());
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

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !appUser) return;
    
    setUploadingPortfolio(true);
    try {
      const base64 = await compressImage(file, 1000);
      const res = await fetch(`/api/portfolio/${appUser.uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      if (res.ok) {
        const data = await res.json();
        // The API returns {success, imageUrl}, but we need the ID too for deletion
        // Since we just uploaded it, we might need to refresh the portfolio or have the API return the ID
        // For now, let's just refresh the portfolio to be safe and get the real IDs
        const portRes = await fetch(`/api/photographers/${appUser.uid}/portfolio`);
        if (portRes.ok) {
          setPortfolio(await portRes.json());
        }
      }
    } catch (err) {
      console.error("Portfolio upload failed", err);
    } finally {
      setUploadingPortfolio(false);
    }
  };

  const handleDeletePortfolioImage = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPortfolio(prev => prev.filter(img => img.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete image");
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert("An error occurred while deleting the image");
    }
  };

  const handleSave = async () => {
    if (!appUser) return;
    setSaving(true);
    
    // Create a copy of formData without cache busters for saving
    const dataToSave = {
      ...formData,
      profileImage: formData.profileImage.split('?t=')[0],
      coverImage: formData.coverImage.split('?t=')[0]
    };
    
    try {
      const res = await fetch(`/api/photographers/${appUser.uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (!res.ok) throw new Error("Update failed");
      
      setSaving(false);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to save profile.");
      setSaving(false);
    }
  };

  if (!appUser) return <Navigate to="/" />;
  if (loading) return <div className="flex h-screen items-center justify-center bg-black text-white">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-24 font-sans text-zinc-100">
      <div className="mb-8 md:mb-12 border-b border-zinc-800 pb-6 md:pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif mb-2 text-white tracking-tight">Edit Profile</h1>
          <p className="text-[9px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Update your public appearance</p>
        </div>
        <Link to="/dashboard" className="text-[9px] md:text-[10px] uppercase font-bold text-zinc-500 hover:text-white transition-colors">Back to Dashboard</Link>
      </div>

      <div className="space-y-8 md:space-y-12 bg-zinc-900 p-5 md:p-8 border border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Header Images Section */}
          <div className="space-y-6 md:col-span-2">
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-3">Cover Image</label>
              <div className="relative h-40 md:h-48 bg-black rounded overflow-hidden border-2 border-dashed border-zinc-800 flex items-center justify-center">
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

            <div className="flex items-end gap-6 relative -mt-10 md:-mt-12 ml-4 md:ml-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#0a0a0a] bg-zinc-900 overflow-hidden relative shadow-md">
                {formData.profileImage ? (
                  <img src={formData.profileImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 bg-black">
                    <Camera className="w-6 h-6 md:w-8 md:h-8" />
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

          <div className="md:col-span-2 border-t border-zinc-800 pt-6 md:pt-8 mt-2 md:mt-4">
            <h3 className="text-[10px] uppercase font-bold tracking-[0.3em] text-white mb-6">Social Communications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Instagram (handle)</label>
                <input type="text" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors" placeholder="username" />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">Facebook (URL)</label>
                <input type="text" name="facebook" value={formData.facebook} onChange={handleChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors" placeholder="https://facebook.com/yourprofile" />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-2">LinkedIn (URL)</label>
                <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white text-[12px] focus:outline-none focus:border-zinc-500 transition-colors" placeholder="https://linkedin.com/in/yourprofile" />
              </div>
            </div>
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

        {/* Portfolio Management Section */}
        <div className="pt-12 border-t border-zinc-800">
           <h3 className="text-xl font-serif text-white mb-6">Portfolio Gallery</h3>
           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <label className="aspect-square border-2 border-dashed border-zinc-800 hover:border-zinc-500 transition-colors flex flex-col items-center justify-center cursor-pointer group bg-black/20">
                 {uploadingPortfolio ? (
                   <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                 ) : (
                   <>
                    <Plus className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors mb-2" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400">Add Image</span>
                   </>
                 )}
                 <input type="file" accept="image/*" className="hidden" onChange={handlePortfolioUpload} disabled={uploadingPortfolio} />
              </label>

              {portfolio.map((img) => (
                <div key={img.id} className="aspect-square relative group bg-black border border-zinc-800 overflow-hidden">
                   <img src={img.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                   <button 
                     onClick={() => handleDeletePortfolioImage(img.id)}
                     className="absolute top-2 right-2 p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                     title="Delete Image"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              ))}
           </div>
        </div>
        
        <div className="mt-8 flex justify-end pt-6 border-t border-zinc-800">
           <button onClick={handleSave} disabled={saving} className="px-8 py-4 bg-white text-black hover:bg-zinc-200 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50">
             {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {saving ? "SAVING..." : "SAVE CHANGES"}
           </button>
        </div>
      </div>
    </div>
  );
}
