import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Instagram, Linkedin, CalendarCheck, Camera, Facebook } from "lucide-react";

export function Profile() {
  const { id } = useParams<{ id: string }>();
  const [photographer, setPhotographer] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback data
  const fallback = {
    "james-mcguigan": {
      id: "james-mcguigan",
      name: "James McGuigan Jr",
      bio: "I specialize in dynamic lighting and cinematic portraits. Open to negotiation via the messaging system to ensure you get the exact vibe you need.",
      pricingRules: "25 USD per 100 edited photos \n15 USD per 5 Polaroids",
      instagram: "https://www.instagram.com/jimmyu2foru18/",
      linkedin: "https://www.linkedin.com/in/james-mcguigan-jr-b26a5b317/",
      facebook: "https://www.facebook.com/jimmyu2foru18/",
      availability: "Available Weekends",
      equipment: "Nikon D3400, D5600, Canon Rebel T3, Polaroid",
      profileImage: "/jamesprofile/profile.jpg"
    },
    "waleed-bhatti": {
      id: "waleed-bhatti",
      name: "Waleed Bhatti",
      bio: "Dedicated to capturing authentic moments and raw emotion through the lens of a classic Nikon. Available for events, portraits, and street photography.",
      pricingRules: "Custom packages available upon request.",
      instagram: "https://www.instagram.com/waleedb219/",
      linkedin: "https://www.linkedin.com/in/waleed-bhatti-5127b2301/",
      facebook: "https://www.facebook.com/profile.php?id=100067090366463",
      availability: "Flexible Schedule",
      equipment: "Nikon D40X, Nikon D50 with audio/visual editing",
      profileImage: "/waleedprofile/profile.jpg"
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      if (!id) return;
      
      let usingFallbackImages = false;

      // Try API first
      try {
        const res = await fetch(`/api/photographers/${id}`);
        if (!res.ok) throw new Error("API failed");
        const data = await res.json();
        
        if (data.db_error_fallback_instructed) {
          throw new Error("DB instructed fallback");
        }
        
        setPhotographer({
          id: data.id,
          name: data.name,
          bio: data.bio,
          pricingRules: data.pricing_rules,
          instagram: data.instagram ? `https://www.instagram.com/${data.instagram}/` : "",
          linkedin: data.linkedin,
          facebook: data.facebook,
          availability: data.availability,
          equipment: data.equipment,
          profileImage: data.profile_image
        });

        const portRes = await fetch(`/api/photographers/${id}/portfolio`);
        if (portRes.ok) {
          const portData = await portRes.json();
          if (Array.isArray(portData) && portData.length > 0) {
            setPortfolio(portData);
          } else {
             usingFallbackImages = true;
          }
        } else {
           usingFallbackImages = true;
        }

      } catch (err) {
        console.warn("Using fallback profile due to DB connection", err);
        const selected = (fallback as any)[id];
        if (selected) {
          setPhotographer(selected);
        }
        usingFallbackImages = true;
      }

      if (usingFallbackImages) {
        try {
           const localRes = await fetch(`/api/local-portfolio/${id}`);
           if (localRes.ok) {
             const urls = await localRes.json();
             if (urls.length > 0) {
                setPortfolio(urls.map((url: string, i: number) => ({ id: `local-${i}`, imageUrl: url })));
                usingFallbackImages = false;
             }
           }
        } catch (e) {
           console.error("Local portfolio fetch failed", e);
        }
      }

      if (usingFallbackImages) {
          let urls: string[] = [];
          
          // Use Vite's static asset bundling to guarantee images load everywhere
          if (id === "james-mcguigan") {
            const staticImports = import.meta.glob('/src/assets/jamesportfolio/*.{png,jpg,jpeg,webp,avif,gif}', { eager: true });
            urls = Object.values(staticImports).map((m: any) => m.default || m) as string[];
          } else if (id === "waleed-bhatti") {
            const staticImports = import.meta.glob('/src/assets/waleedportfolio/*.{png,jpg,jpeg,webp,avif,gif}', { eager: true });
            urls = Object.values(staticImports).map((m: any) => m.default || m) as string[];
          }
  
          if (urls.length > 0) {
            setPortfolio(urls.map((url, i) => ({ id: `${i}`, imageUrl: url })));
          } else {
             // Standard placeholder fallbacks
             setPortfolio([
                { id: "1", imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop" },
                { id: "2", imageUrl: "https://images.unsplash.com/photo-1551322159-c2c62cdd33ff?q=80&w=600&auto=format&fit=crop" },
                { id: "3", imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format&fit=crop" }
             ]);
          }
        }
      
      setLoading(false);
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
            {photographer.bio}
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
              {photographer.pricingRules}
            </div>
            <div className="flex items-center gap-3 mb-10 text-[10px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
              <span className="text-zinc-300">{photographer.availability}</span>
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
            {portfolio.map((img) => (
              <div key={img.id} className="break-inside-avoid relative group border border-zinc-800 bg-zinc-900 overflow-hidden hover:border-zinc-500 transition-colors">
                <img src={img.imageUrl} alt="Portfolio item" className="w-full h-auto object-cover group-hover:scale-105 opacity-80 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0" loading="lazy" />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-black border border-zinc-800 p-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            No portfolio images available yet. 
            <br/><br/>
            <span className="text-zinc-600">
              (Images placed in <code className="lowercase bg-zinc-900 px-1 py-0.5">/src/assets/{id === 'james-mcguigan' ? 'jamesportfolio' : 'waleedportfolio'}</code> will automatically appear here.)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
