import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const { appUser, signOut } = useAuth();
  const location = useLocation();

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
              <button onClick={() => setIsOpen(!isOpen)} className="text-zinc-500 hover:text-white transition-colors">
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-[#0a0a0a] shadow-xl absolute w-full left-0">
            <div className="px-4 py-4 space-y-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-3 py-3 hover:text-white hover:bg-zinc-900"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {appUser ? (
                <button onClick={() => { signOut(); setIsOpen(false); }} className="w-full text-left px-3 py-3 hover:text-red-400 hover:bg-zinc-900 flex items-center text-red-500">
                   Sign Out
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-left px-3 py-3 hover:text-white hover:bg-zinc-900 flex items-center">
                   Login
                </Link>
              )}
            </div>
          </div>
        )}
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
