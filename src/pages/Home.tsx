import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface Photographer {
  id: string;
  name: string;
  bio: string;
  role: string;
  profile_image: string;
  cover_image: string;
  pricing_rules: string;
}

export function Home() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/photographers')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Add cache busting to images
          const cacheBuster = `?t=${Date.now()}`;
          const updated = data.map(p => ({
            ...p,
            profile_image: p.profile_image ? (p.profile_image.includes('?t=') ? p.profile_image : `${p.profile_image}${cacheBuster}`) : "",
            cover_image: p.cover_image ? (p.cover_image.includes('?t=') ? p.cover_image : `${p.cover_image}${cacheBuster}`) : ""
          }));
          setPhotographers(updated);
        }
      })
      .catch(err => console.error("Error fetching photographers", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full w-full bg-[#0a0a0a] text-zinc-100 font-sans">
      {/* Left Branding Rail */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex w-24 border-r border-zinc-800 flex-col items-center py-12 justify-between shrink-0 bg-black"
      >
        <span className="text-vertical rotate-180 text-[10px] uppercase font-semibold tracking-[0.5em] text-zinc-600">Established 2024</span>
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-zinc-700 to-transparent"></div>
        <span className="text-vertical text-[10px] uppercase font-semibold tracking-[0.5em] text-zinc-600">J&W Studios</span>
      </motion.div>

      {/* Central Content */}
      <div className="flex-1 relative flex flex-col px-6 md:px-16 pt-12 overflow-y-auto overflow-x-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-6"
        >
          <div>
            <h1 className="font-serif text-5xl md:text-8xl leading-none tracking-tight text-white mb-4">
              J&W <span className="text-2xl md:text-4xl align-top text-red-500 font-sans">®</span>
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm font-medium tracking-[0.2em] uppercase">Visual Artifacts & Documentation</p>
          </div>
          <div className="text-left sm:text-right pt-2 md:pt-4">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Availability</p>
            <div className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
              <span className="text-[11px] font-semibold text-zinc-300 uppercase">Available for Sessions</span>
            </div>
          </div>
        </motion.div>

        {/* Photographers Grid */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Loading Artists...</p>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12 mb-16">
            {photographers.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              >
                <Link 
                  to={`/photographers/${p.id}`} 
                  className="relative group overflow-hidden border border-zinc-800 min-h-[500px] bg-zinc-900 transition-all duration-500 hover:border-zinc-600 cursor-pointer flex flex-col block"
                >
                  <div className="absolute inset-0 z-0">
                     <img 
                      src={p.cover_image || p.profile_image || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop"} 
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" 
                      alt={p.name} 
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none"></div>
                  
                  <div className="flex-1 w-full flex flex-col z-20 h-full justify-end p-8">
                    <div className="mb-4">
                      <h2 className="font-serif text-4xl inline-block text-white group-hover:text-red-400 transition-colors">{p.name}</h2>
                    </div>
                    <p className="text-xs font-medium tracking-widest uppercase text-zinc-400 mb-6 line-clamp-1">{p.bio || "Photographer"}</p>
                    
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-300 border-t border-zinc-800 pt-6">
                      <span className="line-clamp-1 max-w-[150px]">{p.pricing_rules || "Contact for Rates"}</span>
                      <span className="flex items-center gap-2 group-hover:text-white transition-colors">View Profile <span className="text-red-500 group-hover:translate-x-1 transition-transform">→</span></span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            
            {photographers.length === 0 && (
              <div className="col-span-full border border-dashed border-zinc-800 p-12 text-center">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500">No photographers registered yet.</p>
                <Link to="/login" className="inline-block mt-4 text-[10px] uppercase font-bold text-white hover:text-red-400 transition-colors">Become the first →</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Information Sidebar */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-96 border-l border-zinc-800 p-10 flex-col shrink-0 overflow-y-auto bg-[#050505]"
      >
        <div className="mb-8">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-10 border-b border-zinc-800 pb-4">Educational Briefs</h3>
          <ul className="space-y-10">
            {[
              { id: "01", title: "Mastering Light", text: "Harnessing natural light for cinematic depth and understanding the dynamic range of shadows." },
              { id: "02", title: "Composition Principles", text: "Beyond the rule of thirds: using leading lines, symmetry, and negative space to direct the eye." },
              { id: "03", title: "The Decisive Moment", text: "Anticipating action in street photography to capture authentic, unposed human experiences." },
              { id: "04", title: "Color Grade Theory", text: "Creating emotional resonance through complementary color palettes and controlled saturation." },
              { id: "05", title: "Subject Direction", text: "Techniques for making subjects feel natural, evoking genuine emotion rather than forced poses." },
              { id: "06", title: "Lens Selection", text: "Understanding focal length compression and depth of field for varied environmental storytelling." },
              { id: "07", title: "Post-Production", text: "Editing philosophies: enhancing the reality of an image without destroying its original authenticity." }
            ].map((item, i) => (
              <motion.li 
                key={item.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="flex gap-5 group"
              >
                <span className="font-serif italic text-2xl text-zinc-600 group-hover:text-red-500 transition-colors">{item.id}.</span>
                <div>
                  <h4 className="text-xs uppercase tracking-widest mb-2 font-bold text-zinc-300">{item.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">{item.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
