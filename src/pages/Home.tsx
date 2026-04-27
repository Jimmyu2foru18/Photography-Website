import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="flex-1 flex flex-col md:flex-row h-full w-full bg-[#0a0a0a] text-zinc-100 font-sans">
      {/* Left Branding Rail */}
      <div className="hidden md:flex w-24 border-r border-zinc-800 flex-col items-center py-12 justify-between shrink-0 bg-black">
        <span className="text-vertical rotate-180 text-[10px] uppercase font-semibold tracking-[0.5em] text-zinc-600">Established 2024</span>
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-zinc-700 to-transparent"></div>
        <span className="text-vertical text-[10px] uppercase font-semibold tracking-[0.5em] text-zinc-600">J&W Studios</span>
      </div>

      {/* Central Content */}
      <div className="flex-1 relative flex flex-col px-6 md:px-16 pt-12 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-6">
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
        </div>

        {/* Photographers Grid */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Photographer 1: James */}
          <Link to="/photographers/james-mcguigan" className="relative group overflow-hidden border border-zinc-800 min-h-[500px] mb-8 bg-zinc-900 transition-all duration-500 hover:border-zinc-600 cursor-pointer flex flex-col block">
            <div className="absolute inset-0 z-0">
               <img src="/jamesprofile/profile.jpg" className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" alt="James McGuigan Jr" />
            </div>
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex-1 w-full flex flex-col z-20 h-full justify-end p-8">
              <div className="mb-4">
                <h2 className="font-serif text-4xl inline-block text-white group-hover:text-red-400 transition-colors">James McGuigan Jr</h2>
              </div>
              <p className="text-xs font-medium tracking-widest uppercase text-zinc-400 mb-6">Portrait & Event Specialist</p>
              
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-300 border-t border-zinc-800 pt-6">
                <span>25 USD / 100 Edited</span>
                <span className="flex items-center gap-2 group-hover:text-white transition-colors">View Profile <span className="text-red-500 group-hover:translate-x-1 transition-transform">→</span></span>
              </div>
            </div>
          </Link>

          {/* Photographer 2: Waleed */}
          <Link to="/photographers/waleed-bhatti" className="relative group overflow-hidden border border-zinc-800 min-h-[500px] mb-8 bg-zinc-900 transition-all duration-500 hover:border-zinc-600 flex flex-col cursor-pointer block">
            <div className="absolute inset-0 z-0">
               <img src="/waleedprofile/profile.jpg" className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700" alt="Waleed Bhatti" />
            </div>
            <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/60 to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex-1 w-full flex flex-col z-20 h-full justify-end p-8">
              <div className="mb-4">
                <h2 className="font-serif text-4xl text-white inline-block group-hover:text-red-400 transition-colors">Waleed Bhatti</h2>
              </div>
              <p className="text-xs font-medium tracking-widest uppercase text-zinc-400 mb-6">Artistic & Street Photography</p>
              
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-zinc-300 border-t border-zinc-800 pt-6">
                <span>Contact for Rates</span>
                <span className="flex items-center gap-2 group-hover:text-white transition-colors">View Gallery <span className="text-red-500 group-hover:translate-x-1 transition-transform">→</span></span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Right Information Sidebar */}
      <div className="hidden lg:flex w-96 border-l border-zinc-800 p-10 flex-col shrink-0 overflow-y-auto bg-[#050505]">
        <div className="mb-8">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-10 border-b border-zinc-800 pb-4">Educational Briefs</h3>
          <ul className="space-y-10">
            <li className="flex gap-5 group">
              <span className="font-serif italic text-2xl text-zinc-600 group-hover:text-red-500 transition-colors">01.</span>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2 font-bold text-zinc-300">Mastering Light</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Harnessing natural light for cinematic depth and understanding the dynamic range of shadows.</p>
              </div>
            </li>
            <li className="flex gap-5 group">
              <span className="font-serif italic text-2xl text-zinc-600 group-hover:text-red-500 transition-colors">02.</span>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2 font-bold text-zinc-300">Composition Principles</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Beyond the rule of thirds: using leading lines, symmetry, and negative space to direct the eye.</p>
              </div>
            </li>
            <li className="flex gap-5 group">
              <span className="font-serif italic text-2xl text-zinc-600 group-hover:text-red-500 transition-colors">03.</span>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2 font-bold text-zinc-300">The Decisive Moment</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Anticipating action in street photography to capture authentic, unposed human experiences.</p>
              </div>
            </li>
            <li className="flex gap-5 group">
              <span className="font-serif italic text-2xl text-zinc-600 group-hover:text-red-500 transition-colors">04.</span>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2 font-bold text-zinc-300">Color Grade Theory</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Creating emotional resonance through complementary color palettes and controlled saturation.</p>
              </div>
            </li>
            <li className="flex gap-5 group">
              <span className="font-serif italic text-2xl text-zinc-600 group-hover:text-red-500 transition-colors">05.</span>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2 font-bold text-zinc-300">Subject Direction</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Techniques for making subjects feel natural, evoking genuine emotion rather than forced poses.</p>
              </div>
            </li>
            <li className="flex gap-5 group">
              <span className="font-serif italic text-2xl text-zinc-600 group-hover:text-red-500 transition-colors">06.</span>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2 font-bold text-zinc-300">Lens Selection</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Understanding focal length compression and depth of field for varied environmental storytelling.</p>
              </div>
            </li>
            <li className="flex gap-5 group">
              <span className="font-serif italic text-2xl text-zinc-600 group-hover:text-red-500 transition-colors">07.</span>
              <div>
                <h4 className="text-xs uppercase tracking-widest mb-2 font-bold text-zinc-300">Post-Production</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">Editing philosophies: enhancing the reality of an image without destroying its original authenticity.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
