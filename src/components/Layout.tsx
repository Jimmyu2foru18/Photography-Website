import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const { appUser, signOut } = useAuth();
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const links = [
    { name: "Home", href: "/" },
    { name: "Photographers", href: "/photographers" },
    { name: "Education", href: "/education" },
  ];

  if (appUser?.role === "photographer") {
    links.push({ name: "Dashboard", href: "/dashboard" });
  } else if (appUser?.role === "admin") {
    links.push({ name: "Dashboard", href: "/dashboard" }, { name: "Admin", href: "/admin" });
  }

  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="bg-white text-black px-3 py-1 font-black text-sm group-hover:bg-zinc-200 transition-colors">J&W</div>
              <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-zinc-500 hidden sm:block">Creative Studio</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              
              {appUser ? (
                <div className="flex items-center space-x-6">
                  <span className="opacity-70 text-zinc-500">{appUser.role}</span>
                  <button onClick={signOut} className="hover:text-red-400 flex items-center transition-colors">
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="border border-zinc-700 px-5 py-2 hover:border-white hover:text-white transition-colors">
                  Login
                </Link>
              )}
            </nav>

            {/* Mobile Nav Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-zinc-500 hover:text-white transition-all duration-300"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                style={{ top: '64px' }}
              />
              
              {/* Menu Content */}
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="md:hidden fixed top-16 left-0 w-full z-50 bg-[#0a0a0a] border-b border-zinc-800 shadow-2xl overflow-hidden"
              >
                <div className="px-6 py-10 space-y-8">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-zinc-600 mb-4">Navigation</p>
                    <nav className="flex flex-col space-y-4">
                      {links.map((link, i) => (
                        <motion.div
                          key={link.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Link
                            to={link.href}
                            className="text-2xl font-serif text-white hover:text-red-500 transition-colors block"
                            onClick={() => setIsOpen(false)}
                          >
                            {link.name}
                          </Link>
                        </motion.div>
                      ))}
                    </nav>
                  </div>
                  
                  <div className="pt-8 border-t border-zinc-900">
                    <p className="text-[9px] uppercase font-bold tracking-[0.4em] text-zinc-600 mb-6">Identity</p>
                    {appUser ? (
                      <div className="flex flex-col space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest text-white">{appUser.name || "User"}</p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">{appUser.role}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => { signOut(); setIsOpen(false); }} 
                          className="w-full text-center py-4 border border-zinc-800 text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 hover:bg-red-500/5 transition-colors"
                        >
                          Terminate Session
                        </button>
                      </div>
                    ) : (
                      <Link 
                        to="/login" 
                        className="block w-full text-center py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-200 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        Portal Entry
                      </Link>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between items-center text-[9px] uppercase font-bold tracking-[0.3em] text-zinc-700">
                    <span>© {new Date().getFullYear()} J&W</span>
                    <div className="flex gap-4">
                      <span className="hover:text-zinc-500 transition-colors">IG</span>
                      <span className="hover:text-zinc-500 transition-colors">LI</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 w-full relative overflow-y-auto flex flex-col">
        <Outlet />
      </main>

      {!isHome && (
        <footer className="h-16 md:h-10 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-center md:justify-between px-4 sm:px-8 py-2 md:py-0 gap-2 md:gap-0 text-[10px] uppercase font-semibold tracking-[0.2em] text-zinc-600 bg-black">
          <div>Creative Output · Unfiltered</div>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">LinkedIn</span>
            <span className="hidden sm:block text-zinc-700">Portfolio © {new Date().getFullYear()}</span>
          </div>
        </footer>
      )}
    </div>
  );
}
