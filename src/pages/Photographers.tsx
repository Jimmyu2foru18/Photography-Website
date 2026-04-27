import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Photographer {
  id: string;
  name: string;
  bio: string;
  instagram?: string;
  cover_image?: string; // DB uses snake_case, API returns it
  profile_image?: string;
}

export function Photographers() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/photographers')
      .then(r => r.json())
      .then(data => {
        if (data.db_error_fallback_instructed || !Array.isArray(data)) {
          // Fallback array if DB is not available
          setPhotographers([
            {
              id: "james-mcguigan",
              name: "James McGuigan Jr",
              bio: "Pricing: 25 USD per 100 edited photos | 15 USD per 5 Polaroids. Open to negotiation.",
              instagram: "jimmyu2foru18",
              cover_image: "/jamesprofile/profile.jpg"
            },
            {
              id: "waleed-bhatti",
              name: "Waleed Bhatti",
              bio: "Capturing moments through a specialized lens. Contact for tailored packages.",
              instagram: "waleedb219",
              cover_image: "/waleedprofile/profile.jpg"
            }
          ]);
        } else {
          setPhotographers(data);
        }
      })
      .catch((err) => console.error("Error fetching photographers", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 font-sans text-zinc-100 bg-[#0a0a0a]">
      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-serif mb-4 text-white tracking-tight">The Photographers</h1>
        <p className="text-zinc-500 font-medium max-w-2xl mx-auto text-xs uppercase tracking-widest mt-4">
          Meet the artists behind the lens. Browse their portfolios and book a shoot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
        {photographers.map((p) => (
          <Link 
            key={p.id} 
            to={`/photographers/${p.id}`}
            className="group relative overflow-hidden aspect-[4/5] bg-zinc-900 border border-zinc-800 flex flex-col hover:border-zinc-500 transition-all duration-500 block"
          >
            {(p.cover_image || p.profile_image) && (
              <img 
                src={p.cover_image || p.profile_image} 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" 
                alt={p.name} 
              />
            )}
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/80 to-transparent z-10 pointer-events-none transition-all duration-500" />
            
            {p.instagram && (
              <a 
                href={`https://instagram.com/${p.instagram}`} 
                target="_blank" 
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()} // Prevent card click
                className="absolute top-6 right-6 z-30 bg-black/40 hover:bg-black/80 backdrop-blur text-zinc-300 hover:text-white p-3 rounded-full transition-colors border border-zinc-700 hover:border-zinc-500"
                title={`@${p.instagram}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            )}

            <div className="absolute inset-0 p-8 z-20 flex flex-col justify-end">
               <h2 className="text-4xl font-serif text-white mb-4 group-hover:text-red-400 transition-colors">{p.name}</h2>
               <div className="border-t border-zinc-800 pt-6 mt-2">
                 <p className="text-zinc-400 text-xs line-clamp-2 max-w-md font-medium leading-relaxed uppercase tracking-widest">{p.bio}</p>
                 <span className="inline-block mt-4 text-[10px] uppercase font-bold tracking-widest text-zinc-300 group-hover:text-white transition-colors flex items-center gap-2">View Profile <span className="text-red-500 group-hover:translate-x-1 transition-transform">→</span></span>
               </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
