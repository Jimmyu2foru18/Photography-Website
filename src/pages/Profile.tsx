import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Instagram, Linkedin, CalendarCheck, Camera, Facebook, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const [photographer, setPhotographer] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (!id) return;
      
      try {
        const res = await fetch(`/api/photographers/${id}`);
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();
        
        if (data && !data.error) {
          const cacheBuster = `?t=${Date.now()}`;
          setPhotographer({
            id: data.id,
            name: data.name,
            email: data.email,
            bio: data.bio,
            pricingRules: data.pricing_rules,
            instagram: data.instagram ? `https://www.instagram.com/${data.instagram}/` : "",
            linkedin: data.linkedin,
            facebook: data.facebook,
            availability: data.availability,
            equipment: data.equipment,
            profileImage: data.profile_image ? (data.profile_image.includes('?t=') ? data.profile_image : `${data.profile_image}${cacheBuster}`) : "",
            coverImage: data.cover_image ? (data.cover_image.includes('?t=') ? data.cover_image : `${data.cover_image}${cacheBuster}`) : ""
          });

          // Fetch portfolio
          const portRes = await fetch(`/api/photographers/${id}/portfolio`);
          if (portRes.ok) {
            const portData = await portRes.json();
            if (Array.isArray(portData)) {
              setPortfolio(portData.map((item: any) => ({
                ...item,
                imageUrl: item.imageUrl.includes('?t=') ? item.imageUrl : `${item.imageUrl}${cacheBuster}`
              })));
            }
          }
        }
      } catch (err) {
        console.error("Profile fetch failed", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center font-serif text-xl bg-[#0a0a0a] text-zinc-100">Loading Artist...</div>;
  if (!photographer) return <div className="flex h-screen items-center justify-center font-serif text-xl bg-[#0a0a0a] text-zinc-100">Photographer Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 bg-[#0a0a0a] text-zinc-100 font-sans min-h-screen">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start mb-16">
        {photographer.profileImage && (
          <div className="w-full md:w-1/3 shrink-0">
            <div className="aspect-[3/4] overflow-hidden border border-zinc-800 bg-zinc-900">
              <img src={photographer.profileImage} alt={photographer.name} className="w-full h-full object-cover opacity-80" />
            </div>
          </div>
        )}
        <div className="flex-1 pt-4">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 tracking-tight text-white">{photographer.name}</h1>
          <p className="text-xs text-zinc-400 mb-8 uppercase font-medium tracking-[0.2em] leading-relaxed max-w-2xl border-l-[3px] border-red-500 pl-6 py-2">
            {photographer.bio || "No biography provided yet."}
          </p>
          
          {photographer.equipment && (
            <div className="flex items-start gap-4 mb-8 bg-zinc-900 border border-zinc-800 p-6 w-full max-w-lg">
              <Camera className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Gear & Equipment</h4>
                <p className="text-xs font-semibold text-zinc-300">{photographer.equipment}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-6 mb-10 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {photographer.instagram && (
              <a href={photographer.instagram} target="_blank" rel="noreferrer" className="flex items-center hover:text-white transition-colors">
                <Instagram className="w-4 h-4 mr-2" /> Instagram
              </a>
            )}
            {photographer.facebook && (
              <a href={photographer.facebook} target="_blank" rel="noreferrer" className="flex items-center hover:text-white transition-colors">
                <Facebook className="w-4 h-4 mr-2" /> Facebook
              </a>
            )}
            {photographer.linkedin && (
              <a href={photographer.linkedin} target="_blank" rel="noreferrer" className="flex items-center hover:text-white transition-colors">
                <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
              </a>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 w-full max-w-lg mb-8 relative group">
            <h3 className="text-[10px] uppercase font-bold tracking-widest text-white mb-6 border-b border-zinc-800 pb-4">Pricing & Services</h3>
            <div className="whitespace-pre-line text-zinc-400 font-semibold text-xs uppercase tracking-wider mb-8 leading-loose">
              {photographer.pricingRules || "Contact for tailored pricing."}
            </div>
            <div className="flex items-center gap-3 mb-10 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
              <span className="text-zinc-300">{photographer.availability || "Flexible Schedule"}</span>
            </div>
            
            <Link 
              to={`/booking/${photographer.id}`}
              className="inline-flex items-center justify-center w-full px-6 py-4 bg-white text-black hover:bg-zinc-200 transition-colors font-bold text-xs uppercase tracking-widest"
            >
              <CalendarCheck className="w-4 h-4 mr-3" />
              Request Shoot
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-20"></div>

      {/* Portfolio Grid */}
      <div className="space-y-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-10 border-b border-zinc-800 pb-4">Portfolio Gallery</h2>
        {portfolio.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
            {portfolio.map((img, i) => (
              <motion.div 
                key={img.id} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i % 3 * 0.1 }}
                className="break-inside-avoid relative group border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-500 transition-colors cursor-zoom-in"
                onClick={() => setSelectedImage(img.imageUrl)}
              >
                <img src={img.imageUrl} alt="Portfolio item" className="w-full h-auto object-cover group-hover:scale-105 opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" loading="lazy" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-black border border-zinc-800 p-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            No portfolio images available yet. 
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/98 backdrop-blur-md p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/40 hover:text-white transition-all z-[60] hover:rotate-90 duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X className="w-10 h-10" />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl max-h-[85vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                alt="Full view" 
                className="max-w-full max-h-[85vh] object-contain shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-zinc-800/50"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
